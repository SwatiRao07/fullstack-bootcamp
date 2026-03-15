'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = () => {
      // Get user from cookie (set by server action)
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));

      if (userCookie) {
        try {
          const cookieValue = userCookie.slice(5); // Skip 'user='
          const userData = JSON.parse(decodeURIComponent(cookieValue)) as User;
          setUser(userData);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [pathname]);

  const logout = async () => {
    // Call API route
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
