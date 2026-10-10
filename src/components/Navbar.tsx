import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  BookOpen, 
  User, 
  LogOut, 
  ChevronDown, 
  Bell, 
  Cloud, 
  ShieldAlert,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import type { UserRole } from '../types/index.ts';

interface NavbarProps {
  onOpenSetupGuide: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSetupGuide, onNavigate, currentPath }) => {
  const { user, role, logout, switchDemoRole, isFirebaseLive } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/documents?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 group text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                Student<span className="text-indigo-600">Vault</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-slate-600 uppercase">
                Cloud Document System
              </span>
            </div>
          </button>

          {/* Cloud Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
            <span className={`w-2 h-2 rounded-full ${isFirebaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-sky-500'}`} />
            <span>{isFirebaseLive ? 'Firebase Live' : 'Cloud Vault Ready'}</span>
          </div>
        </div>

        {/* Global Search Bar (Only when logged in and inside app) */}
        {user && currentPath !== '/' && (
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-4 relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents, transcripts, certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white rounded-lg border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-800 placeholder:text-slate-600"
            />
          </form>
        )}

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2.5">
          {/* Cloud Setup Guide Button */}
          <button
            onClick={onOpenSetupGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition-colors shadow-2xs"
            title="View Firebase Cloud architecture and manual setup documentation"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Firebase Architecture</span>
          </button>

          {user ? (
            <>
              {/* Role Toggle Switcher for testing student vs admin views */}
              <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
                <button
                  onClick={() => {
                    switchDemoRole('student');
                    onNavigate('/dashboard');
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    role === 'student'
                      ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('admin');
                    onNavigate('/admin');
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    role === 'admin'
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all focus:outline-hidden"
                >
                  <img
                    src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-xs"
                  />
                  <div className="hidden md:block text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {role === 'admin' ? 'University Admin' : user.studentId}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-semibold text-sm text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-600 truncate">{user.email}</p>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        Role: {role}
                      </span>
                    </div>

                    <div className="py-1 text-sm text-slate-700">
                      {role === 'student' ? (
                        <>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('/dashboard');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <Sparkles className="w-4 h-4 text-slate-400" />
                            Student Dashboard
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('/profile');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            My Profile
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('/settings');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <Sliders className="w-4 h-4 text-slate-400" />
                            Storage & Cloud Settings
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('/admin');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            Admin Console
                          </button>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onNavigate('/admin/students');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            Student Directory
                          </button>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          onNavigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Student Login
              </button>
              <button
                onClick={() => onNavigate('/register')}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all hover:shadow"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
