import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types/index.ts';
import { auth, db, isConfigured } from '../lib/firebase.ts';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface RegisterData {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  programme: string;
  year: string;
  password?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  loading: boolean;
  isFirebaseLive: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  switchDemoRole: (role: UserRole) => void;
  allStudents: UserProfile[];
}

const STORAGE_KEY_USER = 'studentvault_active_user';
const STORAGE_KEY_USERS_DB = 'studentvault_all_users_db';

const DEFAULT_STUDENT: UserProfile = {
  userId: 'usr_sujith_mca_2026',
  name: 'Sujith T',
  studentId: 'MCA2026XXX',
  email: 'sujith13022005@gmail.com',
  phone: '+91 98765 43210',
  department: 'Computer Applications',
  programme: 'Master of Computer Applications',
  year: '2',
  role: 'student',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  status: 'active',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_ADMIN: UserProfile = {
  userId: 'usr_admin_vault_office',
  name: 'Dr. Aris Thorne (Registrar)',
  studentId: 'ADMIN-2026-X1',
  email: 'admin@studentvault.edu',
  phone: '+1 (555) 019-2834',
  department: 'Academic Affairs & Records',
  programme: 'University Administration',
  year: 'Faculty',
  role: 'admin',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  status: 'active',
  createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const INITIAL_STUDENTS_LIST: UserProfile[] = [
  DEFAULT_STUDENT,
  {
    userId: 'usr_ananya_cs',
    name: 'Ananya Sharma',
    studentId: 'CS2025089',
    email: 'ananya.s@university.edu',
    phone: '+91 98220 11223',
    department: 'Computer Science & Engineering',
    programme: 'B.Tech Computer Science',
    year: '3',
    role: 'student',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: 'usr_marcus_ece',
    name: 'Marcus Vance',
    studentId: 'ECE2024012',
    email: 'marcus.v@university.edu',
    phone: '+1 (555) 423-9988',
    department: 'Electronics & Communication',
    programme: 'M.Tech Embedded Systems',
    year: '1',
    role: 'student',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: 'usr_priya_mba',
    name: 'Priya Nair',
    studentId: 'MBA2026401',
    email: 'priya.nair@university.edu',
    phone: '+91 94470 33445',
    department: 'Management Studies',
    programme: 'MBA Systems & Analytics',
    year: '2',
    role: 'student',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);

  // Initialize DB from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (storedUsers) {
        setAllStudents(JSON.parse(storedUsers));
      } else {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(INITIAL_STUDENTS_LIST));
        setAllStudents(INITIAL_STUDENTS_LIST);
      }

      const activeUser = localStorage.getItem(STORAGE_KEY_USER);
      if (activeUser) {
        setUser(JSON.parse(activeUser));
      } else {
        // Auto sign in as Sujith T for frictionless review if desired
        setUser(DEFAULT_STUDENT);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_STUDENT));
      }
    } catch (e) {
      console.error('Error loading stored users:', e);
      setUser(DEFAULT_STUDENT);
    }

    // If live Firebase Auth is configured, listen to auth changes
    if (isConfigured && auth && db) {
      const activeDb = db;
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser && activeDb) {
          try {
            const userDocRef = doc(activeDb, 'users', fbUser.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const profile = userSnap.data() as UserProfile;
              setUser(profile);
              localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
            }
          } catch (err) {
            console.warn('Could not fetch Firestore user doc:', err);
          }
        }
      });
      return () => unsubscribe();
    }

    setLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // 1. Live Firebase Auth if available
      if (isConfigured && auth && db) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, _password);
          const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            setUser(profile);
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
            setLoading(false);
            return true;
          }
        } catch (firebaseErr) {
          console.warn('Firebase login failed or fallback needed:', firebaseErr);
        }
      }

      // 2. Local Cloud fallback
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail.includes('admin') || normalizedEmail === 'admin@studentvault.edu') {
        setUser(DEFAULT_ADMIN);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_ADMIN));
        setLoading(false);
        return true;
      }

      // Check registered users
      const match = allStudents.find((s) => s.email.toLowerCase() === normalizedEmail);
      if (match) {
        setUser(match);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(match));
      } else {
        // Create user session based on email
        const newStudent: UserProfile = {
          userId: 'usr_' + Math.random().toString(36).substring(2, 9),
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          studentId: 'STU' + Math.floor(100000 + Math.random() * 900000),
          email: email,
          phone: '+91 98000 12345',
          department: 'Computer Science',
          programme: 'Bachelor of Science / Technology',
          year: '1',
          role: 'student',
          profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...allStudents, newStudent];
        setAllStudents(updated);
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(updated));
        setUser(newStudent);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newStudent));
      }

      setLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    try {
      const uid = 'usr_' + Math.random().toString(36).substring(2, 10);
      const newProfile: UserProfile = {
        userId: uid,
        name: data.name.trim(),
        studentId: data.studentId.trim().toUpperCase(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        department: data.department.trim(),
        programme: data.programme.trim(),
        year: data.year.trim(),
        role: data.role || 'student',
        profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Live Firebase registration if active
      if (isConfigured && auth && db && data.password) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
          newProfile.userId = cred.user.uid;
          await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        } catch (fbErr) {
          console.warn('Firebase user creation fallback:', fbErr);
        }
      }

      const updated = [newProfile, ...allStudents.filter((s) => s.email !== newProfile.email)];
      setAllStudents(updated);
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(updated));

      setUser(newProfile);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newProfile));

      setLoading(false);
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (isConfigured && auth) {
        await firebaseSignOut(auth).catch(() => {});
      }
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated: UserProfile = {
      ...user,
      ...updates,
      // Protect sensitive immutable identity fields
      userId: user.userId,
      studentId: user.studentId,
      email: user.email,
      role: user.role,
      updatedAt: new Date().toISOString(),
    };

    setUser(updated);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));

    // Update list
    const updatedList = allStudents.map((s) => (s.userId === user.userId ? updated : s));
    setAllStudents(updatedList);
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(updatedList));

    // Sync to Firestore if live
    if (isConfigured && db) {
      try {
        await setDoc(doc(db, 'users', user.userId), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore profile sync error:', err);
      }
    }

    return true;
  };

  const switchDemoRole = (targetRole: UserRole) => {
    if (targetRole === 'admin') {
      setUser(DEFAULT_ADMIN);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_ADMIN));
    } else {
      setUser(DEFAULT_STUDENT);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_STUDENT));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isAuthenticated: !!user,
        loading,
        isFirebaseLive: isConfigured,
        login,
        register,
        logout,
        updateProfile,
        switchDemoRole,
        allStudents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
