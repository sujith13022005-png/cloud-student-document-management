export type UserRole = 'student' | 'admin';

export interface UserProfile {
  userId: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  programme: string;
  year: string;
  role: UserRole;
  profileImage?: string;
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory =
  | 'Academic'
  | 'Certificate'
  | 'Identity'
  | 'Fee'
  | 'Internship'
  | 'Project'
  | 'Resume'
  | 'Other';

export interface DocumentItem {
  documentId: string;
  userId: string;
  fileName: string;
  documentName: string;
  category: DocumentCategory;
  description: string;
  fileType: string; // pdf, doc, docx, jpg, png, xlsx, etc.
  fileSize: number; // in bytes
  storagePath: string;
  downloadUrl: string;
  academicYear: string;
  semester: string;
  uploadedAt: string;
  updatedAt: string;
  // Local cached blob reference for preview / offline demo download
  fileBlobUrl?: string;
  mimeType?: string;
}

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'upload'
  | 'download'
  | 'delete'
  | 'rename'
  | 'update_profile';

export interface ActivityItem {
  activityId: string;
  userId: string;
  action: ActivityAction;
  documentId?: string;
  documentName?: string;
  details?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface StorageStats {
  usedBytes: number;
  maxBytes: number; // 5 GB = 5368709120
  totalFiles: number;
  byCategory: Record<DocumentCategory, number>;
  largestFiles: DocumentItem[];
}

export interface FirebaseConfigState {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  isConfigured: boolean;
  statusMessage?: string;
}
