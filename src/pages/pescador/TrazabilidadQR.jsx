import { useState, useEffect } from 'react';
import {
  QrCode,
  Plus,
  Search,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  XCircle,
  BadgeCheck,
  Copy,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';


const ESTADO_CFG = {
  certificado: { label: 'Certificado', color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', Icon: BadgeCheck },
  verificado:  { label: 'Verificado',  color: 'text-sky-700',     bg: 'bg-sky-50',      border: 'border-sky-200',     Icon: CheckCircle2 },
  pendiente:   { label: 'Pendiente',   color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   Icon: Clock },
  expirado:    { label: 'Expirado',    color: 'text-red-600',     bg: 'bg-red-50',      border: 'border-red-200',     Icon: XCircle },
};

function mapLote(raw) {
  return {
    id: raw.id,
    especie: raw.especie,
    caleta: raw.caleta,
    fecha: raw.fecha_captura,
    peso: `${raw.peso_kg} kg`,
    precio: `S/ ${raw.precio_kg}/kg`,
    estado: raw.estado,
    metodo: raw.metodo_pesca,
  };
}

const MOCK_LOTES = [
  { id: 'LT-20260701-001', especie: 'Huachinango del Pacífico', caleta: 'Parachique',    fecha: '2026-07-01', peso: '45.5 kg', precio: 'S/ 32.00/kg', estado: 'certificado', metodo: 'Artesanal Espinel' },
  { id: 'LT-20260702-002', especie: 'Atún Aleta Azul',          caleta: 'Yacila',        fecha: '2026-07-02', peso: '28.0 kg', precio: 'S/ 85.50/kg', estado: 'verificado',  metodo: 'Palangre' },
  { id: 'LT-20260628-003', especie: 'Langostino Jumbo',          caleta: 'Bayóvar',      fecha: '2026-06-28', peso: '12.5 kg', precio: 'S/ 48.00/kg', estado: 'pendiente',   metodo: 'Trampa' },
  { id: 'LT-20260620-004', especie: 'Corvina',                   caleta: 'Puerto Paita', fecha: '2026-06-20', peso: '60.0 kg', precio: 'S/ 14.00/kg', estado: 'expirado',    metodo: 'Artesanal Red' },
];

// ── Estado Badge ──────────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const cfg = ESTADO_CFG[estado];
  if (!cfg) return null;
  const Icon = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

// ── Código de Trazabilidad Block ─────────────────────────────────────────────
function CodigoTrazabilidad({ id, size = 'md' }) {
  const dim = size === 'sm' ? 64 : size === 'lg' ? 160 : 100;
  return (
    <div
      className="bg-slate-900 p-2 rounded-lg flex-shrink-0 flex flex-col items-center justify-center gap-1"
      style={{ width: dim, height: dim }}
    >
      <QrCode size={size === 'sm' ? 18 : 28} className="text-sky-400" />
      <span className={`${size === 'sm' ? 'text-[6px]' : 'text-[8px]'} text-slate-300 font-mono text-center leading-tight`}>
        {id}
      </span>
    </div>
  );
}

// ── Lote Detail Modal ─────────────────────────────────────────────────────────
function LoteDetailPanel({ lote, onClose }) {
  const [copied, setCopied] = useState(false);
  const copyId = () => {
    navigator.clipboard?.writeText(lote.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-sky-400" />
              <span className="text-sm font-bold">Trazabilidad QR</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">×</button>
          </div>
          <div className="flex items-center gap-5">
            <CodigoTrazabilidad id={lote.id} size="lg" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Código de Trazabilidad</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-bold text-base">{lote.id}</p>
                <button onClick={copyId} title="Copiar ID" className="text-slate-400 hover:text-sky-400 transition-colors">
                  {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="mt-3">
                <EstadoBadge estado={lote.estado} />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          {[
            { label: 'Especie',          value: lote.especie },
            { label: 'Caleta de Origen', value: lote.caleta },
            { label: 'Fecha de Captura', value: lote.fecha },
            { label: 'Peso Total',       value: lote.peso },
            { label: 'Precio por KG',    value: lote.precio },
            { label: 'Método de Pesca',  value: lote.metodo },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500 font-medium">{label}</span>
              <span className="font-semibold text-slate-900">{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors">
            <Printer size={15} /> Imprimir
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            <Share2 size={15} /> Compartir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TrazabilidadQR() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setLotes(MOCK_LOTES);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = lotes.filter(
    (l) =>
      l.especie.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.caleta.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      {selected && <LoteDetailPanel lote={selected} onClose={() => setSelected(null)} />}

      <div className="max-w-screen-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Trazabilidad QR</h1>
            <p className="text-sm text-slate-500">Etiquetas de autenticidad para cada lote de captura.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors self-start sm:self-auto">
            <Plus size={16} /> Generar Nuevo QR
          </button>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Lotes',    value: lotes.length,                                          color: 'text-slate-900', bg: 'bg-white' },
            { label: 'Certificados',   value: lotes.filter(l => l.estado === 'certificado').length,  color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Verificados',    value: lotes.filter(l => l.estado === 'verificado').length,   color: 'text-sky-700',    bg: 'bg-sky-50' },
            { label: 'Pendientes',     value: lotes.filter(l => l.estado === 'pendiente').length,    color: 'text-amber-700',  bg: 'bg-amber-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-slate-100 shadow-sm p-5`}>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por especie, caleta o Batch ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
            />
          </div>

          <div className="divide-y divide-slate-50">
            {loading ? (
              <p className="text-center text-slate-400 text-sm py-16">Cargando lotes…</p>
            ) : error ? (
              <p className="text-center text-red-500 text-sm py-16">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-16">No se encontraron lotes.</p>
            ) : filtered.map((lote) => (
              <div
                key={lote.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                onClick={() => setSelected(lote)}
              >
                <CodigoTrazabilidad id={lote.id} size="sm" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{lote.especie}</p>
                    <EstadoBadge estado={lote.estado} />
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    📍 {lote.caleta} · 📅 {lote.fecha} · ⚖️ {lote.peso}
                  </p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">{lote.id}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-100 hover:text-sky-600 transition-colors"
                    title="Descargar"
                  >
                    <Download size={14} />
                  </button>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
