import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'outline' | 'filled';
}

export const Input = ({ 
  className = '', 
  label, 
  error, 
  variant = 'outline',
  ...props 
}: InputProps) => {
  
  const baseClasses = 'w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  
  const variantClasses = {
    outline: 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500',
    filled: 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500'
  };

  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input className={finalClasses} {...props} />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};
