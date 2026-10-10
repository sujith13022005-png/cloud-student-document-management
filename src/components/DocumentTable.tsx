import React from 'react';
import { 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  FileText 
} from 'lucide-react';
import type { DocumentItem } from '../types/index.ts';
import { formatFileSize, getFileVisuals } from './DocumentCard.tsx';

interface DocumentTableProps {
  documents: DocumentItem[];
  onView: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onEdit: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onView,
  onDownload,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Document Name</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3">Format</th>
              <th className="py-3.5 px-3">Size</th>
              <th className="py-3.5 px-3">Academic Term</th>
              <th className="py-3.5 px-3">Uploaded</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {documents.map((doc) => {
              const visuals = getFileVisuals(doc.fileType);
              const IconComp = visuals.icon;
              const dateStr = new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr 
                  key={doc.documentId}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${visuals.bgColor} ${visuals.textColor} flex items-center justify-center shrink-0`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-md">
                        <button
                          onClick={() => onView(doc)}
                          className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate block text-left text-xs"
                        >
                          {doc.documentName}
                        </button>
                        <p className="text-[11px] text-slate-400 font-mono truncate">
                          {doc.fileName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {doc.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${visuals.badgeColor}`}>
                      {doc.fileType}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {formatFileSize(doc.fileSize)}
                  </td>

                  <td className="py-3.5 px-3 text-slate-500">
                    <div>{doc.academicYear || '—'}</div>
                    <div className="text-[10px] text-slate-400">{doc.semester}</div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                    {dateStr}
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(doc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="View Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownload(doc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(doc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Metadata"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(doc)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
