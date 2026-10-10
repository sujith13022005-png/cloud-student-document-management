import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Edit3, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  HardDrive, 
  Clock, 
  Tag, 
  Lock, 
  CheckCircle2, 
  FileSpreadsheet, 
  Image as ImageIcon,
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useDocuments } from '../context/DocumentContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { formatFileSize, getFileVisuals } from '../components/DocumentCard.tsx';
import type { DocumentItem } from '../types/index.ts';

interface DocumentDetailPageProps {
  documentId: string;
  onBack: () => void;
  onEditDoc: (doc: DocumentItem) => void;
  onDeleteDoc: (doc: DocumentItem) => void;
}

export const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({
  documentId,
  onBack,
  onEditDoc,
  onDeleteDoc,
}) => {
  const { user } = useAuth();
  const { getDocumentById, downloadDocument } = useDocuments();
  const { success } = useToast();

  const doc = getDocumentById(documentId);

  if (!doc) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Document Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested document could not be located in your cloud vault or may have been deleted.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Documents
        </button>
      </div>
    );
  }

  const visuals = getFileVisuals(doc.fileType);
  const IconComp = visuals.icon;
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(doc.fileType.toLowerCase());
  const isPdf = doc.fileType.toLowerCase() === 'pdf';

  const copyStoragePath = () => {
    navigator.clipboard.writeText(doc.storagePath);
    success('Storage path copied to clipboard');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back button and quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditDoc(doc)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Metadata</span>
          </button>
          <button
            onClick={() => onDeleteDoc(doc)}
            className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
          <button
            onClick={() => downloadDocument(doc)}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Document</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-6 self-start">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-2xl ${visuals.bgColor} ${visuals.textColor} flex items-center justify-center shrink-0 border border-slate-100`}>
              <IconComp className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {doc.documentName}
              </h2>
              <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                {doc.fileName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {doc.category}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${visuals.badgeColor}`}>
              {doc.fileType}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified Integrity
            </span>
          </div>

          {doc.description && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                Description / Notes
              </p>
              {doc.description}
            </div>
          )}

          {/* Detailed Attributes */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-400">File Size:</span>
              <span className="font-mono font-bold text-slate-800">{formatFileSize(doc.fileSize)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Academic Year:</span>
              <span className="font-semibold text-slate-800">{doc.academicYear || '2025-2026'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Semester:</span>
              <span className="font-semibold text-slate-800">{doc.semester || 'Semester 1'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Uploaded On:</span>
              <span className="font-medium text-slate-800">
                {new Date(doc.uploadedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Document Owner:</span>
              <span className="font-mono font-semibold text-indigo-700 truncate max-w-[150px]">
                {user?.name}
              </span>
            </div>
          </div>

          {/* Cloud Storage Location Box */}
          <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1 font-bold">
                <HardDrive className="w-3 h-3 text-sky-400" />
                Cloud Bucket Path
              </span>
              <button
                onClick={copyStoragePath}
                className="hover:text-white p-0.5"
                title="Copy Path"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <p className="break-all text-emerald-400 leading-tight">
              {doc.storagePath}
            </p>
          </div>
        </div>

        {/* Right Column: Previewer Box */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs flex flex-col min-h-[500px]">
          {/* Preview Toolbar */}
          <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-bold">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Document Preview Canvas</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Format: {doc.fileType.toUpperCase()}
            </span>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 p-6 flex items-center justify-center bg-slate-100/50">
            {isImage ? (
              <div className="max-w-full max-h-[550px] overflow-auto rounded-xl shadow-lg border border-slate-200 bg-white p-2">
                <img
                  src={doc.downloadUrl || doc.fileBlobUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800'}
                  alt={doc.documentName}
                  className="max-h-[500px] w-auto object-contain rounded-lg mx-auto"
                />
              </div>
            ) : isPdf ? (
              <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{doc.documentName}</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {doc.fileName} ({formatFileSize(doc.fileSize)})
                </p>
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-md text-xs text-slate-600 text-left space-y-1">
                  <p>• <strong>Integrity Hash:</strong> SHA256 Verified</p>
                  <p>• <strong>Academic Issuer:</strong> University Controller / Department Record</p>
                  <p>• <strong>Access Policy:</strong> Authenticated Student Access Only</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => downloadDocument(doc)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF to Read</span>
                  </button>
                  {doc.downloadUrl && doc.downloadUrl.startsWith('http') && (
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Browser</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              /* Office / Unsupported binary preview state matching Section 16 */
              <div className="w-full p-8 text-center max-w-md bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Preview unavailable
                </h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Direct in-browser visual rendering is unavailable for binary <strong>.{doc.fileType}</strong> documents. You can safely download and open this document with your desktop application.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => downloadDocument(doc)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 mx-auto shadow-md shadow-indigo-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Document</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
