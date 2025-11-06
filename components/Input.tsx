import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  addon?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, addon, className, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          id={id}
          className={`block w-full px-3 py-2 bg-white dark:bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md placeholder-slate-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${addon ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {addon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400 sm:text-sm">{addon}</span>
            </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;