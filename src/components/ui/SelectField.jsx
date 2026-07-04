import React from 'react';

/**
 * SelectField – Reutilizable en cualquier formulario del sistema.
 * Props: label, id, icon (lucide), options [{ value, label }], required, ...rest
 */
export function SelectField({ label, id, icon: Icon, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Icon size={16} />
          </div>
        )}
        <select
          id={id}
          className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm text-slate-700 transition-colors focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 pr-8 ${
            Icon ? 'pl-9' : 'pl-3'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
