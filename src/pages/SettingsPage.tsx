import React from 'react';
import { 
  HardDrive, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Trash2, 
  RotateCcw, 
  BookOpen, 
  FileText,
  Key,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useDocuments } from '../context/DocumentContext.tsx';
import { formatFileSize, getFileVisuals } from '../components/DocumentCard.tsx';

interface SettingsPageProps {
  onOpenSetupGuide: () => void;
  onViewDoc: (doc: any) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenSetupGuide, onViewDoc }) => {
  const { user, isFirebaseLive } = useAuth();
  const { storageStats, resetToDemoVault, clearAllDocuments } = useDocuments();

  if (!user) return null;

  const usedMB = (storageStats.usedBytes / (1024 * 1024)).toFixed(1);
  const maxGB = (storageStats.maxBytes / (1024 * 1024 * 1024)).toFixed(0);
  const percentUsed = Math.min(100, Math.round((storageStats.usedBytes / storageStats.maxBytes) * 100));

  const isHighStorage = percentUsed >= 80;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Cloud Storage & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your cloud storage allocation, manage data security, and inspect Firebase services.
        </p>
      </div>

      {/* Storage Warning if high */}
      {isHighStorage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <h4 className="font-bold text-sm text-amber-950">Storage Warning: Quota Threshold Reached</h4>
            <p className="mt-0.5">
              You are currently utilizing {percentUsed}% of your institutional 5 GB allocation. Consider downloading and deleting obsolete files to ensure future semester uploads succeed.
            </p>
          </div>
        </div>
      )}

      {/* Storage Usage Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Institutional Cloud Allocation
              </h2>
              <p className="text-xs text-slate-500">
                Dedicated Firebase Cloud Storage bucket quota for student {user.studentId}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-black text-slate-900">{usedMB} MB</span>
            <span className="text-xs text-slate-400 font-mono"> / {maxGB} GB</span>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isHighStorage ? 'bg-rose-500' : percentUsed > 50 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.max(percentUsed, 2)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>0 GB</span>
            <span className="font-bold text-slate-800">{percentUsed}% Used</span>
            <span>5 GB Maximum Quota</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Storage by Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(storageStats.byCategory).map(([cat, bytes]) => (
              <div key={cat} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <p className="font-bold text-slate-700">{cat}</p>
                <p className="font-mono text-indigo-600 font-bold mt-1">{formatFileSize(bytes)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Largest Files Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Largest Files in Your Vault
        </h3>
        {storageStats.largestFiles.length === 0 ? (
          <p className="text-xs text-slate-400">No files uploaded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {storageStats.largestFiles.map((doc) => {
              const visuals = getFileVisuals(doc.fileType);
              const IconComp = visuals.icon;
              return (
                <div
                  key={doc.documentId}
                  onClick={() => onViewDoc(doc)}
                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg ${visuals.bgColor} ${visuals.textColor} flex items-center justify-center shrink-0`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{doc.documentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{doc.fileName}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {formatFileSize(doc.fileSize)}
                    </span>
                    <p className="text-[10px] text-slate-400">{doc.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cloud & Architecture Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Firebase Cloud Diagnostics</h3>
              <p className="text-xs text-slate-500">
                {isFirebaseLive ? 'Active Firebase Cloud Connection' : 'Running on In-Browser Protected Cloud Engine'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSetupGuide}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Architecture Manual</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
          <button
            onClick={resetToDemoVault}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Documents</span>
          </button>
          <button
            onClick={clearAllDocuments}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear All My Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};
