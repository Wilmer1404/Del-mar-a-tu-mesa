import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  Package,
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';

// ── Mock data ─────────────────────────────────────────────────────────────────
const COMPRAS = [
  { id: 'OC-2026-001', producto: 'Redes de Cerco Reforzadas', proveedor: 'Insumos Marinos SAC', fecha: '2026-07-01', cantidad: '2 unid.', total: 8840.00, estado: 'entregado' },
  { id: 'OC-2026-002', producto: 'Combustible Diesel B5',     proveedor: 'Petromar Perú',       fecha: '2026-07-02', cantidad: '200 gl.',  total: 3300.00, estado: 'en_camino' },
  { id: 'OC-2026-003', producto: 'Hielo en Escamas (500 kg)', proveedor: 'FríoMar Piura',       fecha: '2026-06-28', cantidad: '500 kg',   total: 750.00,  estado: 'entregado' },
  { id: 'OC-2026-004', producto: 'Anzuelos Palangre #6',      proveedor: 'TacklePerú',          fecha: '2026-06-25', cantidad: '1000 u.',  total: 420.00,  estado: 'pendiente' },
  { id: 'OC-2026-005', producto: 'Mantenimiento de Casco',    proveedor: 'Astillero El Chaco',  fecha: '2026-06-20', cantidad: '1 serv.',  total: 2800.00, estado: 'entregado' },
  { id: 'OC-2026-006', producto: 'Motor Yamaha 40HP (repuesto)', proveedor: 'MotoMar Piura',   fecha: '2026-06-15', cantidad: '1 pieza',  total: 5600.00, estado: 'cancelado' },
  { id: 'OC-2026-007', producto: 'GPS Garmin GPSMAP 78SC',   proveedor: 'TechPesca',           fecha: '2026-06-10', cantidad: '1 unid.',  total: 980.00,  estado: 'entregado' },
  { id: 'OC-2026-008', producto: 'Botas de PVC impermeables', proveedor: 'SafeMar Equipos',    fecha: '2026-06-08', cantidad: '3 pares',  total: 270.00,  estado: 'entregado' },
];

const ESTADOS = {
  entregado:  { label: 'Entregado',   icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  en_camino:  { label: 'En Camino',   icon: Truck,        color: 'text-sky-600',     bg: 'bg-sky-50',      border: 'border-sky-200' },
  pendiente:  { label: 'Pendiente',   icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200' },
  cancelado:  { label: 'Cancelado',   icon: XCircle,      color: 'text-red-500',     bg: 'bg-red-50',      border: 'border-red-200' },
};

const PER_PAGE = 5;

// ── Estado Badge ─────────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const cfg = ESTADOS[estado] || ESTADOS.pendiente;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MisCompras() {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [page, setPage] = useState(1);

  const filtered = COMPRAS.filter((c) => {
    const matchSearch =
      c.producto.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.proveedor.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalGastado = COMPRAS.reduce((acc, c) => acc + c.total, 0);
  const entregadas = COMPRAS.filter((c) => c.estado === 'entregado').length;
  const enCamino   = COMPRAS.filter((c) => c.estado === 'en_camino').length;

  return (
    <DashboardLayout>
      <div className="max-w-screen-xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Mis Compras</h1>
          <p className="text-sm text-slate-500 mt-0.5">Historial completo de insumos y equipos adquiridos.</p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Gastado (MES)"  value={`S/ ${totalGastado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} sub="↓ -8% vs mes anterior" subColor="text-emerald-500" icon={DollarSign} iconBg="bg-red-50"     iconColor="text-red-500" />
          <StatCard label="Órdenes Totales"       value={String(COMPRAS.length)}                 sub="Este mes"               subColor="text-slate-500"   icon={Package}    iconBg="bg-slate-100"  iconColor="text-slate-500" />
          <StatCard label="Entregas Completadas"  value={String(entregadas)}                      sub="Sin incidentes"         subColor="text-emerald-500" icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-500" />
          <StatCard label="En Camino"             value={String(enCamino)}                        sub="Próximas 48 hrs"        subColor="text-sky-500"    icon={Truck}      iconBg="bg-sky-50"    iconColor="text-sky-500" />
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={16} className="text-sky-500" /> Historial de Órdenes
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar orden, producto..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-40"
                />
              </div>
              {/* Filter */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); setPage(1); }}
                  className="bg-transparent text-sm text-slate-700 outline-none"
                >
                  <option value="todos">Todos</option>
                  <option value="entregado">Entregados</option>
                  <option value="en_camino">En Camino</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="cancelado">Cancelados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr className="text-left">
                  {['Orden', 'Producto', 'Proveedor', 'Fecha', 'Cantidad', 'Total', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 text-sm">
                      No se encontraron órdenes con ese filtro.
                    </td>
                  </tr>
                ) : paginated.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">{c.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                          <Package size={14} className="text-sky-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800 max-w-[180px] truncate">{c.producto}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">{c.proveedor}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">{c.fecha}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">{c.cantidad}</td>
                    <td className="py-3.5 px-4 text-sm font-bold text-slate-900 whitespace-nowrap">
                      S/ {c.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4"><EstadoBadge estado={c.estado} /></td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button title="Ver detalle" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-100 hover:text-sky-600 transition-colors">
                          <Eye size={13} />
                        </button>
                        <button title="Descargar factura" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length} órdenes
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-xl text-sm font-bold transition-colors ${
                      p === page
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
