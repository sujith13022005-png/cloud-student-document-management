import React, { useState } from 'react';
import { 
  Clock, 
  UploadCloud, 
  Download, 
  Trash2, 
  Edit3, 
  UserCheck, 
  ShieldCheck, 
  Search,
  Filter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext.tsx';
import type { ActivityAction } from '../types/index.ts';

export const ActivityPage: React.FC = () => {
  const { activities } = useDocuments();
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = activities.filter((act) => {
    if (filterAction !== 'all' && act.action !== filterAction) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc = (act.documentName || '').toLowerCase().includes(q);
      const matchDetails = (act.details || '').toLowerCase().includes(q);
      const matchAction = act.action.toLowerCase().includes(q);
      if (!matchDoc && !matchDetails && !matchAction) return false;
    }
    return true;
  });

  const getActionVisuals = (action: ActivityAction) => {
    switch (action) {
      case 'upload':
        return {
          icon: UploadCloud,
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          title: 'Document Uploaded',
        };
      case 'download':
        return {
          icon: Download,
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
          title: 'Document Downloaded',
        };
      case 'delete':
        return {
          icon: Trash2,
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          title: 'Document Deleted',
        };
      case 'rename':
        return {
          icon: Edit3,
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          title: 'Document Renamed',
        };
      case 'update_profile':
        return {
          icon: UserCheck,
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          title: 'Profile Updated',
        };
      case 'login':
      case 'logout':
      default:
        return {
          icon: ShieldCheck,
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          title: 'Security Authentication',
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Activity & Audit History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete immutable audit trail of document access, modifications, and downloads.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, document name, or details..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">All Actions</option>
            <option value="upload">Uploads Only</option>
            <option value="download">Downloads Only</option>
            <option value="delete">Deletions Only</option>
            <option value="rename">Renames Only</option>
            <option value="update_profile">Profile Updates</option>
            <option value="login">Authentication Events</option>
          </select>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Clock className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No recent activity</p>
            <p className="text-xs text-slate-400 mt-1">
              Your actions will automatically appear here as you upload, view, and organize documents.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((act) => {
              const visuals = getActionVisuals(act.action);
              const IconComp = visuals.icon;
              const dateObj = new Date(act.timestamp);
              const dateStr = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const timeStr = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div 
                  key={act.activityId}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl ${visuals.badge} border flex items-center justify-center shrink-0`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {visuals.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${visuals.badge}`}>
                          {act.action}
                        </span>
                      </div>

                      {act.documentName && (
                        <p className="text-xs font-semibold text-indigo-700 mt-0.5 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{act.documentName}</span>
                        </p>
                      )}

                      {act.details && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {act.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-slate-700">{dateStr}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{timeStr}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
