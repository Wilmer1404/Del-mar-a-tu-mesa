import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  fullWidth = false,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
    link: 'bg-transparent text-sky-600 hover:text-sky-700 p-0',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // If variant is link, we don't apply the padding from sizes
  const buttonSize = variant === 'link' ? '' : sizes.md;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${buttonSize} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
