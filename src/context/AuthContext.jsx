import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, messaging, getToken } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile
} from 'firebase/auth';
import { syncUser, saveFcmToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user && messaging) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const token = await getToken(messaging, {
              vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });
            if (token) {
              await saveFcmToken(token);
            }
          }
        } catch (error) {
          console.error('Failed to get FCM token:', error);
        }
      }
    });
    return unsubscribe;
  }, []);

  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (email, password, name, phone) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await sendEmailVerification(userCredential.user);
    await syncUser({ displayName: name, phone: phone || '' });
    await userCredential.user.reload();
    setCurrentUser(auth.currentUser);
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    await syncUser(credential.user.displayName);
    return credential;
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data) => {
    if (!auth.currentUser) throw new Error("No user logged in");

    const updates = {};
    if (data.displayName) updates.displayName = data.displayName;
    if (data.photoURL) updates.photoURL = data.photoURL;

    if (Object.keys(updates).length > 0) {
      await updateProfile(auth.currentUser, updates);
    }

    if (data.email && data.email !== auth.currentUser.email) {
      await updateEmail(auth.currentUser, data.email);
    }

    await auth.currentUser.reload();
    setCurrentUser({ ...auth.currentUser });
    return auth.currentUser;
  };

  const logout = () => {
    return signOut(auth);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--color-background)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    );
  }

  const value = {
    currentUser,
    loginWithEmail,
    signupWithEmail,
    updateUserProfile,
    loginWithGoogle,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
