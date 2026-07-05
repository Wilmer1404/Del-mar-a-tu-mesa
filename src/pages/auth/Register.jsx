import { useState } from 'react';
import { Mail, Lock, User, Phone, Fish, ShoppingBag, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { useAuth } from '../../context/AuthContext';

// ── Rol selector card ─────────────────────────────────────────────────────────
function RolCard({ rol, selected, onSelect }) {
  const config = {
    comprador: {
      icon: ShoppingBag,
      color:  selected ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/30' : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50',
      iconBg: selected ? 'bg-emerald-500' : 'bg-slate-100',
      iconColor: selected ? 'text-white' : 'text-slate-500',
      title: 'Solo Comprador',
      desc:  'Accede al marketplace, compra directamente a pescadores y sigue el mapa de caletas.',
      badge: 'Básico',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      features: ['Marketplace B2B', 'Historial de compras', 'Mapa de caletas', 'Configuración'],
    },
    pescador: {
      icon: Fish,
      color:  selected ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-400/30' : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50/50',
      iconBg: selected ? 'bg-sky-500' : 'bg-slate-100',
      iconColor: selected ? 'text-white' : 'text-slate-500',
      title: 'Pescador + Cliente',
      desc:  'Vende tus capturas, registra lotes con QR, consulta reportes y también compra insumos.',
      badge: 'Completo',
      badgeColor: 'bg-sky-100 text-sky-700',
      features: ['Todo lo básico', 'Publicar ofertas', 'Registrar capturas', 'Trazabilidad QR', 'Reportes y estadísticas'],
    },
  };

  const cfg = config[rol];
  const Icon = cfg.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(rol)}
      className={`relative text-left w-full p-4 rounded-2xl border-2 transition-all duration-200 ${cfg.color}`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
          <CheckCircle size={14} className={rol === 'pescador' ? 'text-sky-500' : 'text-emerald-500'} />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.iconBg} transition-colors`}>
          <Icon size={20} className={cfg.iconColor} />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm leading-tight">{cfg.title}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeColor}`}>{cfg.badge}</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-3">{cfg.desc}</p>

      <ul className="space-y-1">
        {cfg.features.map(f => (
          <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${rol === 'pescador' ? 'bg-sky-400' : 'bg-emerald-400'}`} />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Register() {
  const { register } = useAuth();
  const navigate  = useNavigate();

  const [step, setStep]     = useState(1); // 1 = elegir rol, 2 = datos
  const [rol, setRol]       = useState('');
  const [form, setForm]     = useState({ nombre: '', email: '', telefono: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}));

  const handleContinuar = () => {
    if (!rol) return;
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await register({ nombre: form.nombre, email: form.email, password: form.password, telefono: form.telefono, rol });
      navigate(session.rol === 'pescador' ? '/pescador/dashboard' : '/comprador/marketplace');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
            {s < 2 && <div className={`h-0.5 w-8 rounded-full transition-all ${step > s ? 'bg-slate-900' : 'bg-slate-200'}`} />}
          </div>
        ))}
        <p className="text-xs text-slate-500 ml-1">{step === 1 ? 'Elige tu rol' : 'Tus datos'}</p>
      </div>

      {step === 1 ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">¿Cómo deseas usar la plataforma?</h2>
            <p className="text-slate-500 text-sm mt-1">Selecciona el tipo de cuenta que mejor se adapte a ti.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <RolCard rol="comprador" selected={rol === 'comprador'} onSelect={setRol} />
            <RolCard rol="pescador"  selected={rol === 'pescador'}  onSelect={setRol} />
          </div>

          <Button
            type="button"
            fullWidth
            size="lg"
            className="shadow-lg shadow-sky-500/20"
            disabled={!rol}
            onClick={handleContinuar}
          >
            Continuar →
          </Button>

          <p className="text-center text-sm text-slate-500 mt-5">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-bold text-slate-900 hover:text-sky-600 transition-colors">
              Iniciar Sesión
            </Link>
          </p>
        </>
      ) : (
        <>
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-slate-700 mb-3 flex items-center gap-1"
            >
              ← Cambiar rol
            </button>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Crea tu cuenta con nosotros</h2>
            <p className="text-slate-500 text-sm mt-1">
              Registrándote como{' '}
              <span className={`font-bold ${rol === 'pescador' ? 'text-sky-600' : 'text-emerald-600'}`}>
                {rol === 'pescador' ? 'Pescador + Cliente' : 'Solo Comprador'}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="nombre" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Nombre Completo</label>
                <Input id="nombre" type="text" placeholder="Ej: María Silva" icon={User} required value={form.nombre} onChange={handleChange('nombre')} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="telefono" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Teléfono</label>
                <Input id="telefono" type="tel" placeholder="+51 9XX XXX XXX" icon={Phone} value={form.telefono} onChange={handleChange('telefono')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Correo Electrónico</label>
              <Input id="email" type="email" placeholder="ejemplo@correo.com" icon={Mail} required value={form.email} onChange={handleChange('email')} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Contraseña</label>
              <Input id="password" type="password" placeholder="Mínimo 8 caracteres" icon={Lock} required value={form.password} onChange={handleChange('password')} />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <Checkbox
              id="terms"
              label={<span>Acepto los <a href="#" className="text-sky-600 hover:underline">términos de servicio</a> y la <a href="#" className="text-sky-600 hover:underline">política de privacidad</a>.</span>}
              required
              className="text-slate-600"
            />

            <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-sky-500/20" disabled={loading}>
              {loading ? 'Creando cuenta…' : 'Crear Cuenta →'}
            </Button>

            <p className="text-center text-sm text-slate-500">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-bold text-slate-900 hover:text-sky-600 transition-colors">Iniciar Sesión</Link>
            </p>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
