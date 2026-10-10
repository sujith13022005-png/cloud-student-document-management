import React from 'react';
import { 
  LayoutDashboard, 
  FolderLock, 
  UploadCloud, 
  Clock, 
  UserCircle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileNavigation: React.FC<MobileNavProps> = ({ currentPath, onNavigate }) => {
  const { user, role } = useAuth();

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onNavigate(role === 'admin' ? '/admin' : '/dashboard')}
        className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-medium transition-colors ${
          currentPath === '/dashboard' || currentPath === '/admin'
            ? 'text-indigo-600 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Dashboard</span>
      </button>

      <button
        onClick={() => onNavigate('/documents')}
        className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-medium transition-colors ${
          currentPath.startsWith('/documents') && currentPath !== '/documents/upload'
            ? 'text-indigo-600 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <FolderLock className="w-5 h-5 mb-0.5" />
        <span>Vault</span>
      </button>

      {/* Floating Center Upload Button for Students */}
      {role === 'student' && (
        <button
          onClick={() => onNavigate('/documents/upload')}
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-indigo-700 mt-1">Upload</span>
        </button>
      )}

      <button
        onClick={() => onNavigate(role === 'admin' ? '/admin/students' : '/activity')}
        className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-medium transition-colors ${
          currentPath === '/activity' || currentPath === '/admin/students'
            ? 'text-indigo-600 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Clock className="w-5 h-5 mb-0.5" />
        <span>{role === 'admin' ? 'Students' : 'Activity'}</span>
      </button>

      <button
        onClick={() => onNavigate('/profile')}
        className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-medium transition-colors ${
          currentPath === '/profile'
            ? 'text-indigo-600 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <UserCircle className="w-5 h-5 mb-0.5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
