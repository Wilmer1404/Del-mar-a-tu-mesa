import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Eye, Download, CheckCircle2, Clock, XCircle, Truck, ChevronLeft, ChevronRight, Package, DollarSign } from 'lucide-react';
import { CompradorLayout } from '../../layouts/CompradorLayout';


const ESTADOS = {
  entregado: { label: 'Entregado',  icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  en_camino: { label: 'En Camino',  icon: Truck,        color: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-200' },
  pendiente: { label: 'Pendiente',  icon: Clock,        color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  cancelado: { label: 'Cancelado',  icon: XCircle,      color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200' },
};

const PER_PAGE = 5;

function mapOrden(raw) {
  return {
    id: raw.id,
    producto: raw.producto_nombre,
    proveedor: raw.proveedor_nombre,
    fecha: raw.fecha_orden ? raw.fecha_orden.slice(0, 10) : '',
    cantidad: String(raw.cantidad ?? ''),
    total: Number(raw.total) || 0,
    estado: raw.estado,
  };
}

function EstadoBadge({ estado }) {
  const cfg = ESTADOS[estado] ?? ESTADOS.pendiente;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <Icon size={11}/> {cfg.label}
    </span>
  );
}

export default function CompradorCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [page, setPage]     = useState(1);

  useEffect(() => {
    const MOCK = [
      { id: 'OC-2026-001', producto: 'Huachinango del Pacífico 45kg',  proveedor: 'Cap. Arturo Prat',   fecha: '2026-07-03', cantidad: '45 kg',  total: 1440.00, estado: 'entregado' },
      { id: 'OC-2026-002', producto: 'Langostino Jumbo 12kg',           proveedor: 'Juan Flores B.',     fecha: '2026-07-01', cantidad: '12 kg',  total: 576.00,  estado: 'en_camino' },
      { id: 'OC-2026-003', producto: 'Corvina fresca 30kg',             proveedor: 'Carlos Mend.',       fecha: '2026-06-28', cantidad: '30 kg',  total: 420.00,  estado: 'entregado' },
      { id: 'OC-2026-004', producto: 'Atún Aleta Azul 20kg',           proveedor: 'Cap. Arturo Prat',   fecha: '2026-06-20', cantidad: '20 kg',  total: 1710.00, estado: 'pendiente' },
    ];
    const t = setTimeout(() => { setOrdenes(MOCK); setLoading(false); }, 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = ordenes.filter(c => {
    const m = c.producto.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.proveedor.toLowerCase().includes(search.toLowerCase());
    const e = filtro === 'todos' || c.estado === filtro;
    return m && e;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalGastado = ordenes.reduce((a,c) => a+c.total, 0);

  if (loading) {
    return (
      <CompradorLayout>
        <div className="max-w-screen-xl mx-auto space-y-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          </div>
        </div>
      </CompradorLayout>
    );
  }

  if (error) {
    return (
      <CompradorLayout>
        <div className="max-w-screen-xl mx-auto space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-semibold">Error al cargar las órdenes</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        </div>
      </CompradorLayout>
    );
  }

  return (
    <CompradorLayout>
      <div className="max-w-screen-xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Mis Compras</h1>
          <p className="text-sm text-slate-500">Historial de productos comprados a pescadores.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Gastado',      value: `S/ ${totalGastado.toLocaleString('es-PE',{minimumFractionDigits:2})}`, icon: DollarSign,   bg: 'bg-red-50',     ic: 'text-red-500' },
            { label: 'Órdenes Totales',    value: ordenes.length,                                                         icon: Package,      bg: 'bg-slate-100',  ic: 'text-slate-500' },
            { label: 'Completadas',        value: ordenes.filter(c => c.estado === 'entregado').length,                    icon: CheckCircle2, bg: 'bg-emerald-50', ic: 'text-emerald-500' },
            { label: 'En Camino',          value: ordenes.filter(c => c.estado === 'en_camino').length,                    icon: Truck,        bg: 'bg-sky-50',     ic: 'text-sky-500' },
          ].map(({label, value, icon: Icon, bg, ic}) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
              <div className={`${bg} p-2.5 rounded-xl`}><Icon size={18} className={ic}/></div>
              <div>
                <p className="text-xl font-extrabold text-slate-900 leading-none">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><ShoppingBag size={16} className="text-emerald-500"/> Historial de Compras</h2>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Search size={14} className="text-slate-400"/>
                <input type="text" placeholder="Buscar…" value={search} onChange={e => {setSearch(e.target.value); setPage(1);}} className="bg-transparent text-sm text-slate-700 outline-none w-32"/>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Filter size={14} className="text-slate-400"/>
                <select value={filtro} onChange={e => {setFiltro(e.target.value); setPage(1);}} className="bg-transparent text-sm text-slate-700 outline-none">
                  <option value="todos">Todos</option>
                  <option value="entregado">Entregados</option>
                  <option value="en_camino">En Camino</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="cancelado">Cancelados</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>{['Orden','Producto','Proveedor','Fecha','Cantidad','Total','Estado','Acciones'].map(h => (
                  <th key={h} className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {paginated.length === 0
                  ? <tr><td colSpan={8} className="py-16 text-center text-slate-400 text-sm">Sin resultados.</td></tr>
                  : paginated.map(c => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4"><span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">{c.id}</span></td>
                    <td className="py-3.5 px-4"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><Package size={14} className="text-emerald-500"/></div><p className="text-sm font-semibold text-slate-800 max-w-[150px] truncate">{c.producto}</p></div></td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">{c.proveedor}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">{c.fecha}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">{c.cantidad}</td>
                    <td className="py-3.5 px-4 text-sm font-bold text-slate-900 whitespace-nowrap">S/ {c.total.toFixed(2)}</td>
                    <td className="py-3.5 px-4"><EstadoBadge estado={c.estado}/></td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"><Eye size={13}/></button>
                        <button className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-100 hover:text-sky-600 transition-colors"><Download size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">Mostrando {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} de {filtered.length}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={15}/></button>
                {Array.from({length: totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-xl text-sm font-bold transition-colors ${p===page?'bg-slate-900 text-white':'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{p}</button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronRight size={15}/></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CompradorLayout>
  );
}
