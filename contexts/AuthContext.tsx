import React, { createContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const ADMIN_EMAIL = 'santoshking471@gmail.com';
const ADMIN_PASSWORD = 'Santosh@9368';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser({
        id: 'admin001',
        name: 'Santosh King',
        email: ADMIN_EMAIL,
        isAdmin: true,
        avatar: 'https://i.pravatar.cc/200?img=12',
      });
      return true;
    }

    if (email && password.length >= 6) {
      setUser({
        id: 'user001',
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        isAdmin: false,
        avatar: 'https://i.pravatar.cc/200?img=33',
      });
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setUser({
      id: 'google001',
      name: 'Google User',
      email: 'user@gmail.com',
      isAdmin: false,
      avatar: 'https://i.pravatar.cc/200?img=15',
    });
    return true;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setUser({
      id: 'new001',
      name,
      email,
      isAdmin: false,
      avatar: 'https://i.pravatar.cc/200?img=20',
    });
    return true;
  };

  const logout = () => setUser(null);

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      loginWithGoogle,
      signup,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
