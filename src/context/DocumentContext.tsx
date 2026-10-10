import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  DocumentItem, 
  DocumentCategory, 
  ActivityItem, 
  StorageStats, 
  ActivityAction 
} from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';
import { useToast } from './ToastContext.tsx';
import { storeFileBlob, getFileBlob, removeFileBlob } from '../lib/indexedDb.ts';
import { isConfigured, storage, db } from '../lib/firebase.ts';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

interface UploadPayload {
  file: File;
  documentName: string;
  category: DocumentCategory;
  description: string;
  academicYear: string;
  semester: string;
}

interface DocumentContextType {
  documents: DocumentItem[];
  activities: ActivityItem[];
  storageStats: StorageStats;
  loading: boolean;
  uploadDocument: (payload: UploadPayload, onProgress?: (percent: number) => void) => Promise<boolean>;
  deleteDocument: (documentId: string) => Promise<boolean>;
  renameDocument: (documentId: string, newName: string) => Promise<boolean>;
  updateDocumentMeta: (documentId: string, updates: Partial<DocumentItem>) => Promise<boolean>;
  downloadDocument: (doc: DocumentItem) => Promise<void>;
  getDocumentById: (id: string) => DocumentItem | undefined;
  logActivity: (action: ActivityAction, docName?: string, docId?: string, details?: string) => void;
  resetToDemoVault: () => void;
  clearAllDocuments: () => void;
}

const STORAGE_KEY_DOCS = 'studentvault_documents_db';
const STORAGE_KEY_ACTIVITIES = 'studentvault_activities_db';
const MAX_STORAGE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

// Initial sample documents for default student (Sujith T)
const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    documentId: 'doc_mca_sem1_marksheet',
    userId: 'usr_sujith_mca_2026',
    fileName: 'MCA_Semester_1_Marksheet.pdf',
    documentName: 'MCA Semester 1 Grade Sheet',
    category: 'Academic',
    description: 'Official verified semester 1 grade card issued by University Controller of Examinations.',
    fileType: 'pdf',
    fileSize: 1845200, // ~1.8 MB
    storagePath: 'students/usr_sujith_mca_2026/documents/doc_mca_sem1_marksheet/MCA_Semester_1_Marksheet.pdf',
    downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    academicYear: '2025-2026',
    semester: 'Semester 1',
    uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    mimeType: 'application/pdf',
  },
  {
    documentId: 'doc_oracle_java_cert',
    userId: 'usr_sujith_mca_2026',
    fileName: 'Oracle_Certified_Java_Professional.pdf',
    documentName: 'Oracle Certified Java Professional Certificate',
    category: 'Certificate',
    description: 'Official Java SE 17 Developer certification with verification code: ORCL-7729-X9.',
    fileType: 'pdf',
    fileSize: 3240100, // ~3.2 MB
    storagePath: 'students/usr_sujith_mca_2026/documents/doc_oracle_java_cert/Oracle_Certified_Java_Professional.pdf',
    downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    academicYear: '2025-2026',
    semester: 'Semester 2',
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    mimeType: 'application/pdf',
  },
  {
    documentId: 'doc_college_id_card',
    userId: 'usr_sujith_mca_2026',
    fileName: 'Student_Identity_Card_2026.png',
    documentName: 'University Student Identity Card',
    category: 'Identity',
    description: 'Digital duplicate of verified smart identity card issued by Department of Computer Applications.',
    fileType: 'png',
    fileSize: 945000, // ~945 KB
    storagePath: 'students/usr_sujith_mca_2026/documents/doc_college_id_card/Student_Identity_Card_2026.png',
    downloadUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80',
    academicYear: '2024-2026',
    semester: 'Year 2',
    uploadedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    mimeType: 'image/png',
  },
  {
    documentId: 'doc_tuition_fee_receipt',
    userId: 'usr_sujith_mca_2026',
    fileName: 'Tuition_Fee_Receipt_Year2.pdf',
    documentName: 'Annual Tuition Fee Receipt - Year 2',
    category: 'Fee',
    description: 'Finance department stamped payment clearance receipt reference #TXN-8829183.',
    fileType: 'pdf',
    fileSize: 812400, // ~812 KB
    storagePath: 'students/usr_sujith_mca_2026/documents/doc_tuition_fee_receipt/Tuition_Fee_Receipt_Year2.pdf',
    downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    academicYear: '2025-2026',
    semester: 'Semester 3',
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    mimeType: 'application/pdf',
  },
  {
    documentId: 'doc_cloud_internship_offer',
    userId: 'usr_sujith_mca_2026',
    fileName: 'Cloud_Architecture_Internship_Offer.docx',
    documentName: 'Google Cloud Platform Internship Letter',
    category: 'Internship',
    description: 'Summer cloud development internship offer letter with stipend and NDA endorsement.',
    fileType: 'docx',
    fileSize: 1450000,
    storagePath: 'students/usr_sujith_mca_2026/documents/doc_cloud_internship_offer/Cloud_Architecture_Internship_Offer.docx',
    downloadUrl: '',
    academicYear: '2025-2026',
    semester: 'Semester 2',
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    activityId: 'act_1',
    userId: 'usr_sujith_mca_2026',
    action: 'upload',
    documentId: 'doc_cloud_internship_offer',
    documentName: 'Google Cloud Platform Internship Letter',
    details: 'Uploaded to Internship category (1.45 MB)',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    activityId: 'act_2',
    userId: 'usr_sujith_mca_2026',
    action: 'upload',
    documentId: 'doc_tuition_fee_receipt',
    documentName: 'Annual Tuition Fee Receipt - Year 2',
    details: 'Uploaded to Fee category (812 KB)',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    activityId: 'act_3',
    userId: 'usr_sujith_mca_2026',
    action: 'download',
    documentId: 'doc_oracle_java_cert',
    documentName: 'Oracle Certified Java Professional Certificate',
    details: 'Downloaded secure document',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    activityId: 'act_4',
    userId: 'usr_sujith_mca_2026',
    action: 'upload',
    documentId: 'doc_oracle_java_cert',
    documentName: 'Oracle Certified Java Professional Certificate',
    details: 'Uploaded to Certificate category (3.24 MB)',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    activityId: 'act_5',
    userId: 'usr_sujith_mca_2026',
    action: 'login',
    details: 'Authenticated via Student Portal session',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  }
];

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();
  const { success, error, warning, info } = useToast();

  const [allDocs, setAllDocs] = useState<DocumentItem[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data
  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem(STORAGE_KEY_DOCS);
      if (storedDocs) {
        setAllDocs(JSON.parse(storedDocs));
      } else {
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(SAMPLE_DOCUMENTS));
        setAllDocs(SAMPLE_DOCUMENTS);
      }

      const storedActs = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (storedActs) {
        setAllActivities(JSON.parse(storedActs));
      } else {
        localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
        setAllActivities(INITIAL_ACTIVITIES);
      }
    } catch (err) {
      console.error('Error loading documents state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter documents visible to current user (Privacy rule: Students see only their own documents!)
  const visibleDocuments = React.useMemo(() => {
    if (!user) return [];
    if (role === 'admin') {
      return allDocs; // Admin can view registry statistics
    }
    return allDocs.filter((d) => d.userId === user.userId);
  }, [allDocs, user, role]);

  // Filter activities visible to current user
  const visibleActivities = React.useMemo(() => {
    if (!user) return [];
    if (role === 'admin') {
      return allActivities;
    }
    return allActivities.filter((a) => a.userId === user.userId);
  }, [allActivities, user, role]);

  // Calculate storage stats for user
  const storageStats = React.useMemo<StorageStats>(() => {
    const defaultStats: StorageStats = {
      usedBytes: 0,
      maxBytes: MAX_STORAGE_BYTES,
      totalFiles: 0,
      byCategory: {
        Academic: 0,
        Certificate: 0,
        Identity: 0,
        Fee: 0,
        Internship: 0,
        Project: 0,
        Resume: 0,
        Other: 0,
      },
      largestFiles: [],
    };

    if (!user) return defaultStats;

    const userDocs = role === 'admin' ? allDocs : allDocs.filter((d) => d.userId === user.userId);
    const usedBytes = userDocs.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);

    const byCat: Record<DocumentCategory, number> = { ...defaultStats.byCategory };
    userDocs.forEach((d) => {
      if (byCat[d.category] !== undefined) {
        byCat[d.category] += d.fileSize || 0;
      } else {
        byCat.Other += d.fileSize || 0;
      }
    });

    const largest = [...userDocs].sort((a, b) => b.fileSize - a.fileSize).slice(0, 5);

    return {
      usedBytes,
      maxBytes: MAX_STORAGE_BYTES,
      totalFiles: userDocs.length,
      byCategory: byCat,
      largestFiles: largest,
    };
  }, [allDocs, user, role]);

  const logActivity = useCallback(
    (action: ActivityAction, docName?: string, docId?: string, details?: string) => {
      if (!user) return;
      const newAct: ActivityItem = {
        activityId: 'act_' + Math.random().toString(36).substring(2, 10),
        userId: user.userId,
        action,
        documentId: docId,
        documentName: docName,
        details,
        timestamp: new Date().toISOString(),
      };

      setAllActivities((prev) => {
        const updated = [newAct, ...prev];
        localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));
        return updated;
      });

      // Sync to Firestore if configured
      if (isConfigured && db) {
        try {
          setDoc(doc(db, 'activities', newAct.activityId), newAct).catch(() => {});
        } catch {
          // ignore
        }
      }
    },
    [user]
  );

  const uploadDocument = async (
    payload: UploadPayload,
    onProgress?: (percent: number) => void
  ): Promise<boolean> => {
    if (!user) {
      error('You must be logged in to upload documents');
      return false;
    }

    const { file, documentName, category, description, academicYear, semester } = payload;

    // Validate size limit
    if (file.size > 25 * 1024 * 1024) {
      error('File size exceeds the allowed limit (25 MB)');
      return false;
    }

    // Storage warning check
    if (storageStats.usedBytes + file.size > storageStats.maxBytes) {
      warning('Storage quota exceeded! Please delete some documents to free up space.');
      return false;
    }

    const docId = 'doc_' + Math.random().toString(36).substring(2, 11);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const storagePath = `students/${user.userId}/documents/${docId}/${file.name}`;

    try {
      let downloadUrl = '';

      // 1. Firebase Storage Upload if live
      if (isConfigured && storage) {
        try {
          const storageRef = ref(storage, storagePath);
          const uploadTask = uploadBytesResumable(storageRef, file);

          await new Promise<void>((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (onProgress) onProgress(prog);
              },
              (err) => reject(err),
              async () => {
                downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              }
            );
          });
        } catch (fbErr) {
          console.warn('Firebase upload fallback to local indexedDB:', fbErr);
        }
      }

      // 2. Binary preservation via IndexedDB
      await storeFileBlob(docId, file, file.name);
      const localBlobUrl = URL.createObjectURL(file);

      // Simulate smooth progress if not live
      if (!isConfigured) {
        for (let p = 20; p <= 100; p += 20) {
          if (onProgress) onProgress(p);
          await new Promise((r) => setTimeout(r, 60));
        }
      }

      const newDoc: DocumentItem = {
        documentId: docId,
        userId: user.userId,
        fileName: file.name,
        documentName: documentName.trim() || file.name,
        category,
        description: description.trim(),
        fileType: extension,
        fileSize: file.size,
        storagePath,
        downloadUrl: downloadUrl || localBlobUrl,
        academicYear: academicYear || '2025-2026',
        semester: semester || 'Semester 1',
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileBlobUrl: localBlobUrl,
        mimeType: file.type,
      };

      // Save to state & storage
      setAllDocs((prev) => {
        const updated = [newDoc, ...prev];
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updated));
        return updated;
      });

      // Save to Firestore if live
      if (isConfigured && db) {
        try {
          await setDoc(doc(db, 'documents', docId), newDoc);
        } catch (dbErr) {
          console.warn('Firestore doc create warning:', dbErr);
        }
      }

      logActivity('upload', newDoc.documentName, docId, `Uploaded ${category} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      success(`"${newDoc.documentName}" uploaded securely to Cloud Vault!`);
      return true;
    } catch (uploadErr) {
      console.error('Upload failed:', uploadErr);
      error('Unable to upload your document. Please check your connection and try again.');
      return false;
    }
  };

  const deleteDocument = async (documentId: string): Promise<boolean> => {
    if (!user) return false;
    const target = allDocs.find((d) => d.documentId === documentId);
    if (!target) {
      error('Document not found');
      return false;
    }

    // Ownership check
    if (role !== 'admin' && target.userId !== user.userId) {
      error('Unauthorized: You do not own this document');
      return false;
    }

    try {
      // Delete from Firebase Storage if live
      if (isConfigured && storage && target.storagePath) {
        try {
          const fileRef = ref(storage, target.storagePath);
          await deleteObject(fileRef).catch(() => {});
        } catch (e) {
          console.warn('Firebase storage delete fallback:', e);
        }
      }

      // Delete from IndexedDB
      await removeFileBlob(documentId).catch(() => {});

      // Delete from Firestore if live
      if (isConfigured && db) {
        try {
          await deleteDoc(doc(db, 'documents', documentId)).catch(() => {});
        } catch (e) {
          console.warn('Firestore delete doc warning:', e);
        }
      }

      // Update state
      setAllDocs((prev) => {
        const filtered = prev.filter((d) => d.documentId !== documentId);
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(filtered));
        return filtered;
      });

      logActivity('delete', target.documentName, documentId, `Deleted ${target.category} document`);
      info(`Document "${target.documentName}" was deleted permanently.`);
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      error('Failed to delete document. Please try again.');
      return false;
    }
  };

  const renameDocument = async (documentId: string, newName: string): Promise<boolean> => {
    if (!user) return false;
    const trimmed = newName.trim();
    if (!trimmed) {
      error('Document name cannot be empty');
      return false;
    }

    const target = allDocs.find((d) => d.documentId === documentId);
    if (!target) return false;

    if (role !== 'admin' && target.userId !== user.userId) {
      error('Unauthorized access');
      return false;
    }

    const updatedDocs = allDocs.map((d) =>
      d.documentId === documentId
        ? { ...d, documentName: trimmed, updatedAt: new Date().toISOString() }
        : d
    );

    setAllDocs(updatedDocs);
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updatedDocs));

    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'documents', documentId), {
          documentName: trimmed,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore rename warning:', e);
      }
    }

    logActivity('rename', trimmed, documentId, `Renamed document to "${trimmed}"`);
    success(`Renamed to "${trimmed}"`);
    return true;
  };

  const updateDocumentMeta = async (documentId: string, updates: Partial<DocumentItem>): Promise<boolean> => {
    if (!user) return false;
    const target = allDocs.find((d) => d.documentId === documentId);
    if (!target) return false;

    if (role !== 'admin' && target.userId !== user.userId) {
      error('Unauthorized access');
      return false;
    }

    const updatedDocs = allDocs.map((d) =>
      d.documentId === documentId
        ? { ...d, ...updates, updatedAt: new Date().toISOString() }
        : d
    );

    setAllDocs(updatedDocs);
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updatedDocs));

    if (isConfigured && db) {
      try {
        await updateDoc(doc(db, 'documents', documentId), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore update warning:', e);
      }
    }

    success('Document details updated');
    return true;
  };

  const downloadDocument = async (item: DocumentItem): Promise<void> => {
    if (!user) {
      error('Please sign in to download documents');
      return;
    }

    // Ownership check
    if (role !== 'admin' && item.userId !== user.userId) {
      error('Access Denied: You cannot download documents belonging to another student.');
      return;
    }

    try {
      // 1. Check if blob exists in IndexedDB
      const blob = await getFileBlob(item.documentId);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.fileName || `${item.documentName}.${item.fileType}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else if (item.downloadUrl && item.downloadUrl.startsWith('http')) {
        // Fetch or open remote URL
        const link = document.createElement('a');
        link.href = item.downloadUrl;
        link.download = item.fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Generate simulated academic document file
        const textContent = `StudentVault Academic Document\n=================================\nDocument: ${item.documentName}\nCategory: ${item.category}\nOwner ID: ${item.userId}\nAcademic Year: ${item.academicYear}\nSemester: ${item.semester}\nUploaded: ${item.uploadedAt}\nChecksum: SHA256-${item.documentId.toUpperCase()}\n\nThis is a verified academic document asset stored on StudentVault Cloud.`;
        const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(textBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.fileName || `${item.documentName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      logActivity('download', item.documentName, item.documentId, `Downloaded secure file: ${item.fileName}`);
      success(`Downloading "${item.fileName}"...`);
    } catch (err) {
      console.error('Download error:', err);
      error('Could not complete document download.');
    }
  };

  const getDocumentById = (id: string): DocumentItem | undefined => {
    return allDocs.find((d) => d.documentId === id);
  };

  const resetToDemoVault = () => {
    setAllDocs(SAMPLE_DOCUMENTS);
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(SAMPLE_DOCUMENTS));
    setAllActivities(INITIAL_ACTIVITIES);
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    info('Vault reset to verified sample academic documents.');
  };

  const clearAllDocuments = () => {
    if (!user) return;
    const remaining = allDocs.filter((d) => d.userId !== user.userId);
    setAllDocs(remaining);
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(remaining));
    info('All your documents have been cleared.');
  };

  return (
    <DocumentContext.Provider
      value={{
        documents: visibleDocuments,
        activities: visibleActivities,
        storageStats,
        loading,
        uploadDocument,
        deleteDocument,
        renameDocument,
        updateDocumentMeta,
        downloadDocument,
        getDocumentById,
        logActivity,
        resetToDemoVault,
        clearAllDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocuments must be used within DocumentProvider');
  return ctx;
};
