import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function Input({
  type = 'text',
  icon: Icon,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icon size={18} />
        </div>
      )}
      
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm text-slate-900 transition-colors focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 ${
          Icon ? 'pl-10' : 'pl-3'
        } ${isPassword ? 'pr-10' : 'pr-3'} ${className}`}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}
