import React from 'react';
import { 
  LayoutDashboard, 
  FolderLock, 
  UploadCloud, 
  Clock, 
  UserCircle, 
  HardDrive, 
  ShieldAlert, 
  Users, 
  BarChart3, 
  Settings,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useDocuments } from '../context/DocumentContext.tsx';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { user, role } = useAuth();
  const { storageStats } = useDocuments();

  if (!user) return null;

  const usedMB = (storageStats.usedBytes / (1024 * 1024)).toFixed(1);
  const maxGB = (storageStats.maxBytes / (1024 * 1024 * 1024)).toFixed(0);
  const percentUsed = Math.min(100, Math.round((storageStats.usedBytes / storageStats.maxBytes) * 100));

  const studentNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Documents', path: '/documents', icon: FolderLock },
    { label: 'Upload Document', path: '/documents/upload', icon: UploadCloud, highlight: true },
    { label: 'Activity History', path: '/activity', icon: Clock },
    { label: 'My Profile', path: '/profile', icon: UserCircle },
    { label: 'Storage & Settings', path: '/settings', icon: Settings },
  ];

  const adminNavItems = [
    { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Registered Students', path: '/admin/students', icon: Users },
    { label: 'Document Statistics', path: '/admin/statistics', icon: BarChart3 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const items = role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Student/Admin Status Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="relative">
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
            <p className="text-[11px] text-slate-500 truncate font-mono">
              {role === 'admin' ? 'University Admin' : user.studentId}
            </p>
            <p className="text-[10px] text-indigo-600 font-medium truncate mt-0.5">
              {user.department}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {role === 'student' && (
          <div className="pb-3 px-2">
            <button
              onClick={() => onNavigate('/documents/upload')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Document</span>
            </button>
          </div>
        )}

        <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {role === 'admin' ? 'Administrative Suite' : 'Main Menu'}
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path + '/'));

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs border border-indigo-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Storage Quota Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
            Cloud Storage
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {usedMB} MB / {maxGB} GB
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 85 ? 'bg-rose-500' : percentUsed > 60 ? 'bg-amber-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.max(percentUsed, 3)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
          <span>{percentUsed}% capacity used</span>
          <button
            onClick={() => onNavigate('/settings')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Manage
          </button>
        </div>
      </div>
    </aside>
  );
};
