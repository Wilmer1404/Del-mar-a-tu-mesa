import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Store,
  ShoppingBag,
  MapPin,
  Settings,
  LogOut,
  Waves,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { icon: Store,       label: 'Marketplace',    path: '/comprador/marketplace' },
  { icon: ShoppingBag, label: 'Mis Compras',    path: '/comprador/compras' },
  { icon: MapPin,      label: 'Mapa de Caletas',path: '/comprador/mapa' },
  { icon: Settings,    label: 'Configuración',  path: '/comprador/configuracion' },
];

export function CompradorSidebar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = auth?.nombre
    ? auth.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'CL';

  return (
    <aside className="flex flex-col h-full bg-slate-900 text-white w-64 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="flex-shrink-0 bg-emerald-500 p-2 rounded-xl">
          <Waves size={22} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold leading-none tracking-tight">Del Mar a Tu Mesa</p>
          <p className="text-[10px] text-emerald-400 font-medium mt-0.5">Portal del Comprador</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest px-5 py-2">
          Menú Principal
        </p>
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="border-t border-slate-700/60 px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{auth?.nombre ?? 'Comprador'}</p>
            <p className="text-xs text-slate-400 truncate">Solo Comprador</p>
          </div>
          <button
            aria-label="Cerrar sesión"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
