import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  UserCheck, 
  Lock,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useDocuments } from '../context/DocumentContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { formatFileSize } from '../components/DocumentCard.tsx';
import type { UserProfile } from '../types/index.ts';

export const AdminStudentsPage: React.FC = () => {
  const { allStudents } = useAuth();
  const { documents } = useDocuments();
  const { success, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  // Departments list
  const departments = Array.from(new Set(allStudents.map((s) => s.department)));

  const filteredStudents = allStudents.filter((s) => {
    if (departmentFilter !== 'all' && s.department !== departmentFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchId = s.studentId.toLowerCase().includes(q);
      const matchEmail = s.email.toLowerCase().includes(q);
      const matchProg = s.programme.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchEmail && !matchProg) return false;
    }
    return true;
  });

  const getStudentDocsCount = (userId: string) => {
    return documents.filter((d) => d.userId === userId).length;
  };

  const getStudentStorageBytes = (userId: string) => {
    return documents.filter((d) => d.userId === userId).reduce((acc, d) => acc + d.fileSize, 0);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Enrollment Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor university student accounts, storage allocations, and department distributions.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID (e.g. MCA2026XXX), or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-hidden focus:border-purple-500"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Student Information</th>
                <th className="py-3.5 px-3">Student ID</th>
                <th className="py-3.5 px-3">Department & Programme</th>
                <th className="py-3.5 px-3">Year</th>
                <th className="py-3.5 px-3">Total Docs</th>
                <th className="py-3.5 px-3">Storage Used</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((stu) => {
                const docCount = getStudentDocsCount(stu.userId);
                const bytesUsed = getStudentStorageBytes(stu.userId);

                return (
                  <tr key={stu.userId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${stu.name}`}
                          alt={stu.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{stu.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{stu.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                      {stu.studentId}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-800">{stu.programme}</p>
                      <p className="text-[11px] text-slate-400">{stu.department}</p>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 font-semibold">
                      Year {stu.year}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-indigo-600 font-bold">
                      {docCount}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-600">
                      {formatFileSize(bytesUsed)}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {stu.status || 'Active'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => setSelectedStudent(stu)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 font-semibold text-xs transition-colors"
                      >
                        Profile Card
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Modal for Admin */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedStudent.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedStudent.name}`}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200"
              />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-xs font-mono font-bold text-indigo-600">{selectedStudent.studentId}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {selectedStudent.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Programme:</span>
                <span className="font-bold text-slate-900">{selectedStudent.programme}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.department}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Current Year:</span>
                <span className="font-semibold text-slate-800">Year {selectedStudent.year}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-slate-800">{selectedStudent.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono text-slate-800">{selectedStudent.phone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Documents Stored:</span>
                <span className="font-bold text-indigo-600">{getStudentDocsCount(selectedStudent.userId)} documents</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-[11px] text-slate-400">Privacy rule: student files are confidential</span>
              <button
                onClick={() => {
                  info(`Student profile ${selectedStudent.studentId} verified.`);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
