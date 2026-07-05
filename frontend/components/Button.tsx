import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold leading-none
    rounded-md
    transition-all duration-150
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: `
      bg-emerald-600 text-white
      hover:bg-emerald-700
      active:bg-emerald-800 active:scale-[0.97]
    `,
    secondary: `
      bg-white text-gray-900
      border border-gray-200
      hover:bg-gray-50 hover:border-slate-300
      active:scale-[0.97]
    `,
    ghost: `
      bg-transparent text-slate-600
      hover:bg-gray-50 hover:text-gray-900
      active:scale-[0.97]
    `,
    danger: `
      bg-red-600 text-white
      hover:opacity-90
      active:opacity-80 active:scale-[0.97]
    `,
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
