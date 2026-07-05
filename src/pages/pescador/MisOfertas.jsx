import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Package,
  DollarSign,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const mapOferta = (item) => ({
  id: item.id,
  especie: item.especie,
  caleta: item.caleta,
  fecha: item.fecha_publicacion?.split('T')[0] ?? item.fecha_publicacion,
  vencimiento: item.fecha_vencimiento?.split('T')[0] ?? item.fecha_vencimiento,
  pesoCapturo: Number(item.peso_capturado_kg) || 0,
  pesoDisponible: Number(item.peso_disponible_kg) || 0,
  precioPorKg: Number(item.precio_por_kg) || 0,
  estado: item.estado,
  visitas: item.visitas ?? 0,
  reservas: item.reservas ?? 0,
  destacado: !!item.destacado,
  emoji: '\u{1F41F}',
  metodo: 'Artesanal',
});

// ── Estado config ─────────────────────────────────────────────────────────────
const ESTADO_CFG = {
  publicado: { label: 'Publicado',  Icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  pendiente: { label: 'Pendiente',  Icon: Clock,        color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  vendido:   { label: 'Vendido',    Icon: ShoppingCart, color: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-200' },
  expirado:  { label: 'Expirado',   Icon: XCircle,      color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200' },
  revisión:  { label: 'En Revisión',Icon: AlertCircle,  color: 'text-purple-700',  bg: 'bg-purple-50',  border: 'border-purple-200' },
};

// ── Components ────────────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const cfg = ESTADO_CFG[estado] ?? ESTADO_CFG.pendiente;
  const { Icon } = cfg;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

function ProgressBar({ value, max, color = 'bg-sky-500' }) {
  const pct = max > 0 ? Math.round(((max - value) / max) * 100) : 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

function OfertaCard({ oferta, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalVenta = (oferta.pesoCapturo - oferta.pesoDisponible) * oferta.precioPorKg;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
      oferta.destacado ? 'border-sky-200 ring-1 ring-sky-200' : 'border-slate-100'
    }`}>
      {oferta.destacado && (
        <div className="bg-sky-500 text-white text-[10px] font-bold text-center py-1 tracking-widest uppercase">
          ⭐ Oferta Destacada
        </div>
      )}

      <div className="p-5">
        {/* Row 1: Species + Estado + Menu */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
              {oferta.emoji}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{oferta.especie}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">📍 {oferta.caleta} · {oferta.metodo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <EstadoBadge estado={oferta.estado} />
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <MoreVertical size={15} />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-9 z-20 bg-white border border-slate-100 rounded-xl shadow-xl py-1 w-40"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    <Eye size={14} /> Ver detalle
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    <Pencil size={14} /> Editar oferta
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(oferta.id); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Peso Total',      value: `${oferta.pesoCapturo} kg` },
            { label: 'Precio/KG',       value: `S/ ${oferta.precioPorKg.toFixed(2)}` },
            { label: 'Ingresos',        value: `S/ ${totalVenta.toFixed(0)}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium">{label}</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5 leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Row 3: Stock bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span>Stock disponible: <strong className="text-slate-900">{oferta.pesoDisponible} kg</strong></span>
            <span>{oferta.pesoCapturo - oferta.pesoDisponible} kg vendidos</span>
          </div>
          <ProgressBar
            value={oferta.pesoDisponible}
            max={oferta.pesoCapturo}
            color={oferta.estado === 'vendido' ? 'bg-sky-500' : oferta.estado === 'expirado' ? 'bg-red-400' : 'bg-emerald-500'}
          />
        </div>

        {/* Row 4: Meta info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 pt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye size={11} /> {oferta.visitas} visitas</span>
            <span className="flex items-center gap-1"><ShoppingCart size={11} /> {oferta.reservas} reservas</span>
          </div>
          <span>Vence: <strong className="text-slate-600">{oferta.vencimiento}</strong></span>
        </div>
      </div>
    </div>
  );
}

function SortBtn({ label, sortKey, sortBy, sortAsc, onToggle }) {
  return (
    <button
      onClick={() => onToggle(sortKey)}
      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
        sortBy === sortKey ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label} {sortBy === sortKey ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MisOfertas() {
  const [search, setSearch]           = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [sortBy, setSortBy]           = useState('fecha');
  const [sortAsc, setSortAsc]         = useState(false);
  const [ofertas, setOfertas]         = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState(null);

  useAuth();

  useEffect(() => {
    let cancel = false;
    setCargando(true);
    setError(null);

    api.get('/ofertas')
      .then((res) => {
        if (cancel) return;
        const items = Array.isArray(res.data) ? res.data : [];
        setOfertas(items.map(mapOferta));
      })
      .catch((err) => {
        if (cancel) return;
        setError(err.message || 'Error al cargar ofertas');
      })
      .finally(() => {
        if (!cancel) setCargando(false);
      });

    return () => { cancel = true; };
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ofertas/${id}`);
      setOfertas((prev) => prev.filter((o) => o.id !== id));
    } catch {
      setError('Error al eliminar la oferta');
    }
  };

  const toggleSort = (key) => {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(false); }
  };

  const filtered = ofertas
    .filter((o) => {
      const matchSearch =
        o.especie.toLowerCase().includes(search.toLowerCase()) ||
        String(o.id).toLowerCase().includes(search.toLowerCase()) ||
        o.caleta.toLowerCase().includes(search.toLowerCase());
      const matchEstado = filtroEstado === 'todos' || o.estado === filtroEstado;
      return matchSearch && matchEstado;
    })
    .sort((a, b) => {
      const mult = sortAsc ? 1 : -1;
      if (sortBy === 'precio') return mult * (a.precioPorKg - b.precioPorKg);
      if (sortBy === 'peso')   return mult * (a.pesoCapturo  - b.pesoCapturo);
      return mult * (new Date(b.fecha) - new Date(a.fecha));
    });

  const totalIngresosActivos = ofertas
    .filter((o) => o.estado === 'publicado')
    .reduce((acc, o) => acc + (o.pesoCapturo - o.pesoDisponible) * o.precioPorKg, 0);

  return (
    <DashboardLayout>
      <div className="max-w-screen-xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Mis Ofertas</h1>
            <p className="text-sm text-slate-500">Gestiona tus publicaciones en el marketplace B2B.</p>
          </div>
          <Link
            to="/pescador/captura"
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors self-start sm:self-auto"
          >
            <Plus size={16} /> Nueva Oferta
          </Link>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-bold">&times;</button>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Ofertas Activas"    value={String(ofertas.filter(o => o.estado === 'publicado').length)}  sub="En el marketplace"       subColor="text-emerald-500" icon={Tag}         iconBg="bg-emerald-50"  iconColor="text-emerald-500" />
          <StatCard label="Ofertas Vendidas"   value={String(ofertas.filter(o => o.estado === 'vendido').length)}    sub="Este mes"               subColor="text-sky-500"    icon={ShoppingCart} iconBg="bg-sky-50"     iconColor="text-sky-500" />
          <StatCard label="Ingresos Activos"   value={`S/ ${totalIngresosActivos.toFixed(0)}`}                       sub="De ofertas publicadas"  subColor="text-slate-500"  icon={DollarSign}   iconBg="bg-slate-100"  iconColor="text-slate-500" />
          <StatCard label="Total Publicaciones" value={String(ofertas.length)}                                        sub="Historial completo"     subColor="text-slate-400"  icon={Package}      iconBg="bg-slate-100"  iconColor="text-slate-500" />
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex-1 max-w-sm">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar especie, caleta o ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>

          {/* Estado filter tabs */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 flex-wrap">
            {['todos', 'publicado', 'pendiente', 'revisión', 'vendido', 'expirado'].map((e) => (
              <button
                key={e}
                onClick={() => setFiltroEstado(e)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filtroEstado === e
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {e === 'todos' ? 'Todos' : ESTADO_CFG[e]?.label ?? e}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
            <SortBtn label="Fecha"  sortKey="fecha"  sortBy={sortBy} sortAsc={sortAsc} onToggle={toggleSort} />
            <SortBtn label="Precio" sortKey="precio" sortBy={sortBy} sortAsc={sortAsc} onToggle={toggleSort} />
            <SortBtn label="Peso"   sortKey="peso"   sortBy={sortBy} sortAsc={sortAsc} onToggle={toggleSort} />
          </div>
        </div>

        {/* ── Grid de tarjetas ── */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 size={32} className="text-slate-300 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-500">Cargando ofertas…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">🎣</div>
            <p className="text-sm font-semibold text-slate-600">No hay ofertas con ese filtro.</p>
            <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros o agrega una nueva oferta.</p>
            <Link
              to="/pescador/captura"
              className="mt-5 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors"
            >
              <Plus size={15} /> Nueva Oferta
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((oferta) => (
              <OfertaCard key={oferta.id} oferta={oferta} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Summary footer */}
        {!cargando && filtered.length > 0 && (
          <p className="text-xs text-slate-400 text-center">
            Mostrando {filtered.length} de {ofertas.length} ofertas
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
