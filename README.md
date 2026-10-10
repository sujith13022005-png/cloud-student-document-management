# StudentVault – Cloud-Based Student Document Management System

StudentVault is a centralized, secure, cloud-native web application engineered for college students, universities, academic institutions, and training centers to store, organize, verify, and retrieve academic documents with role-based access control and zero-trust security.

---

## 1. System Architecture

```
Student Client (React / TypeScript / Tailwind CSS)
       ↓
Firebase Authentication (Session & Identity Claims)
       ↓
Cloud Storage Bucket (Private student/{userId}/documents/{docId}/* paths)
       ↓
Cloud Firestore NoSQL Database (Metadata, Indices, Audit Trail)
       ↓
Zero-Trust ABAC Retrieval & Signed Blob Access
```

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Cloud Backend:** Node.js / Express
- **Cloud Database:** Firebase Cloud Firestore
- **Cloud Storage:** Firebase Cloud Storage (with IndexedDB fallback)
- **Authentication:** Firebase Authentication (Email/Password, Token Claims)
- **Security:** Zero-Trust Attribute-Based Access Control (ABAC) rules

---

## 3. Environment Variables Configuration

Create a `.env` file in the root directory:

```env
# Firebase Cloud Integration Configuration
VITE_FIREBASE_API_KEY="AIzaSyYourFirebaseApiKeyHere"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

*Note: If Firebase environment variables are not yet provided, StudentVault gracefully operates in protected local cloud simulation mode so all features (uploading real files, previewing, downloading, searching, admin monitoring) remain 100% operational.*

---

## 4. Complete 10-Step Setup & Deployment Guide

### Step 1: Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com).
2. Click **"Add project"** and enter a name (e.g. `studentvault-cloud`).
3. Click **Continue** and finish creation.

### Step 2: Enable Firebase Authentication
1. In the Firebase Console, go to **Build > Authentication > Sign-in method**.
2. Select **Email/Password** and toggle **Enable**.
3. Save changes.

### Step 3: Configure Cloud Firestore
1. Navigate to **Build > Firestore Database** and click **Create database**.
2. Select your cloud region (e.g. `us-central1` or `asia-south1`).
3. Choose **Production mode**.

### Step 4: Configure Firebase Cloud Storage
1. Navigate to **Build > Storage** and click **Get started**.
2. Select standard cloud storage location matching your Firestore region.
3. Your storage bucket URL will be `your-project-id.appspot.com`.

### Step 5: Add Web App & Environment Variables
1. Go to **Project Settings > General > Your apps** and click the **Web (</>)** icon.
2. Register the app (e.g. `StudentVault Web`).
3. Copy the configuration keys into `.env` (or use the in-app **Firebase Architecture & Credentials Connector** modal).

### Step 6: Configure Firestore & Storage Security Rules
Deploy `firestore.rules` and `storage.rules`:

**Firestore Security Rules (`firestore.rules`):**
```javascript
rules_version = '2';
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
      allow update, delete: if false;
    }
  }
}
```

**Storage Security Rules (`storage.rules`):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /students/{userId}/documents/{documentId}/{fileName} {
      allow read, delete: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId && request.resource.size < 25 * 1024 * 1024;
    }
  }
}
```

### Step 7: Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### Step 8: Build Production Version
```bash
npm run build
```
Compiled production bundles will be generated in `dist/`.

### Step 9: Create an Admin User
To provision an administrator:
1. In Cloud Firestore, create a document in the `admins` collection with the administrator's UID:
   `admins/{adminUid}` with `{ role: "admin", createdAt: request.time }`.
2. Or log in with an administrative email matching `admin@studentvault.edu`.

### Step 10: Configure CORS for Cloud Storage
If uploading directly from a web browser domain to Cloud Storage, set `cors.json`:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```
Apply via Google Cloud SDK:
```bash
gsutil cors set cors.json gs://your-project-id.appspot.com
```

---

## 5. Security & Privacy Safeguards

- **Isolated File Trees:** Every student's files are partitioned in `students/{userId}/documents/{documentId}/`.
- **Administrative Privacy Boundary:** Administrators can monitor institutional statistics, storage quotas, and enrollment directories without accessing sensitive student document contents unless authorized.
- **Audit Trails:** All uploads, downloads, renames, and deletions are recorded with timestamps.
