import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  FolderLock, 
  HardDrive, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  Layers
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext.tsx';
import { formatFileSize } from '../components/DocumentCard.tsx';

export const AdminStatisticsPage: React.FC = () => {
  const { documents } = useDocuments();

  const totalDocs = documents.length;
  const totalStorageBytes = documents.reduce((acc, d) => acc + d.fileSize, 0);

  // Group by category
  const categoriesMap = documents.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by file format
  const fileTypesMap = documents.reduce((acc, d) => {
    const ext = d.fileType.toUpperCase();
    acc[ext] = (acc[ext] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Daily uploads calculation
  const uploadsByDate = documents.reduce((acc, d) => {
    const dStr = new Date(d.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[dStr] = (acc[dStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          System-Level Document Statistics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed metrics computed directly from Cloud Firestore and Firebase Storage registries.
        </p>
      </div>

      {/* Top 3 Metric summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Documents</span>
            <FolderLock className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{totalDocs}</p>
          <p className="text-xs text-slate-400 mt-1">All university uploads</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Storage Consumed</span>
            <HardDrive className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{formatFileSize(totalStorageBytes)}</p>
          <p className="text-xs text-slate-400 mt-1">Across student partitions</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Average File Size</span>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {formatFileSize(totalDocs > 0 ? totalStorageBytes / totalDocs : 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Per academic document</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            Documents by Category
          </h3>
          <div className="space-y-3 pt-2">
            {Object.entries(categoriesMap).map(([cat, count]) => {
              const pct = Math.round((count / Math.max(totalDocs, 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{cat}</span>
                    <span className="text-indigo-600 font-mono">{count} files ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Common File Formats */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            File Formats & MIME Breakdown
          </h3>
          <div className="space-y-3 pt-2">
            {Object.entries(fileTypesMap).map(([type, count]) => {
              const pct = Math.round((count / Math.max(totalDocs, 1)) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="font-mono text-slate-800">.{type}</span>
                    <span className="text-purple-600 font-mono">{count} files ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Uploads Trend Bar Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Recent Daily Upload Activity
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {Object.entries(uploadsByDate).map(([date, count]) => (
            <div key={date} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 uppercase">{date}</p>
              <p className="text-xl font-extrabold text-indigo-700 mt-1">{count}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">uploaded</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
