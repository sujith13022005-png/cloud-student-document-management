import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  FileCheck2, 
  HardDrive, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useDocuments } from '../context/DocumentContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { formatFileSize, getFileVisuals } from '../components/DocumentCard.tsx';
import type { DocumentCategory } from '../types/index.ts';

interface UploadPageProps {
  onNavigate: (path: string) => void;
}

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx'];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const CATEGORIES: DocumentCategory[] = [
  'Academic',
  'Certificate',
  'Identity',
  'Fee',
  'Internship',
  'Project',
  'Resume',
  'Other',
];

export const UploadPage: React.FC<UploadPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { uploadDocument, storageStats } = useDocuments();
  const { success, error, warning } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Academic');
  const [description, setDescription] = useState('');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [semester, setSemester] = useState('Semester 2');

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateAndSetFile = (file: File) => {
    setValidationError('');
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    // Check extension
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setValidationError(`Unsupported file type (.${ext}). Allowed formats: ${ALLOWED_EXTENSIONS.map((e) => e.toUpperCase()).join(', ')}`);
      return false;
    }

    // Check size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(`File size (${formatFileSize(file.size)}) exceeds the maximum allowed limit of 25 MB.`);
      return false;
    }

    // Check quota limit
    if (storageStats.usedBytes + file.size > storageStats.maxBytes) {
      setValidationError('Cloud storage limit exceeded! Free up space by deleting older files.');
      return false;
    }

    setSelectedFile(file);
    // Autofill clean document name if blank
    if (!documentName) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setDocumentName(cleanName.replace(/\b\w/g, (c) => c.toUpperCase()));
    }
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError('Please select or drag a document file to upload.');
      return;
    }

    if (!documentName.trim()) {
      setValidationError('Please specify a document display name.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const ok = await uploadDocument(
      {
        file: selectedFile,
        documentName: documentName.trim(),
        category,
        description: description.trim(),
        academicYear,
        semester,
      },
      (percent) => {
        setUploadProgress(percent);
      }
    );

    setIsUploading(false);

    if (ok) {
      setSelectedFile(null);
      setDocumentName('');
      setDescription('');
      onNavigate('/documents');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Upload Academic Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Store mark sheets, degrees, certificates, and ID records securely in Firebase Cloud Storage.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Storage status banner */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <span>Path: <strong className="font-mono text-slate-800">students/{user?.studentId || 'uid'}/documents/</strong></span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Protected Cloud Storage</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {validationError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Upload Validation Error</p>
                <p className="mt-0.5">{validationError}</p>
              </div>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select or Drop File *
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/70 scale-[0.99]'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                onChange={handleFileChange}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedFile.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Academic File'}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-3 text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Change File</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 border border-indigo-100">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Drag & Drop your academic document here
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    or <span className="text-indigo-600 font-bold underline">browse files</span> from your computer
                  </p>
                  <p className="text-[11px] text-slate-400 mt-3">
                    Supported: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (Max 25 MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Document Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Display Name *
              </label>
              <input
                type="text"
                required
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g. Master of Computer Applications Semester 1 Marksheet"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Year *
              </label>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2025-2026"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Semester / Academic Term
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="Semester 1 / Semester 2"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Storage Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Access Level
              </label>
              <div className="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                Confidential (Student Vault Only)
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description / Issuing Authority Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details such as issuing university, exam session, GPA, or certification ID..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Progress Indicator */}
          {isUploading && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                <span>Streaming document to Cloud Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('/documents')}
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading to Cloud...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
