import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`focus:ring-primary-green rounded border px-3 py-2 focus:ring-2 focus:outline-none ${className}`}
      {...props}
    />
  );
}
