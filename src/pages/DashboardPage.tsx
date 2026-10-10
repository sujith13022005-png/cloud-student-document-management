import React from 'react';
import { 
  FileText, 
  UploadCloud, 
  FolderLock, 
  UserCircle, 
  HardDrive, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  FileCheck2,
  DollarSign,
  Briefcase,
  Code2,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useDocuments } from '../context/DocumentContext.tsx';
import { DocumentCard, formatFileSize } from '../components/DocumentCard.tsx';
import type { DocumentItem, DocumentCategory } from '../types/index.ts';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  onViewDoc: (doc: DocumentItem) => void;
  onEditDoc: (doc: DocumentItem) => void;
  onDeleteDoc: (doc: DocumentItem) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onViewDoc,
  onEditDoc,
  onDeleteDoc,
}) => {
  const { user } = useAuth();
  const { documents, storageStats, activities, downloadDocument, resetToDemoVault } = useDocuments();

  if (!user) return null;

  const usedMB = (storageStats.usedBytes / (1024 * 1024)).toFixed(1);
  const maxGB = (storageStats.maxBytes / (1024 * 1024 * 1024)).toFixed(0);
  const percentUsed = Math.min(100, Math.round((storageStats.usedBytes / storageStats.maxBytes) * 100));

  const recentDocs = documents.slice(0, 4);

  // Category summary array
  const categoryChips: { name: DocumentCategory; icon: React.ElementType; color: string }[] = [
    { name: 'Academic', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { name: 'Certificate', icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'Identity', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { name: 'Fee', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { name: 'Internship', icon: Briefcase, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { name: 'Project', icon: Code2, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Student ID: {user.studentId} • Year {user.year}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1.5 max-w-xl leading-relaxed">
              {user.programme} • {user.department}. Your academic files are securely synchronized in Firebase Cloud Storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/documents/upload')}
              className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-500/30 hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => onNavigate('/documents')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              View All Documents
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Documents */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Documents
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderLock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {storageStats.totalFiles}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Verified Assets</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Encrypted in Cloud Vault</span>
          </div>
        </div>

        {/* Storage Used */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Storage Used
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {usedMB} MB
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {maxGB} GB</span>
          </div>
          <div className="mt-2">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-600 rounded-full"
                style={{ width: `${Math.max(percentUsed, 2)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">{percentUsed}% allocated</p>
          </div>
        </div>

        {/* Documents Uploaded */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Categories Active
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {Object.values(storageStats.byCategory).filter((v) => v > 0).length} / 8
            </span>
            <span className="text-xs text-slate-400 ml-1.5">Active Folders</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Categorized by Term</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Audit Events
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {activities.length}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">Logged Actions</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium truncate">
            Last: {activities[0]?.action ? activities[0].action.toUpperCase() : 'Login verified'}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('/documents/upload')}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Upload Document</p>
              <p className="text-[10px] text-slate-400">PDF, Docs, Sheets</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('/documents')}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FolderLock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">View Documents</p>
              <p className="text-[10px] text-slate-400">Search & Filter Vault</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('/profile')}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">My Profile</p>
              <p className="text-[10px] text-slate-400">Academic Records</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('/activity')}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Activity History</p>
              <p className="text-[10px] text-slate-400">Security Audit Log</p>
            </div>
          </button>
        </div>
      </div>

      {/* Document Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Academic Categories</h2>
            <p className="text-xs text-slate-500">Structured repository classification</p>
          </div>
          <button
            onClick={() => onNavigate('/documents')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryChips.map((c) => {
            const IconComp = c.icon;
            const count = documents.filter((d) => d.category === c.name).length;
            const bytes = storageStats.byCategory[c.name] || 0;

            return (
              <button
                key={c.name}
                onClick={() => onNavigate(`/documents?category=${encodeURIComponent(c.name)}`)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all text-left"
              >
                <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center mb-2.5 border`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{count} {count === 1 ? 'doc' : 'docs'}</span>
                  <span>{formatFileSize(bytes)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Documents Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Documents</h2>
            <p className="text-xs text-slate-500">Latest academic uploads and credentials</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDemoVault}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
              title="Reset sample documents"
            >
              Reload Sample Vault
            </button>
            <button
              onClick={() => onNavigate('/documents')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {recentDocs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center">
            <FolderLock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No documents uploaded yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start building your cloud portfolio by uploading your semester mark sheets, degree certificates, or internship letters.
            </p>
            <button
              onClick={() => onNavigate('/documents/upload')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentDocs.map((doc) => (
              <DocumentCard
                key={doc.documentId}
                document={doc}
                onView={onViewDoc}
                onDownload={downloadDocument}
                onEdit={onEditDoc}
                onDelete={onDeleteDoc}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
