import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, Folder, Calendar, BookOpen } from 'lucide-react';
import type { DocumentItem, DocumentCategory } from '../types/index.ts';

interface DocumentModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (docId: string, updates: Partial<DocumentItem>) => Promise<boolean>;
}

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

export const DocumentModal: React.FC<DocumentModalProps> = ({
  document,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !document) return null;

  const [documentName, setDocumentName] = useState(document.documentName);
  const [category, setCategory] = useState<DocumentCategory>(document.category);
  const [description, setDescription] = useState(document.description || '');
  const [academicYear, setAcademicYear] = useState(document.academicYear || '2025-2026');
  const [semester, setSemester] = useState(document.semester || 'Semester 1');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (document) {
      setDocumentName(document.documentName);
      setCategory(document.category);
      setDescription(document.description || '');
      setAcademicYear(document.academicYear || '2025-2026');
      setSemester(document.semester || 'Semester 1');
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName.trim()) return;

    setIsSaving(true);
    const success = await onSave(document.documentId, {
      documentName: documentName.trim(),
      category,
      description: description.trim(),
      academicYear,
      semester,
    });
    setIsSaving(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-doc-title"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 id="edit-doc-title" className="text-sm font-bold text-slate-900">
                Edit Document Metadata
              </h3>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                {document.fileName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Display Name *
            </label>
            <input
              type="text"
              required
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. Master of Computer Applications Grade Sheet"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
                placeholder="2025-2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Semester / Term
            </label>
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
              placeholder="Semester 1 / Semester 2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Academic Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 resize-none"
              placeholder="Optional notes, verification codes, or issuing authority info..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Cloud...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
