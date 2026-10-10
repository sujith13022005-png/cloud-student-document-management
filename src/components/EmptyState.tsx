import React from 'react';
import { FolderLock, UploadCloud, FileQuestion, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  type?: 'documents' | 'search' | 'activity';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No documents yet',
  description = 'Upload your first academic document to start building your secure cloud library.',
  actionText = 'Upload Document',
  onAction,
  type = 'documents',
}) => {
  let IconComp = FolderLock;
  if (type === 'search') IconComp = SearchX;
  if (type === 'activity') IconComp = FileQuestion;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100/80 shadow-2xs">
        <IconComp className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
        {description}
      </p>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 hover:shadow-md transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
