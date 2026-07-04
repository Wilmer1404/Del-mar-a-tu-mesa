import React from 'react';

export function Checkbox({ label, id, className = '', ...props }) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}
