// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Implement your authentication functions like signInWithEmailAndPassword, etc.
  // For example:
  const signInWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      setCurrentUser(userCredential.user);
    } catch (error) {
      // Handle login errors if needed
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, signInWithEmailAndPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

export { AuthContextProvider, useAuth };
export default AuthContext;
