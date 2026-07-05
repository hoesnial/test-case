'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

export default function AdminSignInPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Please enter an admin token');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store the bearer token in localStorage
      localStorage.setItem('admin_token', token);

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Sign in failed:', err);
      setError('Failed to sign in. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[--color-surface-warm] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[--color-border] rounded-[--radius-lg] shadow-[--shadow-modal] p-8">
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[--color-accent] rounded-[--radius-lg] mb-4">
              <span className="text-[length:--font-size-2xl] font-bold text-[--color-accent-on]">M</span>
            </div>
            <h1 className="text-[length:--font-size-2xl] font-bold font-[family-name:--font-family-display] text-[--color-fg] mb-2">
              Admin Sign In
            </h1>
            <p className="text-[length:--font-size-sm] text-[--color-muted]">
              Enter your admin token to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[--color-danger-bg] border border-[--color-danger] rounded-[--radius-lg] text-[--color-danger] text-[length:--font-size-sm]">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="token" className="block text-[length:--font-size-sm] font-semibold text-[--color-fg] mb-2">
                Admin Token
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3 border border-[--color-border] rounded-[--radius-sm] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-transparent text-[--color-fg] bg-white"
                placeholder="Enter your admin bearer token"
                disabled={isSubmitting}
              />
              <p className="mt-2 text-[length:--font-size-xs] text-[--color-muted]">
                This token will be used as a Bearer token for API authentication
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Back to Store Link */}
          <div className="mt-6 text-center">
            <a
              href="/catalog"
              className="text-[length:--font-size-sm] text-[--color-muted] hover:text-[--color-accent] transition-colors duration-[--transition-fast]"
            >
              ← Back to Store
            </a>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-[--color-info-bg] border border-[--color-info] rounded-[--radius-lg] p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[--color-info]">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div>
              <p className="text-[length:--font-size-xs] text-[--color-info] font-medium mb-1">
                Static Bearer Token Authentication
              </p>
              <p className="text-[length:--font-size-xs] text-[--color-info]">
                The token you enter will be stored locally and sent as a Bearer token in the Authorization header for all admin API requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
