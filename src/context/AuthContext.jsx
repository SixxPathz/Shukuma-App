import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, updateProfile } from 'firebase/auth';
import { createUserDocument, updateUserLastLogin } from '../utils/storageUtils';

const AuthContext = createContext({
  user: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  signInWithGoogle: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Use auth user data directly without Firestore dependency
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (name, email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res.user) {
      // update display name in Auth profile
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      // Create a user document in client-side storage
      try {
        const token = await res.user.getIdToken();
        await createUserDocument({
          uid: res.user.uid,
          displayName: name || res.user.displayName || null,
          email: res.user.email,
          photoURL: res.user.photoURL || null
        }, token);
      } catch (error) {
        console.warn('Create user document failed:', error.message);
      }
      return res.user;
    }
  };

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      // Create or update a user document in client-side storage
      try {
        const token = await res.user.getIdToken();
        await createUserDocument({
          uid: res.user.uid,
          displayName: res.user.displayName || null,
          email: res.user.email,
          photoURL: res.user.photoURL || null
        }, token);
        await updateUserLastLogin(res.user.uid, token);
      } catch (error) {
        console.warn('Create/update user document failed:', error.message);
      }
      return res.user;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;