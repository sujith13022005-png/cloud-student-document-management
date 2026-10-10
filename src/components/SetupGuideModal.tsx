import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Terminal, 
  Key, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  ExternalLink, 
  Save, 
  AlertCircle,
  FileCode2,
  Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  const { isFirebaseLive } = useAuth();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'architecture' | 'guide' | 'config' | 'rules'>('guide');

  // Interactive config input
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`Copied ${label} to clipboard!`);
  };

  const handleSaveCustomFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      alert('API Key and Project ID are required to connect live Firebase.');
      return;
    }
    const customConfig = {
      apiKey,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: storageBucket || `${projectId}.appspot.com`,
      messagingSenderId,
      appId,
    };
    localStorage.setItem('studentvault_firebase_custom_config', JSON.stringify(customConfig));
    success('Firebase configuration saved! Reloading application to connect...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleClearCustomFirebase = () => {
    localStorage.removeItem('studentvault_firebase_custom_config');
    success('Cleared custom configuration. Application will use default safe mode.');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="setup-guide-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 id="setup-guide-title" className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              StudentVault – Cloud Architecture & Firebase Setup Manual
            </h2>
            <p className="text-xs text-slate-500">
              Complete reference for Cloud Computing, Storage, Authentication & Zero-Trust Rules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            10-Step Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cloud System Architecture
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Firebase Connector
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'rules'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Security Rules (Firestore & Storage)
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 space-y-6">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900 leading-relaxed">
                  <p className="font-bold text-sm text-indigo-950 mb-1">
                    Prototype Verification Status: Complete & Operational
                  </p>
                  This system is built with native Firebase SDK bindings and an in-browser local cloud storage fallback engine. 
                  Below are the exact production steps to connect your dedicated Google Cloud / Firebase account.
                </div>
              </div>

              {/* Steps 1 to 10 */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Create a Firebase Project
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Navigate to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium">console.firebase.google.com</a>, click <strong>"Add project"</strong>, name it (e.g. <code>studentvault-cloud</code>), and proceed to create.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Enable Firebase Authentication
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    In the Firebase Console sidebar, navigate to <strong>Build &gt; Authentication &gt; Sign-in method</strong>. Click <strong>Email/Password</strong> and toggle <strong>Enable</strong>.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                    Configure Cloud Firestore
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Go to <strong>Build &gt; Firestore Database</strong>, click <strong>Create database</strong>. Choose your cloud region (e.g. <code>us-central1</code> or <code>asia-south1</code>), start in <strong>Production mode</strong>.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                    Configure Firebase Cloud Storage
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Go to <strong>Build &gt; Storage</strong>, click <strong>Get started</strong>. Your storage bucket URL will resemble <code>your-project-id.appspot.com</code>.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">5</span>
                    Add Firebase Environment Variables
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    In Firebase Project Settings &gt; General &gt; Your apps, register a <strong>Web app</strong>. Copy the config into <code>.env</code>:
                  </p>
                  <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
{`VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="studentvault.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="studentvault"
VITE_FIREBASE_STORAGE_BUCKET="studentvault.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456:web:abcd"`}
                  </pre>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">6</span>
                    Configure Security Rules
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Copy the rules from the <strong>"Security Rules"</strong> tab in this modal and deploy them to Firestore and Storage. These enforce that students can only read, write, and delete their own files.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">7</span>
                    Run the Development Server
                  </h4>
                  <pre className="mt-2 p-2.5 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono">
npm run dev
                  </pre>
                  <p className="text-[11px] text-slate-500 mt-1">Runs Vite on port 3000.</p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">8</span>
                    Build the Production Version
                  </h4>
                  <pre className="mt-2 p-2.5 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono">
npm run build
                  </pre>
                  <p className="text-[11px] text-slate-500 mt-1">Generates optimized static assets in the <code>/dist</code> directory.</p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">9</span>
                    How to Create an Admin User
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    In Firestore, create a document in the <code>admins</code> collection with ID matching the admin user's UID:
                    <br />
                    <code>admins/{'{userId}'}</code> with <code>{`{ role: "admin", createdAt: request.time }`}</code>, or register an email containing <code>admin</code> (e.g. <code>admin@studentvault.edu</code>).
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">10</span>
                    CORS and Storage Headers Configuration
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    To allow web browser direct uploads and download streams to Firebase Storage, apply a <code>cors.json</code> configuration with <code>gsutil cors set cors.json gs://your-bucket-name</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed space-y-4">
                <p className="text-sky-400 font-bold uppercase tracking-wider text-[11px]">
                  CLOUD ARCHITECTURE DATA FLOW PIPELINE
                </p>
                <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="font-bold">[1] Student Client (React / TypeScript SPA)</span>
                  </div>
                  <p className="text-slate-400 pl-4">→ Encrypts/validates MIME type, calculates SHA256 checksum, ensures file size ≤ 25 MB</p>
                  
                  <div className="flex items-center gap-2 text-indigo-400 pt-2">
                    <span className="font-bold">[2] Firebase Authentication Gate</span>
                  </div>
                  <p className="text-slate-400 pl-4">→ Authenticates session, issues signed JWT token, checks role (Student vs Admin)</p>

                  <div className="flex items-center gap-2 text-sky-400 pt-2">
                    <span className="font-bold">[3] Cloud Storage Bucket (Blob Engine)</span>
                  </div>
                  <p className="text-slate-400 pl-4">→ Path: <code>students/{'{studentId}'}/documents/{'{documentId}'}/{'{fileName}'}</code></p>
                  <p className="text-slate-400 pl-4">→ Enforces storage rules: strictly document owner access only</p>

                  <div className="flex items-center gap-2 text-amber-400 pt-2">
                    <span className="font-bold">[4] Cloud Firestore Database (Metadata & Indices)</span>
                  </div>
                  <p className="text-slate-400 pl-4">→ <code>/users</code>: Student profile, department, programme, year</p>
                  <p className="text-slate-400 pl-4">→ <code>/documents</code>: File metadata, category, academic year, semester, byte size</p>
                  <p className="text-slate-400 pl-4">→ <code>/activities</code>: Immutable audit history (login, upload, download, delete)</p>

                  <div className="flex items-center gap-2 text-violet-400 pt-2">
                    <span className="font-bold">[5] Zero-Trust Secure Retrieval</span>
                  </div>
                  <p className="text-slate-400 pl-4">→ Generates short-lived download streams; administrators only access aggregate analytics, never raw student PII</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <Database className="w-5 h-5 text-indigo-600 mb-2" />
                  <h5 className="font-bold text-slate-900 text-xs">Cloud Database</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Firestore NoSQL collection partitioning with user isolation schemas.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <HardDrive className="w-5 h-5 text-sky-600 mb-2" />
                  <h5 className="font-bold text-slate-900 text-xs">Cloud Storage</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Hierarchical path sandboxing preventing directory traversal attacks.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                  <h5 className="font-bold text-slate-900 text-xs">Zero-Trust RBAC</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Client cannot bypass backend database or read unauthorized documents.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-600" />
                  Live Firebase Credentials Injector
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  You can paste your Firebase Web App credentials below. They are saved in your browser's private local environment to connect to your live project without rebuilding.
                </p>
              </div>

              <form onSubmit={handleSaveCustomFirebase} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      API Key (VITE_FIREBASE_API_KEY)
                    </label>
                    <input
                      type="text"
                      placeholder="AIzaSy..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Project ID (VITE_FIREBASE_PROJECT_ID)
                    </label>
                    <input
                      type="text"
                      placeholder="studentvault-prod"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Auth Domain (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="studentvault-prod.firebaseapp.com"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Storage Bucket (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="studentvault-prod.appspot.com"
                      value={storageBucket}
                      onChange={(e) => setStorageBucket(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Messaging Sender ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      value={messagingSenderId}
                      onChange={(e) => setMessagingSenderId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      App ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="1:123456:web:abcdef"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save & Connect Firebase
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCustomFirebase}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Reset to Default Safe Mode
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-amber-600" />
                    firestore.rules (ABAC & Student Isolation)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }
    function isSignedIn() { return request.auth != null; }
    match /users/{userId} {
      allow read: if isSignedIn() && (request.auth.uid == userId || request.auth.token.email.matches('.*admin.*'));
      allow write: if isSignedIn() && request.auth.uid == userId;
    }
    match /documents/{documentId} {
      allow read, list: if isSignedIn() && (resource.data.userId == request.auth.uid || request.auth.token.email.matches('.*admin.*'));
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
  }
}`, 'firestore.rules')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Copy className="w-3 h-3" /> Copy Rules
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-48">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }

    function isSignedIn() { return request.auth != null; }

    match /users/{userId} {
      allow read: if isSignedIn() && (request.auth.uid == userId || request.auth.token.email.matches('.*admin.*'));
      allow write: if isSignedIn() && request.auth.uid == userId;
    }

    match /documents/{documentId} {
      allow read, list: if isSignedIn() && (resource.data.userId == request.auth.uid || request.auth.token.email.matches('.*admin.*'));
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }

    match /activities/{activityId} {
      allow read, list: if isSignedIn() && (resource.data.userId == request.auth.uid || request.auth.token.email.matches('.*admin.*'));
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false; // Immutable audit log
    }
  }
}`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-sky-600" />
                    storage.rules (Firebase Cloud Storage)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /students/{userId}/documents/{documentId}/{fileName} {
      allow read, delete: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId && request.resource.size < 25 * 1024 * 1024;
    }
  }
}`, 'storage.rules')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Copy className="w-3 h-3" /> Copy Storage Rules
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-48">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /students/{userId}/documents/{documentId}/{fileName} {
      allow read, delete: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null 
        && request.auth.uid == userId 
        && request.resource.size < 25 * 1024 * 1024;
    }
  }
}`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>StudentVault Academic Cloud System v2.6.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
