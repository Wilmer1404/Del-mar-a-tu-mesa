import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Tag,
  Fish,
  ShoppingBag,
  MapPin,
  QrCode,
  BarChart3,
  Settings,
  Ship,
  LogOut,
  Store,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Vendedor',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',          path: '/pescador/dashboard' },
      { icon: Tag,             label: 'Mis Ofertas',        path: '/pescador/ofertas' },
      { icon: Fish,            label: 'Registrar Captura',  path: '/pescador/captura' },
      { icon: QrCode,          label: 'Trazabilidad QR',    path: '/pescador/trazabilidad' },
      { icon: BarChart3,       label: 'Reportes',           path: '/pescador/reportes' },
    ],
  },
  {
    label: 'Comprador',
    items: [
      { icon: Store,       label: 'Marketplace',     path: '/pescador/marketplace' },
      { icon: ShoppingBag, label: 'Mis Compras',     path: '/pescador/compras' },
      { icon: MapPin,      label: 'Mapa de Caletas', path: '/pescador/mapa' },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { icon: Settings, label: 'Configuración', path: '/pescador/configuracion' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = auth?.nombre
    ? auth.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'P';
  const nombre  = auth?.nombre  ?? 'Cap. Arturo Prat';
  const caleta  = auth?.caleta  ?? 'Panel del Pescador';

  return (
    <aside className="flex flex-col h-full bg-slate-900 text-white w-64 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="flex-shrink-0 bg-sky-500 p-2 rounded-xl">
          <Ship size={22} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold leading-none tracking-tight">Del Mar a Tu Mesa</p>
          <p className="text-[10px] text-sky-400 font-medium mt-0.5">Panel del Pescador</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-1">
            <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest px-4 py-2">
              {section.label}
            </p>
            <ul className="space-y-0.5 px-2">
              {section.items.map(({ icon: Icon, label, path }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
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
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-slate-700/60 px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{nombre}</p>
            <p className="text-xs text-slate-400 truncate">{caleta}</p>
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
