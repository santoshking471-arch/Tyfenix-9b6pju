import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; 
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword // Signup ke liye zaroori hai
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; // Phone number add ho gaya
  isAdmin: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore se user ka extra data (jaise phone number) nikalna
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();

        setUser({
          id: firebaseUser.uid,
          name: userData?.name || firebaseUser.email?.split('@')[0],
          email: firebaseUser.email || '',
          phone: userData?.phone || '', 
          isAdmin: firebaseUser.email === 'santoshking471@gmail.com',
          avatar: firebaseUser.photoURL || 'https://i.pravatar.cc/150',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Login Function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup Function (Yahan Phone Number save hoga)
  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      // Firestore mein user ki detail save karna
      await setDoc(doc(db, 'users', res.user.uid), {
        name,
        email,
        phone,
        isAdmin: email === 'santoshking471@gmail.com',
        createdAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error("Signup Error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
