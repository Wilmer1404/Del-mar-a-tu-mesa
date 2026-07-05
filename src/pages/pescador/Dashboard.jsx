import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import {
  DollarSign, Weight, Tag, Star,
  Plus, Eye, Pencil, Trash2, QrCode, MapPin, ArrowRight, TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

function CapturaRow({ captura }) {
  const estadoColor = {
    publicado: 'bg-emerald-100 text-emerald-700',
    pendiente: 'bg-amber-100 text-amber-700',
    en_revision: 'bg-sky-100 text-sky-700',
    vendido: 'bg-purple-100 text-purple-700',
    expirado: 'bg-slate-100 text-slate-500',
  }[captura.estado] || 'bg-slate-100 text-slate-500';

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 flex-shrink-0 text-lg">🐟</div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">{captura.especie}</p>
            <p className="text-xs text-slate-400">{captura.caleta_origen}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-700 font-medium">{parseFloat(captura.cantidad_kg).toFixed(1)} Kg</td>
      <td className="py-3 px-4 text-sm text-slate-700 font-medium">S/ {parseFloat(captura.precio_por_kg).toFixed(2)}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${estadoColor}`}>
          {captura.estado.toUpperCase().replace(/_/g, ' ')}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button aria-label="Ver detalle" className="text-slate-400 hover:text-sky-500 transition-colors"><Eye size={15} /></button>
          <button aria-label="Editar" className="text-slate-400 hover:text-amber-500 transition-colors"><Pencil size={15} /></button>
          <button aria-label="Eliminar" className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
        </div>
      </td>
    </tr>
  );
}

export default function PescadorDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [capturas, setCapturas] = useState([]);
  const [preciosLonja, setPreciosLonja] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reportes/dashboard'),
      api.get('/capturas?limit=5'),
      api.get('/precios/lonja'),
    ]).then(([dashRes, captRes, preciosRes]) => {
      setDashboard(dashRes.data);
      setCapturas(captRes.data || []);
      setPreciosLonja(preciosRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = dashboard ? [
    { label: 'Total Ventas (MES)', value: `S/ ${(dashboard.total_ventas_mes || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, sub: 'del mes actual', subColor: 'text-emerald-500', icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { label: 'Capturas (MES)', value: `${dashboard.capturas_mes || 0}`, sub: 'registradas este mes', subColor: 'text-sky-500', icon: Weight, iconBg: 'bg-sky-50', iconColor: 'text-sky-500' },
    { label: 'Ofertas Activas', value: `${dashboard.ofertas_activas || 0}`, sub: 'en la Lonja', subColor: 'text-amber-500', icon: Tag, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
    { label: 'Ofertas Vendidas', value: `${dashboard.ofertas_vendidas || 0}`, sub: 'totales', subColor: 'text-yellow-500', icon: Star, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500' },
  ] : [];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-screen-xl mx-auto">

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (<StatCard key={s.label} {...s} />))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Capturas Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Mis Capturas Recientes</h2>
              <Link to="/pescador/captura" className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-sky-600 transition-colors">
                <Plus size={14} /> Registrar Nueva
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-100 bg-slate-50/50">
                    <th className="py-2.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Especie</th>
                    <th className="py-2.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Peso</th>
                    <th className="py-2.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Precio/Kg</th>
                    <th className="py-2.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="py-2.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {capturas.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-400">Aún no tienes capturas registradas.</td></tr>
                  ) : capturas.map((c) => (<CapturaRow key={c.id} captura={c} />))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100">
              <Link to="/pescador/ofertas" className="text-xs text-sky-600 font-semibold hover:text-sky-700 flex items-center gap-1">
                Ver todo el historial <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Precios de Lonja */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">Precios de Lonja</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Últimos precios actualizados del mercado mayorista.
              </p>
              <div className="space-y-2">
                {preciosLonja.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Sin precios disponibles.</p>
                ) : preciosLonja.map((item) => {
                  const change = parseFloat(item.cambio_pct) || 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50">
                      <span className="text-sm text-slate-600 font-medium">{item.especie}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">S/ {parseFloat(item.precio).toFixed(2)}</span>
                        <span className={`text-xs font-bold ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {change >= 0 ? '+' : ''}{item.cambio_pct}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-sky-400" />
              <h3 className="text-sm font-bold">Trazabilidad QR</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Genera etiquetas trazadoras para tus últimas capturas y asegura el origen de tus productos.
            </p>
            <button onClick={() => navigate('/pescador/trazabilidad')} className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 transition-colors text-white text-xs font-bold py-2.5 rounded-xl">
              <QrCode size={14} /> Generar Etiqueta
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} className="text-sky-500" />
                <h3 className="text-sm font-bold text-slate-900">Mapa de Caletas en Tiempo Real</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Visualiza la disponibilidad de muelles, clima y puntos de desembarque preferenciales según tu ubicación actual.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" /> Muelle Libre
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Puerto Cerrado
                </div>
              </div>
            </div>
            <div className="relative h-52 bg-gradient-to-br from-sky-200 to-blue-400 overflow-hidden">
              <div className="absolute inset-0 opacity-30 text-[80px] flex items-center justify-center select-none">🗺️</div>
              <button onClick={() => navigate('/pescador/mapa')} className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-1.5">
                <MapPin size={12} /> Ampliar Mapa
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
