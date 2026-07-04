import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import {
  DollarSign,
  Weight,
  Tag,
  Star,
  Plus,
  Eye,
  Pencil,
  Trash2,
  QrCode,
  MapPin,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Mock data ────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Ventas (MES)', value: 'S/ 4,250.00', sub: '↑ +12% este mes', subColor: 'text-emerald-500', icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  { label: 'KG Vendidos', value: '842.5 Kg', sub: '↑ +8% vs semana pasada', subColor: 'text-sky-500', icon: Weight, iconBg: 'bg-sky-50', iconColor: 'text-sky-500' },
  { label: 'Ofertas Activas', value: '06', sub: 'en la Lonja', subColor: 'text-amber-500', icon: Tag, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { label: 'Calificación', value: '4.9 ★★★★★', sub: 'de compradores', subColor: 'text-yellow-500', icon: Star, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500' },
];

const CAPTURAS = [
  { id: 1, nombre: 'Huachinango del Pacífico', lugar: 'Puerto Madero, Az', peso: '40.5', precio: '32.00', estado: 'PUBLICADO', estadoColor: 'bg-emerald-100 text-emerald-700' },
  { id: 2, nombre: 'Atún Aleta Azul', lugar: 'Puerto Madero', peso: '120.0', precio: '85.50', estado: 'PENDIENTE', estadoColor: 'bg-amber-100 text-amber-700' },
  { id: 3, nombre: 'Langostino Jumbo', lugar: 'Bahía Central Bay', peso: '22.5', precio: '48.00', estado: 'EN REVISIÓN', estadoColor: 'bg-sky-100 text-sky-700' },
];

const INSUMOS = [
  { id: 1, nombre: 'Redes de Cerco Reforzadas', precio: 'S/ 4,420.00', tag: 'TOP', tagColor: 'bg-red-500' },
  { id: 2, nombre: 'Combustible Diesel B5', precio: 'S/ 16.50 / Gl', tag: 'NUEVO', tagColor: 'bg-sky-500' },
  { id: 3, nombre: 'Mantenimiento de Casco', precio: 'Disponibilidad limitada', tag: 'OFERTA', tagColor: 'bg-amber-500' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function CapturaRow({ captura }) {
  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 flex-shrink-0 text-lg">
            🐟
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">{captura.nombre}</p>
            <p className="text-xs text-slate-400">{captura.lugar}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-700 font-medium">{captura.peso} Kg</td>
      <td className="py-3 px-4 text-sm text-slate-700 font-medium">S/ {captura.precio}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${captura.estadoColor}`}>
          {captura.estado}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-sky-500 transition-colors"><Eye size={15} /></button>
          <button className="text-slate-400 hover:text-amber-500 transition-colors"><Pencil size={15} /></button>
          <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
        </div>
      </td>
    </tr>
  );
}

function InsumoCard({ insumo }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
        🛒
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-slate-800 truncate">{insumo.nombre}</p>
          <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md flex-shrink-0 ${insumo.tagColor}`}>
            {insumo.tag}
          </span>
        </div>
        <p className="text-xs text-sky-600 font-bold">{insumo.precio}</p>
      </div>
      <button className="text-slate-400 hover:text-sky-500 flex-shrink-0">
        <ShoppingCart size={16} />
      </button>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PescadorDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-screen-xl mx-auto">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ── Main Grid: Capturas + Insumos ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Capturas Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Mis Capturas Recientes</h2>
              <Link
                to="/pescador/captura"
                className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-sky-600 transition-colors"
              >
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
                  {CAPTURAS.map((c) => <CapturaRow key={c.id} captura={c} />)}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100">
              <Link to="/pescador/ofertas" className="text-xs text-sky-600 font-semibold hover:text-sky-700 flex items-center gap-1">
                Ver todo el historial <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">Precios de Lonja</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                El precio de la Corvina subió un <span className="text-emerald-600 font-bold">15%</span> hoy. ¡Buen momento para vender!
              </p>
              <div className="space-y-2">
                {[
                  { name: 'Huachinango', price: 'S/ 32.00', change: '+5%', up: true },
                  { name: 'Atún Aleta', price: 'S/ 85.50', change: '+12%', up: true },
                  { name: 'Langostino', price: 'S/ 48.00', change: '-3%', up: false },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-600 font-medium">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">{item.price}</span>
                      <span className={`text-xs font-bold ${item.up ? 'text-emerald-500' : 'text-red-500'}`}>{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: QR + Mapa ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Trazabilidad QR */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-sky-400" />
              <h3 className="text-sm font-bold">Trazabilidad QR</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Genera etiquetas trazadoras para tus últimas capturas y asegura el origen de tus productos.
            </p>
            <button className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 transition-colors text-white text-xs font-bold py-2.5 rounded-xl">
              <QrCode size={14} /> Generar Etiqueta
            </button>
          </div>

          {/* Mapa de Caletas */}
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
            {/* Map Placeholder */}
            <div className="relative h-52 bg-gradient-to-br from-sky-200 to-blue-400 overflow-hidden">
              <div className="absolute inset-0 opacity-30 text-[80px] flex items-center justify-center select-none">🗺️</div>
              <button className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-1.5">
                <MapPin size={12} /> Ampliar Mapa
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
