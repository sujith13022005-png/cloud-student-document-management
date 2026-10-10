import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  HardDrive, 
  Database, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  FolderLock,
  Lock,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';

export const AdminSettingsPage: React.FC = () => {
  const { success, info } = useToast();

  const [quotaGB, setQuotaGB] = useState('5');
  const [allowPublicLinks, setAllowPublicLinks] = useState(false);
  const [requireVerifiedEmail, setRequireVerifiedEmail] = useState(true);
  const [auditRetentionDays, setAuditRetentionDays] = useState('365');
  const [categories, setCategories] = useState<string[]>([
    'Academic',
    'Certificate',
    'Identity',
    'Fee',
    'Internship',
    'Project',
    'Resume',
    'Other',
  ]);
  const [newCat, setNewCat] = useState('');

  const handleAddCategory = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories([...categories, newCat.trim()]);
      setNewCat('');
      success(`Added category "${newCat.trim()}"`);
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
    info(`Removed category "${cat}"`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    success('System policies and storage quotas updated successfully!');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          System Administration Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure university document categories, storage quotas, and security compliance rules.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Storage Quota Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            Student Storage Quota & Capacity
          </h3>
          <p className="text-xs text-slate-500">
            Set the default maximum Firebase Storage allocation per enrolled student.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage Allocation Per Student
              </label>
              <select
                value={quotaGB}
                onChange={(e) => setQuotaGB(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="2">2 GB (Undergraduate standard)</option>
                <option value="5">5 GB (Recommended default)</option>
                <option value="10">10 GB (Graduate / Research)</option>
                <option value="25">25 GB (Faculty / Extended)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Audit Log Retention Policy
              </label>
              <select
                value={auditRetentionDays}
                onChange={(e) => setAuditRetentionDays(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">365 Days (1 Academic Year)</option>
                <option value="1825">5 Years (Accreditation standard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Policies */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero-Trust Access Control Policies
          </h3>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={requireVerifiedEmail}
                onChange={(e) => setRequireVerifiedEmail(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800">Enforce Institutional Email Verification</span>
                <p className="text-slate-500 mt-0.5">
                  Mandates <code>request.auth.token.email_verified == true</code> for student write permissions.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={allowPublicLinks}
                onChange={(e) => setAllowPublicLinks(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800">Allow Public Sharing Links (Disabled by default)</span>
                <p className="text-slate-500 mt-0.5">
                  When disabled, all documents require active session Bearer tokens; no unauthenticated access permitted.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Manage Document Categories */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FolderLock className="w-4 h-4 text-purple-600" />
            Institutional Document Categories
          </h3>

          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-2 border border-slate-200"
              >
                <span>{cat}</span>
                {categories.length > 3 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="text-slate-400 hover:text-rose-600"
                    title="Remove category"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="e.g. Recommendation Letter"
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 w-64"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save System Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
