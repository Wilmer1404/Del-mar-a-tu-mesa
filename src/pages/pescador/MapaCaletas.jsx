import { useState, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Anchor,
  Wind,
  Thermometer,
  Waves,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  RefreshCw,
  Info,
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

// Fix para los íconos de Leaflet con Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── Íconos personalizados ─────────────────────────────────────────────────────
const makeIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;border-radius:50% 50% 50% 0;
    background:${color};border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.35);
    transform:rotate(-45deg);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

const ICONS = {
  abierto:  makeIcon('#10b981'),
  cerrado:  makeIcon('#ef4444'),
  alerta:   makeIcon('#f59e0b'),
};

// ── Datos de caletas de Piura ─────────────────────────────────────────────────
const CALETAS = [
  {
    id: 1,
    nombre: 'Parachique',
    distrito: 'Sechura',
    coords: [-5.5742, -80.8701],
    estado: 'abierto',
    pescadores: 340,
    embarcaciones: 87,
    viento: '12 km/h NO',
    temp_mar: '22°C',
    oleaje: '0.8 m',
    precios: [
      { especie: 'Caballa',    precio: 'S/ 2.50/kg', tendencia: 'up' },
      { especie: 'Merluza',    precio: 'S/ 8.00/kg', tendencia: 'up' },
      { especie: 'Pota',       precio: 'S/ 1.80/kg', tendencia: 'down' },
    ],
    descripcion: 'Principal caleta de Sechura. Alta actividad de pesca pelágica, anchoveta y merluza.',
    color: '#10b981',
  },
  {
    id: 2,
    nombre: 'Bayóvar',
    distrito: 'Sechura',
    coords: [-5.7983, -81.0326],
    estado: 'abierto',
    pescadores: 120,
    embarcaciones: 34,
    viento: '8 km/h O',
    temp_mar: '21°C',
    oleaje: '0.6 m',
    precios: [
      { especie: 'Langostino', precio: 'S/ 45.00/kg', tendencia: 'up' },
      { especie: 'Lisa',       precio: 'S/ 5.00/kg',  tendencia: 'up' },
    ],
    descripcion: 'Zona pesquera artesanal cercana al terminal portuario. Especializada en mariscos.',
    color: '#10b981',
  },
  {
    id: 3,
    nombre: 'Yacila',
    distrito: 'Paita',
    coords: [-4.9800, -81.1100],
    estado: 'abierto',
    pescadores: 210,
    embarcaciones: 62,
    viento: '14 km/h NO',
    temp_mar: '23°C',
    oleaje: '1.0 m',
    precios: [
      { especie: 'Pargo',       precio: 'S/ 18.00/kg', tendencia: 'up' },
      { especie: 'Ojo de Uva',  precio: 'S/ 12.00/kg', tendencia: 'down' },
      { especie: 'Atún',        precio: 'S/ 85.00/kg', tendencia: 'up' },
    ],
    descripcion: 'Caleta pintoresca de Paita. Alta valoración por pargo y especies de fondo.',
    color: '#10b981',
  },
  {
    id: 4,
    nombre: 'Puerto Paita',
    distrito: 'Paita',
    coords: [-5.0900, -81.1140],
    estado: 'abierto',
    pescadores: 680,
    embarcaciones: 195,
    viento: '10 km/h O',
    temp_mar: '22°C',
    oleaje: '0.9 m',
    precios: [
      { especie: 'Caballa',    precio: 'S/ 3.00/kg',  tendencia: 'up' },
      { especie: 'Jurel',      precio: 'S/ 4.50/kg',  tendencia: 'down' },
      { especie: 'Anchoveta',  precio: 'S/ 0.85/kg',  tendencia: 'down' },
    ],
    descripcion: 'Puerto principal del norte de Perú. Mayor volumen de desembarque de la región Piura.',
    color: '#10b981',
  },
  {
    id: 5,
    nombre: 'El Ñuro',
    distrito: 'Talara',
    coords: [-4.5150, -81.2420],
    estado: 'abierto',
    pescadores: 95,
    embarcaciones: 28,
    viento: '9 km/h SO',
    temp_mar: '24°C',
    oleaje: '0.5 m',
    precios: [
      { especie: 'Tortuga (avistamiento)', precio: '— / Zona protegida', tendencia: 'down' },
      { especie: 'Pargo',       precio: 'S/ 20.00/kg', tendencia: 'up' },
      { especie: 'Mero',        precio: 'S/ 22.00/kg', tendencia: 'up' },
    ],
    descripcion: 'Famosa por avistamiento de tortugas. Pesca artesanal de alto valor por especie selectiva.',
    color: '#10b981',
  },
  {
    id: 6,
    nombre: 'Los Órganos',
    distrito: 'Talara',
    coords: [-4.1763, -81.1245],
    estado: 'alerta',
    pescadores: 145,
    embarcaciones: 41,
    viento: '22 km/h NO',
    temp_mar: '22°C',
    oleaje: '1.8 m',
    precios: [
      { especie: 'Corvina',    precio: 'S/ 14.00/kg', tendencia: 'up' },
      { especie: 'Lenguado',   precio: 'S/ 30.00/kg', tendencia: 'up' },
    ],
    descripcion: 'Alerta por oleaje moderado-alto. Salida recomendada solo para embarcaciones mayores.',
    color: '#f59e0b',
  },
  {
    id: 7,
    nombre: 'Máncora',
    distrito: 'Talara',
    coords: [-4.1058, -81.0453],
    estado: 'cerrado',
    pescadores: 0,
    embarcaciones: 0,
    viento: '28 km/h N',
    temp_mar: '23°C',
    oleaje: '2.5 m',
    precios: [],
    descripcion: 'Puerto cerrado preventivamente por marejadas. IMARPE recomienda no salir a pescar.',
    color: '#ef4444',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const ESTADO_CFG = {
  abierto: { label: 'Muelle Libre',   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-400', Icon: CheckCircle2 },
  alerta:  { label: 'Oleaje Moderado',color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-400',   Icon: AlertTriangle },
  cerrado: { label: 'Puerto Cerrado', color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     dot: 'bg-red-400',     Icon: Clock },
};

function EstadoPill({ estado }) {
  const cfg = ESTADO_CFG[estado];
  if (!cfg) return null;
  const Icon = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

// ── Caleta Detail Sidebar ─────────────────────────────────────────────────────
function CaletaDetail({ caleta }) {
  const cfg = ESTADO_CFG[caleta.estado];
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className={`p-5 border-b ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-tight">{caleta.nombre}</h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin size={11} /> {caleta.distrito}, Piura
            </p>
          </div>
          <EstadoPill estado={caleta.estado} />
        </div>
      </div>

      <div className="p-5 space-y-5 flex-1">
        {/* Descripción */}
        <p className="text-xs text-slate-600 leading-relaxed">{caleta.descripcion}</p>

        {/* Condiciones del mar */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Condiciones del Mar</h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Wind,        label: 'Viento',   value: caleta.viento },
              { icon: Thermometer, label: 'Temp. Mar', value: caleta.temp_mar },
              { icon: Waves,       label: 'Oleaje',   value: caleta.oleaje },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <Icon size={16} className="text-sky-500 mx-auto mb-1" />
                <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <Users size={16} className="text-sky-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400">Pescadores</p>
            <p className="text-base font-extrabold text-slate-900">{caleta.pescadores}</p>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <Anchor size={16} className="text-sky-500 mx-auto mb-1" />
            <p className="text-[10px] text-slate-400">Embarcaciones</p>
            <p className="text-base font-extrabold text-slate-900">{caleta.embarcaciones}</p>
          </div>
        </div>

        {/* Precios de hoy */}
        {caleta.precios.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Precios de Hoy</h4>
            <div className="space-y-2">
              {caleta.precios.map((p) => (
                <div key={p.especie} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🐟</span>
                    <span className="text-xs font-semibold text-slate-700">{p.especie}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{p.precio}</span>
                    {p.tendencia === 'up'
                      ? <TrendingUp  size={12} className="text-emerald-500" />
                      : <TrendingDown size={12} className="text-red-400" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {caleta.estado === 'cerrado' && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 font-medium">No hay actividad reportada. Puerto cerrado por condiciones climáticas adversas.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Leyenda del mapa ─────────────────────────────────────────────────────────
function LeyendaMapa() {
  return (
    <div className="absolute bottom-4 left-4 z-[999] bg-white/95 backdrop-blur rounded-xl border border-slate-200 shadow-lg p-3 space-y-1.5">
      {Object.entries(ESTADO_CFG).map(([key, cfg]) => (
        <div key={key} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MapaCaletas() {
  const [selected, setSelected] = useState(CALETAS[0]);
  const [lastUpdate] = useState(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }));

  const CENTER = [-5.0, -80.9]; // Centrado en la región Piura

  return (
    <DashboardLayout>
      <div className="max-w-screen-xl mx-auto space-y-4 h-full">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Mapa de Caletas</h1>
            <p className="text-sm text-slate-500">Piura, Perú — Condiciones en tiempo real</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <RefreshCw size={13} className="text-sky-500" />
            Actualizado: {lastUpdate}
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Muelles Libres',  value: CALETAS.filter(c => c.estado === 'abierto').length,  dot: 'bg-emerald-400' },
            { label: 'En Alerta',       value: CALETAS.filter(c => c.estado === 'alerta').length,   dot: 'bg-amber-400' },
            { label: 'Puertos Cerrados',value: CALETAS.filter(c => c.estado === 'cerrado').length,  dot: 'bg-red-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${s.dot}`} />
              <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: '520px' }}>

          {/* Mapa */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <MapContainer
              center={CENTER}
              zoom={9}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {CALETAS.map((caleta) => (
                <Fragment key={caleta.id}>
                  {/* Círculo de radio */}
                  <Circle
                    center={caleta.coords}
                    radius={8000}
                    pathOptions={{
                      color: caleta.color,
                      fillColor: caleta.color,
                      fillOpacity: 0.1,
                      weight: 1.5,
                    }}
                  />
                  {/* Marcador */}
                  <Marker
                    position={caleta.coords}
                    icon={ICONS[caleta.estado]}
                    eventHandlers={{ click: () => setSelected(caleta) }}
                  >
                    <Popup>
                      <div className="text-xs font-semibold p-1">
                        <p className="font-bold text-sm">{caleta.nombre}</p>
                        <p className="text-slate-500">{caleta.distrito}</p>
                        <p className="mt-1">{ESTADO_CFG[caleta.estado].label}</p>
                      </div>
                    </Popup>
                  </Marker>
                </Fragment>
              ))}
            </MapContainer>
            <LeyendaMapa />
          </div>

          {/* Sidebar detalle de caleta */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            {/* Caleta list tabs */}
            <div className="border-b border-slate-100 p-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Caletas de Piura</p>
              <div className="flex flex-wrap gap-1.5">
                {CALETAS.map((c) => {
                  const cfg = ESTADO_CFG[c.estado];
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        selected?.id === c.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {c.nombre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalle */}
            {selected ? (
              <CaletaDetail caleta={selected} onClose={() => setSelected(null)} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <Info size={32} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">Haz clic en un marcador del mapa para ver los detalles de la caleta.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
