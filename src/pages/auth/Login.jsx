import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    // Demo: detectar rol por email (en producción sería respuesta del API)
    const rol = form.email.includes('pescador') || form.email.includes('capitan') ? 'pescador' : 'comprador';

    login({
      nombre: form.email.split('@')[0],
      email:  form.email,
      rol,
    });

    navigate(rol === 'pescador' ? '/pescador/dashboard' : '/comprador/marketplace');
  };

  return (
    <AuthLayout>
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Bienvenido</h2>
        <p className="text-slate-500 text-sm">Ingresa tus credenciales para acceder al Del Mar a Tu Mesa.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Correo Electrónico</label>
          <Input id="email" type="email" placeholder="ejemplo@delmar.com" icon={Mail} required value={form.email} onChange={handleChange('email')} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Contraseña</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors">¿Olvidaste tu contraseña?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" icon={Lock} required value={form.password} onChange={handleChange('password')} />
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <div className="pt-2">
          <Checkbox id="remember" label="Recordar sesión en este dispositivo" className="text-slate-600" />
        </div>

        {/* Demo hint */}
        <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-xs text-sky-700 space-y-1">
          <p className="font-bold">Demo rápido:</p>
          <p>• Email con "pescador" → Panel del Pescador</p>
          <p>• Cualquier otro email → Portal del Comprador</p>
        </div>

        <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-sky-500/20" disabled={loading}>
          {loading ? 'Ingresando…' : 'Iniciar Sesión →'}
        </Button>

        <p className="text-center text-sm text-slate-500 mt-8">
          ¿Aún no eres parte de la red?{' '}
          <Link to="/register" className="font-bold text-slate-900 hover:text-sky-600 transition-colors">Registrate</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
