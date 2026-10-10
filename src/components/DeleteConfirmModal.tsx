import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import type { DocumentItem } from '../types/index.ts';

interface DeleteConfirmModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  document,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 id="delete-dialog-title" className="text-base font-bold text-slate-900">
            Are you sure you want to delete this document?
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            This action will permanently delete <strong className="text-slate-900">"{document.documentName}"</strong> ({document.fileName}) from your cloud storage bucket and remove all corresponding metadata from Cloud Firestore.
          </p>
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-100 text-[11px] text-rose-800 font-medium">
            ⚠️ This action is irreversible. The file and associated checksum verification cannot be recovered once removed.
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting from Cloud...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Document</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
