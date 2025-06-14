import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = '', ...props }: LabelProps) {
  return (
    <label
      className={`mb-1 block text-sm font-medium text-gray-700 ${className}`}
      {...props}
    />
  );
}
