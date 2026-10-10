import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Applications');
  const [programme, setProgramme] = useState('Master of Computer Applications');
  const [year, setYear] = useState('2');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // One-click fill with student details (Sujith T) as given in user request
  const handleFillSample = () => {
    setName('Sujith T');
    setStudentId('MCA2026XXX');
    setEmail('sujith13022005@gmail.com');
    setPhone('+91 98765 43210');
    setDepartment('Computer Applications');
    setProgramme('Master of Computer Applications');
    setYear('2');
    setPassword('SecurePass2026!');
    setConfirmPassword('SecurePass2026!');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field validation
    if (!name.trim() || !studentId.trim() || !email.trim() || !phone.trim() || !department.trim() || !programme.trim() || !year) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid university or personal email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both entries.');
      return;
    }

    setSubmitting(true);
    const ok = await register({
      name,
      studentId,
      email,
      phone,
      department,
      programme,
      year,
      password,
      role: 'student',
    });

    setSubmitting(false);

    if (ok) {
      success(`Welcome to StudentVault, ${name}! Your student cloud vault is ready.`);
      onNavigate('/dashboard');
    } else {
      setErrorMessage('Registration failed. Please check your inputs and try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">Student Registration</h1>
                <p className="text-xs text-indigo-200">
                  Provision your institutional Cloud Document Vault
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFillSample}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-800/80 hover:bg-indigo-700 text-xs font-semibold text-indigo-100 border border-indigo-600/50 transition-colors"
              title="Autofill prompt's sample student data (Sujith T)"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Fill Sujith T Example</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sujith T"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student ID / Enrollment No. *
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. MCA2026XXX"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-mono"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University / Personal Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sujith13022005@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department *
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Applications"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Programme */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Programme / Degree *
              </label>
              <input
                type="text"
                required
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                placeholder="Master of Computer Applications"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Year *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 bg-white"
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
            </div>

            {/* Role indicator */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                System Role
              </label>
              <div className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                Student Account (Private Vault)
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Cloud Vault Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered with StudentVault?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="font-bold text-indigo-600 hover:text-indigo-800 underline"
            >
              Sign In here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
