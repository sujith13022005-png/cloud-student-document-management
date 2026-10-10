import React from 'react';
import { 
  Users, 
  FolderLock, 
  HardDrive, 
  Calendar, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  PieChart, 
  BarChart3,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useDocuments } from '../context/DocumentContext.tsx';
import { formatFileSize } from '../components/DocumentCard.tsx';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { allStudents } = useAuth();
  const { documents, storageStats } = useDocuments();

  // Aggregate stats across university
  const totalStudents = allStudents.length;
  const totalDocs = documents.length;
  const totalStorageBytes = documents.reduce((acc, d) => acc + d.fileSize, 0);

  // Group by category
  const categoriesCount = documents.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-semibold border border-purple-400/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Academic Registry & Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Cloud Vault Overview
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl leading-relaxed">
            University-wide document storage monitoring, department student enrollment metrics, and system security oversight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('/admin/students')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Manage Students</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/statistics')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
          >
            System Analytics
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled Students</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{totalStudents}</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">100% Identity Verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vault Documents</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderLock className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{totalDocs}</p>
          <p className="mt-1 text-[11px] text-indigo-600 font-semibold">Indexed in Cloud Firestore</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Cloud Storage</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
            {formatFileSize(totalStorageBytes)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 font-mono">Firebase Storage Bucket</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
            {documents.filter((d) => new Date(d.uploadedAt).toDateString() === new Date().toDateString()).length}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Active Ingestion Flow</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents By Category */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Documents By Category Distribution
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{Object.keys(categoriesCount).length} Active Types</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoriesCount).map(([cat, count]) => {
              const pct = Math.round((count / Math.max(totalDocs, 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-indigo-600 font-mono">{count} files ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Enrolled Students Preview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Enrolled Students Roster
            </h3>
            <button
              onClick={() => onNavigate('/admin/students')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {allStudents.slice(0, 4).map((stu) => (
              <div key={stu.userId} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={stu.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${stu.name}`}
                    alt={stu.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{stu.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{stu.studentId} • {stu.programme}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {stu.status || 'Active'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
