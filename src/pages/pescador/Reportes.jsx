import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Fish,
  Package,
  Star,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';

// ── Mock data ─────────────────────────────────────────────────────────────────
const VENTAS_MES = [
  { mes: 'Feb', valor: 2800 },
  { mes: 'Mar', valor: 3200 },
  { mes: 'Abr', valor: 2650 },
  { mes: 'May', valor: 3900 },
  { mes: 'Jun', valor: 3400 },
  { mes: 'Jul', valor: 4250 },
];

const TOP_ESPECIES = [
  { nombre: 'Atún Aleta Azul',          kg: 320, ingresos: 27360, pct: 100 },
  { nombre: 'Huachinango del Pacífico', kg: 210, ingresos: 6720,  pct: 73 },
  { nombre: 'Langostino Jumbo',         kg: 145, ingresos: 6960,  pct: 52 },
  { nombre: 'Corvina',                  kg: 98,  ingresos: 1372,  pct: 34 },
  { nombre: 'Mero',                     kg: 70,  ingresos: 1540,  pct: 25 },
];

const COMPRADORES = [
  { nombre: 'Restaurante El Cebiche',  monto: 'S/ 8,450', pedidos: 12, rating: 5.0 },
  { nombre: 'Supermercados VíVA',      monto: 'S/ 6,200', pedidos: 8,  rating: 4.8 },
  { nombre: 'Hotel Costa Azul',        monto: 'S/ 4,100', pedidos: 6,  rating: 4.9 },
  { nombre: 'Distribuidor PescaNorte', monto: 'S/ 3,800', pedidos: 15, rating: 4.6 },
];

const PERIODOS = ['Esta semana', 'Este mes', 'Último trimestre', 'Este año'];

// ── Bar Chart simple (CSS) ───────────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.valor));
  return (
    <div className="flex items-end gap-3 h-40 w-full pt-2">
      {data.map((d) => {
        const pct = (d.valor / max) * 100;
        const isLast = d === data[data.length - 1];
        return (
          <div key={d.mes} className="flex-1 flex flex-col items-center gap-1.5">
            <span className={`text-[10px] font-bold ${isLast ? 'text-sky-600' : 'text-slate-400'}`}>
              S/{(d.valor / 1000).toFixed(1)}k
            </span>
            <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${pct}%` }}>
              <div
                className={`absolute inset-0 rounded-t-lg transition-all ${isLast ? 'bg-sky-500' : 'bg-slate-200 hover:bg-slate-300'}`}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">{d.mes}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Horizontal bar ───────────────────────────────────────────────────────────
function HBar({ label, kg, ingresos, pct }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 truncate max-w-[160px]">{label}</span>
        <div className="flex items-center gap-3 flex-shrink-0 text-slate-500">
          <span>{kg} kg</span>
          <span className="font-bold text-slate-900">S/ {ingresos.toLocaleString()}</span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Reportes() {
  const [periodo, setPeriodo] = useState('Este mes');

  const totalVentas    = VENTAS_MES.reduce((a, b) => a + b.valor, 0);
  const totalKg        = TOP_ESPECIES.reduce((a, b) => a + b.kg, 0);
  const totalOfertas   = 23;
  const calificacion   = 4.9;

  return (
    <DashboardLayout>
      <div className="max-w-screen-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Reportes</h1>
            <p className="text-sm text-slate-500">Análisis de tu actividad pesquera y comercial.</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filtro de período */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              {PERIODOS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    periodo === p ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
              <Download size={14} /> Exportar
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Ingresos Totales"  value={`S/ ${totalVentas.toLocaleString()}`} sub="↑ +25% vs mes anterior" subColor="text-emerald-500" icon={DollarSign}  iconBg="bg-emerald-50"  iconColor="text-emerald-500" />
          <StatCard label="KG Comercializados" value={`${totalKg} kg`}                      sub="↑ +18% vs mes anterior" subColor="text-sky-500"     icon={Fish}        iconBg="bg-sky-50"     iconColor="text-sky-500" />
          <StatCard label="Ofertas Publicadas"  value={String(totalOfertas)}                 sub="En los últimos 30 días" subColor="text-slate-500"   icon={Package}     iconBg="bg-slate-100"  iconColor="text-slate-500" />
          <StatCard label="Calificación Prom."  value={`${calificacion} ★`}                 sub="Basado en 47 reseñas"   subColor="text-yellow-500"  icon={Star}        iconBg="bg-yellow-50"  iconColor="text-yellow-500" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Ventas por mes */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Ingresos por Mes</h2>
                <p className="text-xs text-slate-400 mt-0.5">Últimos 6 meses</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                <TrendingUp size={13} /> +25% este mes
              </div>
            </div>
            <BarChart data={VENTAS_MES} />
          </div>

          {/* Resumen rápido */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-900">Resumen del Período</h2>
            {[
              { label: 'Mayor venta del mes',       value: 'S/ 1,200',           sub: 'Atún Aleta Azul — 12 kg', up: true },
              { label: 'Especie más demandada',      value: 'Huachinango',        sub: '210 kg vendidos',         up: true },
              { label: 'Comprador más frecuente',    value: 'Rest. El Cebiche',   sub: '12 pedidos este mes',     up: true },
              { label: 'Oferta con menos rotación',  value: 'Langostino #003',    sub: 'Solo 45% vendido',        up: false },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${item.up ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  {item.up
                    ? <TrendingUp  size={13} className="text-emerald-500" />
                    : <TrendingDown size={13} className="text-red-400" />
                  }
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{item.value}</p>
                  <p className="text-[11px] text-slate-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Grid: Especies + Top compradores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top especies */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-5">Top Especies por Ingresos</h2>
            <div className="space-y-4">
              {TOP_ESPECIES.map((e) => (
                <HBar key={e.nombre} label={e.nombre} kg={e.kg} ingresos={e.ingresos} pct={e.pct} />
              ))}
            </div>
          </div>

          {/* Top compradores */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-5">Top Compradores</h2>
            <div className="space-y-3">
              {COMPRADORES.map((c, i) => (
                <div key={c.nombre} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.nombre}</p>
                    <p className="text-xs text-slate-400">{c.pedidos} pedidos · ★ {c.rating}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900">{c.monto}</p>
                    <button className="text-[10px] text-sky-600 font-semibold flex items-center gap-0.5 ml-auto hover:text-sky-700">
                      Ver <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
