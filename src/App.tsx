import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DocumentProvider, useDocuments } from './context/DocumentContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { MobileNavigation } from './components/MobileNavigation.tsx';
import { SetupGuideModal } from './components/SetupGuideModal.tsx';
import { DocumentModal } from './components/DocumentModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { DocumentsPage } from './pages/DocumentsPage.tsx';
import { UploadPage } from './pages/UploadPage.tsx';
import { DocumentDetailPage } from './pages/DocumentDetailPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { ActivityPage } from './pages/ActivityPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { AdminStudentsPage } from './pages/AdminStudentsPage.tsx';
import { AdminStatisticsPage } from './pages/AdminStatisticsPage.tsx';
import { AdminSettingsPage } from './pages/AdminSettingsPage.tsx';

import type { DocumentItem } from './types/index.ts';

const AppContent: React.FC = () => {
  const { user, role, isAuthenticated, loading } = useAuth();
  const { deleteDocument, updateDocumentMeta } = useDocuments();
  const { warning } = useToast();

  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [setupGuideOpen, setSetupGuideOpen] = useState(false);

  // Modals state
  const [activeEditingDoc, setActiveEditingDoc] = useState<DocumentItem | null>(null);
  const [activeDeletingDoc, setActiveDeletingDoc] = useState<DocumentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync initial URL path
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    if (window.location.pathname && window.location.pathname !== '/') {
      setCurrentPath(window.location.pathname);
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    // If route requires authentication and user is logged out:
    const publicPaths = ['/', '/login', '/register'];
    const isPublic = publicPaths.includes(path.split('?')[0]);

    if (!user && !isPublic) {
      setCurrentPath('/login');
      window.history.pushState({}, '', '/login');
      return;
    }

    // Role protection: Students cannot access Admin routes
    if (path.startsWith('/admin') && role !== 'admin') {
      warning('Access Denied: Administrative privileges required.');
      setCurrentPath('/dashboard');
      window.history.pushState({}, '', '/dashboard');
      return;
    }

    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Document modal handlers
  const handleViewDoc = (doc: DocumentItem) => {
    navigate(`/documents/${doc.documentId}`);
  };

  const handleEditDoc = (doc: DocumentItem) => {
    setActiveEditingDoc(doc);
  };

  const handleDeletePrompt = (doc: DocumentItem) => {
    setActiveDeletingDoc(doc);
  };

  const handleConfirmDelete = async () => {
    if (!activeDeletingDoc) return;
    setIsDeleting(true);
    await deleteDocument(activeDeletingDoc.documentId);
    setIsDeleting(false);
    setActiveDeletingDoc(null);
    if (currentPath.startsWith('/documents/doc_')) {
      navigate('/documents');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-pulse mb-3">
          <span className="font-bold text-lg">SV</span>
        </div>
        <p className="text-xs font-semibold text-slate-600">Initializing StudentVault...</p>
      </div>
    );
  }

  // Determine current route component
  const pathname = currentPath.split('?')[0];

  const renderRoute = () => {
    // Landing page
    if (pathname === '/') {
      return (
        <LandingPage
          onNavigate={navigate}
          onOpenSetupGuide={() => setSetupGuideOpen(true)}
        />
      );
    }

    // Auth pages
    if (pathname === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }
    if (pathname === '/register') {
      return <RegisterPage onNavigate={navigate} />;
    }

    // Authenticated Student pages
    if (pathname === '/dashboard') {
      return (
        <DashboardPage
          onNavigate={navigate}
          onViewDoc={handleViewDoc}
          onEditDoc={handleEditDoc}
          onDeleteDoc={handleDeletePrompt}
        />
      );
    }

    if (pathname === '/documents/upload') {
      return <UploadPage onNavigate={navigate} />;
    }

    // Document detail / preview route: /documents/:id
    if (pathname.startsWith('/documents/') && pathname !== '/documents') {
      const docId = pathname.replace('/documents/', '');
      return (
        <DocumentDetailPage
          documentId={docId}
          onBack={() => navigate('/documents')}
          onEditDoc={handleEditDoc}
          onDeleteDoc={handleDeletePrompt}
        />
      );
    }

    if (pathname === '/documents') {
      const urlParams = new URLSearchParams(currentPath.includes('?') ? currentPath.split('?')[1] : '');
      const initialQuery = urlParams.get('q') || '';
      const initialCategory = urlParams.get('category') || '';

      return (
        <DocumentsPage
          onNavigate={navigate}
          onViewDoc={handleViewDoc}
          onEditDoc={handleEditDoc}
          onDeleteDoc={handleDeletePrompt}
          initialQuery={initialQuery}
          initialCategory={initialCategory}
        />
      );
    }

    if (pathname === '/profile') {
      return <ProfilePage />;
    }

    if (pathname === '/activity') {
      return <ActivityPage />;
    }

    if (pathname === '/settings') {
      return (
        <SettingsPage
          onOpenSetupGuide={() => setSetupGuideOpen(true)}
          onViewDoc={handleViewDoc}
        />
      );
    }

    // Admin routes
    if (pathname === '/admin') {
      return <AdminDashboardPage onNavigate={navigate} />;
    }

    if (pathname === '/admin/students') {
      return <AdminStudentsPage />;
    }

    if (pathname === '/admin/statistics') {
      return <AdminStatisticsPage />;
    }

    if (pathname === '/admin/settings') {
      return <AdminSettingsPage />;
    }

    // Default fallback
    return (
      <DashboardPage
        onNavigate={navigate}
        onViewDoc={handleViewDoc}
        onEditDoc={handleEditDoc}
        onDeleteDoc={handleDeletePrompt}
      />
    );
  };

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenSetupGuide={() => setSetupGuideOpen(true)}
        onNavigate={navigate}
        currentPath={currentPath}
      />

      {/* Main Content Area */}
      {isPublicPage ? (
        <main className="flex-1">{renderRoute()}</main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
          {/* Left Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar currentPath={currentPath} onNavigate={navigate} />
          </div>

          {/* Center Page Canvas */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            {renderRoute()}
          </main>
        </div>
      )}

      {/* Bottom Mobile Navigation */}
      {!isPublicPage && (
        <MobileNavigation currentPath={currentPath} onNavigate={navigate} />
      )}

      {/* Global Modals */}
      <SetupGuideModal
        isOpen={setupGuideOpen}
        onClose={() => setSetupGuideOpen(false)}
      />

      <DocumentModal
        document={activeEditingDoc}
        isOpen={!!activeEditingDoc}
        onClose={() => setActiveEditingDoc(null)}
        onSave={updateDocumentMeta}
      />

      <DeleteConfirmModal
        document={activeDeletingDoc}
        isOpen={!!activeDeletingDoc}
        onClose={() => setActiveDeletingDoc(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DocumentProvider>
          <AppContent />
        </DocumentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
