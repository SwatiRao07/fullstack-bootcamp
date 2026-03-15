"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('auth_user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const cookieMatch = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
    return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
  });

  const [isLoading] = useState(false); // Can be false immediately if we initialize sync

  const router = useRouter();

  useEffect(() => {
    // Initial mount check if needed, but we already initialized sync.
    // This effect is now empty to satisfy potential mount logic, or can be removed.
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    // Store token in a cookie so Server Components can access it
    document.cookie = `auth_token=${encodeURIComponent(newToken)}; path=/; max-age=3600; SameSite=Lax`;
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    router.push('/tasks');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // Clear both cookie and localStorage
    document.cookie = 'auth_token=; path=/; max-age=0';
    localStorage.removeItem('auth_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
