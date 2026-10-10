import React from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  Search, 
  UserCircle, 
  FolderLock, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  HardDrive, 
  FileCheck2, 
  Sparkles,
  Server,
  Layers,
  Key,
  GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onOpenSetupGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenSetupGuide }) => {
  const featureCards = [
    {
      title: 'Secure Cloud Storage',
      description: 'Zero-trust enterprise storage backed by Firebase Cloud Storage with student-scoped path isolation.',
      icon: HardDrive,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Easy Document Upload',
      description: 'Drag-and-drop intuitive uploading with MIME validation, automatic format detection, and real-time progress.',
      icon: UploadCloud,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Quick Document Retrieval',
      description: 'Instant document preview, deep multi-attribute search, and cryptographic signed download URLs.',
      icon: Search,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Student Profile Management',
      description: 'Unified student identity with verified university ID, degree programme, and academic department records.',
      icon: UserCircle,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Organized Document Library',
      description: 'Categorize by Academic, Certificates, Fee, Internship, and Projects with multi-term filtering.',
      icon: FolderLock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Secure Access & RBAC',
      description: 'Strict Attribute-Based Access Control ensuring students only access their private documents.',
      icon: Lock,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Student Authentication',
      desc: 'Register or sign in through Firebase Authentication. Your unique Student ID links with verified cloud claims.',
    },
    {
      num: '02',
      title: 'Drag & Drop Cloud Upload',
      desc: 'Upload grade sheets, certificates, ID cards, and reports. Files are validated and streamed directly to cloud storage.',
    },
    {
      num: '03',
      title: 'Metadata & Indexing in Firestore',
      desc: 'Academic year, semester, checksums, and tags are indexed in Cloud Firestore for millisecond query retrieval.',
    },
    {
      num: '04',
      title: 'Zero-Trust Retrieval & Audit',
      desc: 'Preview, download, or share verified academic records. Every interaction is recorded in immutable audit logs.',
    },
  ];

  const benefits = [
    '24/7 Global Academic Document Access',
    'Protection against loss of physical transcripts',
    'Instant verification for scholarship & internship applications',
    'Encrypted storage conforming to university privacy standards',
    'Categorized by Semester, Academic Year, and Document Type',
    'Granular Administrative Audit and Verification'
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700 mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Academic Cloud Infrastructure • Firebase Integrated</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Your Academic Documents. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
              Securely Stored in the Cloud.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Store, organize and access your academic documents securely from anywhere. 
            Designed for college students, universities, and training institutions.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate('/register')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs hover:border-slate-400 transition-all"
            >
              Student Login
            </button>
            <button
              onClick={onOpenSetupGuide}
              className="px-5 py-3 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200 transition-all flex items-center gap-1.5"
            >
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Cloud Architecture</span>
            </button>
          </div>

          {/* Interactive preview badge */}
          <div className="mt-12 max-w-4xl mx-auto p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-xl">
            <div className="flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero-Trust Document Isolation</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Firebase Cloud Firestore</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-600" />
                <span>Encrypted Blob Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>University Grade ABAC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Complete Academic Document Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every feature engineered for strict confidentiality, seamless retrieval, and academic compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Operational Pipeline</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How StudentVault Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              From authentication to encrypted cloud bucket retrieval in 4 transparent stages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs relative">
                <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4">
                  {step.num}
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-4">
                  {step.num}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 text-indigo-300 text-xs font-semibold border border-indigo-700/50 mb-4">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Zero-Trust Cloud Security Architecture</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Strict Privacy. Students own their documents.
              </h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                StudentVault enforces mathematical Attribute-Based Access Control (ABAC) in Cloud Firestore and Storage rules.
                Documents are sandboxed strictly to the authenticated student's unique identity.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>Isolated Path Scoping:</strong> Firebase Storage enforces <code>students/{'{userId}'}/*</code> access strictly by user ID token.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>Admin Privacy Safeguard:</strong> University administrators access statistical insights and enrollment rosters without unrestricted inspection of student private files.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>Audit Logging:</strong> Every upload, download, and deletion is recorded immutably in Cloud Firestore.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={onOpenSetupGuide}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>Review Security Rules</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Preview Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800 text-slate-500">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] ml-2">firestore.rules (ABAC Engine)</span>
              </div>
              <pre className="text-slate-400 overflow-x-auto text-[11px] leading-relaxed">
{`service cloud.firestore {
  match /databases/{database}/documents {
    // Zero-Trust: Default Deny
    match /{document=**} { allow read, write: if false; }

    // Student Document Isolation
    match /documents/{documentId} {
      allow read, list: if request.auth != null 
        && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Student Advantages</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Everything you need for your academic journey
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed">
                Whether applying for semester registrations, competitive examinations, job placements, or study-abroad clearances, your documents are always organized and ready.
              </p>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-600 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold opacity-80">Quick Evaluation Ready</span>
                <h3 className="text-2xl font-bold mt-2">Ready to test StudentVault?</h3>
                <p className="text-xs opacity-90 mt-2 leading-relaxed">
                  Experience the full workflow now: Register as a student, upload academic files, preview verified documents, test search filters, and check admin views.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('/register')}
                  className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-slate-100 shadow-sm"
                >
                  Create Student Account
                </button>
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-bold text-xs border border-white/20"
                >
                  Explore Demo Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white text-sm">StudentVault</span>
            <span className="text-slate-500">| Cloud-Based Student Document Management System</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            Designed for College Students, Universities & Academic Institutions • 2026
          </div>
        </div>
      </footer>
    </div>
  );
};
