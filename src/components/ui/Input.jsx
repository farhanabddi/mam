import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors
          ${error 
            ? 'border-red-300 focus:ring-red-500 bg-red-50' 
            : 'border-gray-300 focus:ring-emerald-500 bg-white'
          }
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </div>
  );
};

export default Input;