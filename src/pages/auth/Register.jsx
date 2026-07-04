import React from 'react';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

export default function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Solicitar Acceso B2B</h2>
        <p className="text-slate-500 text-sm">Únete al marketplace premium y optimiza tu cadena de suministro.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Nombre Completo
            </label>
            <Input 
              id="name" 
              type="text" 
              placeholder="Ej: María Silva" 
              icon={User} 
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="company" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Empresa
            </label>
            <Input 
              id="company" 
              type="text" 
              placeholder="Ej: Pescados del Sur" 
              icon={Briefcase} 
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Correo Electrónico Corporativo
          </label>
          <Input 
            id="email" 
            type="email" 
            placeholder="maria@empresa.com" 
            icon={Mail} 
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Contraseña
          </label>
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
            id="terms" 
            label={
              <span>
                Acepto los <a href="#" className="text-sky-600 hover:underline">términos de servicio</a> y la <a href="#" className="text-sky-600 hover:underline">política de privacidad</a>.
              </span>
            }
            required
            className="text-slate-600"
          />
        </div>

        <Button type="submit" fullWidth className="mt-4 py-3 text-base shadow-lg shadow-slate-900/10">
          Enviar Solicitud &rarr;
        </Button>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-bold text-slate-900 hover:text-sky-600 transition-colors">
            Iniciar Sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
