import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'sale';
}

export const Badge = ({ children, variant = 'neutral' }: BadgeProps) => {
  const baseClasses = `
    inline-flex items-center justify-center
    px-2 py-0.5
    text-xs font-semibold leading-tight
    rounded
    whitespace-nowrap
  `;

  const variantClasses = {
    neutral: 'bg-gray-50 text-slate-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
    sale: 'bg-red-600 text-white',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};
