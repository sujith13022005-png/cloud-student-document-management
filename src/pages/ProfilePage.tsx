import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  BookOpen, 
  Calendar, 
  Save, 
  ShieldCheck, 
  Lock, 
  Camera, 
  CheckCircle2, 
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useDocuments } from '../context/DocumentContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { storageStats, documents, logActivity } = useDocuments();
  const { success, error } = useToast();

  if (!user) return null;

  const [phone, setPhone] = useState(user.phone || '');
  const [department, setDepartment] = useState(user.department || '');
  const [programme, setProgramme] = useState(user.programme || '');
  const [year, setYear] = useState(user.year || '1');
  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showPhotoPrompt, setShowPhotoPrompt] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const ok = await updateProfile({
      phone: phone.trim(),
      department: department.trim(),
      programme: programme.trim(),
      year: year.trim(),
      profileImage: profileImage.trim(),
    });

    setIsSaving(false);

    if (ok) {
      logActivity('update_profile', undefined, undefined, 'Updated student contact and academic department details');
      success('Student profile updated successfully in Cloud Firestore!');
    } else {
      error('Could not save profile updates.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Profile Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review and update your academic enrollment credentials and emergency contact information.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Banner with Avatar */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 relative" />

        <div className="px-6 sm:px-8 pb-8">
          {/* Avatar & Header Info */}
          <div className="relative -mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <img
                  src={profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPhotoPrompt(!showPhotoPrompt)}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
                  title="Update photo URL"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">{user.name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active Student
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">
                  ID: {user.studentId}
                </p>
                <p className="text-xs text-slate-500">
                  {user.programme} • Class of 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vault Assets</p>
                <p className="text-sm font-extrabold text-slate-900">{documents.length} Files</p>
              </div>
            </div>
          </div>

          {/* Optional Photo URL Changer */}
          {showPhotoPrompt && (
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
              <label className="block font-bold text-indigo-900">
                Avatar Image URL (HTTPS)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-indigo-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPhotoPrompt(false)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name (Readonly for identity security) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Verified Name
                  </span>
                </div>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Student ID (Locked) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Student ID / Roll No.</label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> University ID
                  </span>
                </div>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    disabled
                    value={user.studentId}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed font-mono font-bold"
                  />
                </div>
              </div>

              {/* Email (Locked as per Section 19) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Verified Email</label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Auth Principal
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Phone (Editable) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Department (Editable) */}
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
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Programme (Editable) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Degree Programme *
                </label>
                <input
                  type="text"
                  required
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Year (Editable) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Academic Year *
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

              {/* Account Security Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cloud Verification Status
                </label>
                <div className="px-3.5 py-2 text-xs rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Enrolled & Identity Verified</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                To update your Student ID or verified university email, please contact the Registrar's Office.
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
