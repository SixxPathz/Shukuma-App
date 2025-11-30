// Firebase Authentication Only - data is stored client-side or in other services; no DB in this repo.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Use Vite env variables (prefix with VITE_) so secrets aren't hard-coded in source.
// Example: VITE_FIREBASE_API_KEY="your-api-key"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Helpful runtime warning to catch missing environment variables early.
const missingVars = Object.entries(firebaseConfig).filter(([k, v]) => v === undefined || v === '' || v === null);
if (missingVars.length) {
  console.warn('[firebase] missing env vars:', missingVars.map(([k]) => k).join(', '), '\nMake sure to create a `.env.local` with the VITE_FIREBASE_* values (see README).');
}

// Initialize Firebase if config looks valid. If not, skip initialization and log a clear message.
let app = null;
try {
  if (!firebaseConfig.apiKey) {
    throw new Error('Missing VITE_FIREBASE_API_KEY (and/or other VITE_FIREBASE_* vars).');
  }
  app = initializeApp(firebaseConfig);
} catch (err) {
  // Console warnings are fine during development; this prevents runtime crashes in dev/test environments.
  console.warn('[firebase] Firebase not initialized:', err.message || err);
}

// Export only authentication services
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export default app;