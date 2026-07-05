'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users in the system
const DEFAULT_USERS: User[] = [
  {
    id: 1,
    username: 'Admin',
    email: 'admin@minishop.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    username: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize users in localStorage if not exists
  useEffect(() => {
    const storedUsers = localStorage.getItem('users_db');
    if (!storedUsers) {
      localStorage.setItem('users_db', JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Get users from localStorage
    const storedUsers = localStorage.getItem('users_db');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;

    // Find user by email
    const foundUser = users.find(u => u.email === email);

    if (!foundUser) {
      return { success: false, error: 'Email not found. Please check your email or sign up.' };
    }

    // Check password
    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Successful login
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));

    // Redirect based on role
    if (foundUser.role === 'admin') {
      setTimeout(() => router.push('/admin'), 100);
    } else {
      setTimeout(() => router.push('/'), 100);
    }

    return { success: true };
  };

  const signUp = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Get users from localStorage
    const storedUsers = localStorage.getItem('users_db');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'Email already registered. Please use a different email or sign in.' };
    }

    // Create new user
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      username: username,
      email: email,
      password: password,
      role: 'user'
    };

    // Add to users database
    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));

    // Auto sign in after signup
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut
      }}
    >
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
