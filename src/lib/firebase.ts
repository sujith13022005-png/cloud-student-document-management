import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export interface FirebaseCredentials {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Retrieve config from Vite environment or localStorage override
export function getFirebaseConfig(): FirebaseCredentials | null {
  // Check local storage override first (useful for in-app configuration)
  try {
    const saved = localStorage.getItem('studentvault_firebase_custom_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read custom Firebase config from localStorage', e);
  }

  // Check import.meta.env
  const env = import.meta.env;
  const apiKey = env.VITE_FIREBASE_API_KEY || '';
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN || '';
  const projectId = env.VITE_FIREBASE_PROJECT_ID || '';
  const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET || '';
  const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID || '';
  const appId = env.VITE_FIREBASE_APP_ID || '';

  // Validate that it's not the placeholder
  if (apiKey && projectId && !apiKey.includes('YourFirebaseApiKey') && !projectId.includes('studentvault-app')) {
    return {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };
  }

  return null;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let isConfigured = false;

const config = getFirebaseConfig();

if (config) {
  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isConfigured = true;
    console.log('Firebase initialized successfully with Project ID:', config.projectId);
  } catch (err) {
    console.error('Error initializing Firebase:', err);
    isConfigured = false;
  }
}

export { app, auth, db, storage, isConfigured };

// Skill error handling format
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}
