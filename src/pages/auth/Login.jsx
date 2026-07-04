
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <AuthLayout>
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Bienvenido</h2>
        <p className="text-slate-500 text-sm">Ingresa tus credenciales para acceder al del mar a tu mesa.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Correo Electrónico
          </label>
          <Input 
            id="email" 
            type="email" 
            placeholder="ejemplo@delmar.com" 
            icon={Mail} 
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Contraseña
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            icon={Lock} 
            required
          />
        </div>

        <div className="pt-2">
          <Checkbox 
            id="remember" 
            label="Recordar sesión en este dispositivo" 
            className="text-slate-600"
          />
        </div>

        <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-sky-500/20">
          Iniciar Sesión &rarr;
        </Button>

        <p className="text-center text-sm text-slate-500 mt-8">
          ¿Aún no eres parte de la red?{' '}
          <Link to="/register" className="font-bold text-slate-900 hover:text-sky-600 transition-colors">
            Registrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
