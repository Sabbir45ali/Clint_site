import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      setCurrentUser(JSON.parse(mockUser));
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { uid: '123', email, displayName: email.split('@')[0] };
        setCurrentUser(user);
        localStorage.setItem('mockUser', JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  };

  const signupWithEmail = async (email, password, name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { uid: '123', email, displayName: name };
        setCurrentUser(user);
        localStorage.setItem('mockUser', JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  };

  const loginWithGoogle = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { uid: 'google_123', email: 'guest@google.com', displayName: 'Google Guest' };
        setCurrentUser(user);
        localStorage.setItem('mockUser', JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  };

  const updateUserProfile = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...currentUser, ...data };
        setCurrentUser(updatedUser);
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 500);
    });
  };

  const logout = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        localStorage.removeItem('mockUser');
        resolve();
      }, 500);
    });
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
