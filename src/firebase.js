// Firebase Authentication Only - data is stored client-side or in other services; no DB in this repo.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCu47TpcCoqyKJm2703APqwqbrl6CHGKl0",
  authDomain: "shukuma-62e08.firebaseapp.com",
  projectId: "shukuma-62e08",
  storageBucket: "shukuma-62e08.firebasestorage.app",
  messagingSenderId: "361854682628",
  appId: "1:361854682628:web:a9800e055b462abbaf5751",
  measurementId: "G-CE26ZBR43Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export only authentication services
// All user data, workouts, and progress are stored locally (no MongoDB backend in this repo)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;