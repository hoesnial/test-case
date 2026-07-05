'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { error: showError } = useToast();

  useEffect(() => {
    // Skip check for admin signin page
    if (pathname === '/admin/signin') {
      return;
    }

    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      showError('Please sign in to access admin panel');
      router.push('/signin');
      return;
    }

    // Check if user is admin
    if (user?.role !== 'admin') {
      showError('Access denied. Admin privileges required.');
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router, pathname, showError, isLoading]);

  // Admin signin page doesn't need protection
  if (pathname === '/admin/signin') {
    return <>{children}</>;
  }

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated and is admin
  if (isAuthenticated && user?.role === 'admin') {
    return <>{children}</>;
  }

  // Fallback: don't render anything (will redirect in useEffect)
  return null;
}
