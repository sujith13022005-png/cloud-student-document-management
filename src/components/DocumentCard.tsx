import React, { useState } from 'react';
import { 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  FileCheck2, 
  Download, 
  Eye, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Calendar,
  Lock,
  Tag
} from 'lucide-react';
import type { DocumentItem } from '../types/index.ts';

interface DocumentCardProps {
  document: DocumentItem;
  onView: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onEdit: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFileVisuals(type: string) {
  const ext = type.toLowerCase();
  if (ext === 'pdf') {
    return {
      icon: FileText,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    };
  }
  if (['doc', 'docx'].includes(ext)) {
    return {
      icon: FileText,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    };
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return {
      icon: FileSpreadsheet,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
  }
  if (['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(ext)) {
    return {
      icon: ImageIcon,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    };
  }
  return {
    icon: FileCode,
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
  };
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const visuals = getFileVisuals(document.fileType);
  const IconComponent = visuals.icon;

  const dateFormatted = new Date(document.uploadedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Banner & Icon */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* File Icon */}
          <div className={`w-12 h-12 rounded-xl ${visuals.bgColor} ${visuals.textColor} flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs`}>
            <IconComponent className="w-6 h-6" />
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div 
                className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 text-xs animate-in fade-in zoom-in-95"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onView(document);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  Preview & Details
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDownload(document);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Download File
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(document);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  Edit Metadata
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(document);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Delete Document
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Document Title & File Name */}
        <div className="mt-3.5">
          <h4 
            onClick={() => onView(document)}
            className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
            title={document.documentName}
          >
            {document.documentName}
          </h4>
          <p className="text-[11px] text-slate-600 font-mono truncate mt-0.5" title={document.fileName}>
            {document.fileName}
          </p>
        </div>

        {/* Description */}
        {document.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {document.description}
          </p>
        )}
      </div>

      {/* Meta Pills & Footer */}
      <div className="px-5 pb-4 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {document.category}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${visuals.badgeColor}`}>
            {document.fileType}
          </span>
          {document.semester && (
            <span className="px-2 py-0.5 rounded-md text-[10px] text-slate-500 bg-slate-100">
              {document.semester}
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1 font-mono font-medium">
            <span>{formatFileSize(document.fileSize)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600">{dateFormatted}</span>
            <button
              onClick={() => onDownload(document)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
              title="Download Document"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
