import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Fish,
  MapPin,
  Weight,
  DollarSign,
  Calendar,
  Anchor,
  AlignLeft,
  Camera,
  QrCode,
  BadgeCheck,
  Lightbulb,
  Save,
  X,
  Upload,
  Clock,
} from 'lucide-react';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { SelectField } from '../../components/ui/SelectField';
import { FormField } from '../../components/ui/FormField';

const METODOS = [
  { value: '', label: 'Seleccione método...', disabled: true },
  { value: 'artesanal_espinel', label: '🎣 Artesanal (Espinel)' },
  { value: 'artesanal_red', label: '🕸️ Artesanal (Red de enmalle)' },
  { value: 'palangre', label: '⚓ Palangre' },
  { value: 'buceo', label: '🤿 Buceo' },
  { value: 'trampa', label: '📦 Trampa/Nasa' },
];

// ── Batch ID generator ────────────────────────────────────────────────────────
const BATCH_ID = `LT-${Date.now().toString().slice(-8)}-001`;

// ── File Upload Component ─────────────────────────────────────────────────────
function FileUploadArea({ preview, onFileChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileChange(file);
  }, [onFileChange]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
  };

  return (
    <label
      htmlFor="foto-producto"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-sky-400 bg-sky-50'
          : preview
          ? 'border-emerald-300 bg-emerald-50'
          : 'border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/50'
      }`}
    >
      {preview ? (
        <img
          src={preview}
          alt="Vista previa"
          className="h-full w-full object-cover rounded-xl"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
            <Camera size={22} className="text-slate-400" />
          </div>
          <p className="text-sm text-sky-600 font-semibold">
            Arrastre o haga clic para subir una imagen clara del lote
          </p>
          <p className="text-xs text-slate-400">PNG, JPG, WEBP — máx. 5 MB</p>
        </div>
      )}
      <input
        id="foto-producto"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
}

// ── QR Sidebar ────────────────────────────────────────────────────────────────
function TrazaOrigen({ batchId }) {
  return (
    <div className="space-y-4">
      {/* QR Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center gap-4">
        <h3 className="text-sm font-bold text-slate-900 self-start">Traza de Origen</h3>
        <p className="text-xs text-slate-500 self-start -mt-2">Escanee para verificar autenticidad</p>

        {/* QR placeholder */}
        <div className="w-40 h-40 rounded-xl bg-slate-900 p-3 flex items-center justify-center">
          <div className="grid grid-cols-7 gap-0.5 w-full h-full">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-[1px] ${Math.random() > 0.45 ? 'bg-white' : 'bg-slate-900'}`}
              />
            ))}
          </div>
        </div>

        <div className="w-full bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Batch ID</p>
          <p className="text-base font-extrabold text-slate-900 tracking-wider font-mono">{batchId}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <BadgeCheck size={18} className="text-emerald-500 flex-shrink-0" />
          <span className="text-emerald-600 font-bold text-xs">Sernapesca Validado</span>
        </div>
      </div>

      {/* Consejo de Venta */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center">
            <Lightbulb size={15} className="text-sky-400" />
          </div>
          <h4 className="text-sm font-bold">Consejo de Venta</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Los lotes con fotos de alta resolución y detalles precisos de captura tienen un{' '}
          <span className="text-sky-400 font-bold">45% más de probabilidad</span> de ser reservados en las primeras 2 horas.
        </p>
      </div>

      {/* Borrador automático badge */}
      <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
        <Clock size={15} className="text-sky-500 flex-shrink-0" />
        <p className="text-xs text-sky-700 font-semibold">Borrador guardado automáticamente</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegistrarCaptura() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    especie: '',
    caleta: '',
    cantidad: '',
    precioPorKg: '',
    fechaHora: '',
    metodo: '',
    observaciones: '',
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (file) => {
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: connect to API
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    navigate('/pescador/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="max-w-screen-lg mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">Registro de Oferta Diaria</h1>
            <p className="text-xs text-slate-500 mt-0.5">Complete los detalles para publicar el producto en el mercado B2B.</p>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left: Formulario ── */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

              {/* Row 1: Especie + Caleta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Especie" id="especie">
                  <div className="relative">
                    <Fish size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="especie"
                      type="text"
                      placeholder="Ej: Huachinango, Atún, Langostino..."
                      value={form.especie}
                      onChange={handleChange('especie')}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </FormField>
                <FormField label="Caleta de Origen" id="caleta">
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="caleta"
                      type="text"
                      placeholder="Ej: Puerto Madero, Bahía Central..."
                      value={form.caleta}
                      onChange={handleChange('caleta')}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </FormField>
              </div>

              {/* Row 2: Cantidad + Precio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Cantidad (KG)" id="cantidad">
                  <div className="relative">
                    <Weight size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="cantidad"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.cantidad}
                      onChange={handleChange('cantidad')}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-12 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KG</span>
                  </div>
                </FormField>

                <FormField label="Precio por KG (S/)" id="precio">
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="precio"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.precioPorKg}
                      onChange={handleChange('precioPorKg')}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </FormField>
              </div>

              {/* Row 3: Fecha + Método */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Fecha / Hora de Captura" id="fechaHora">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="fechaHora"
                      type="datetime-local"
                      value={form.fechaHora}
                      onChange={handleChange('fechaHora')}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </FormField>

                <SelectField
                  label="Método de Pesca"
                  id="metodo"
                  icon={Anchor}
                  options={METODOS}
                  value={form.metodo}
                  onChange={handleChange('metodo')}
                  required
                />
              </div>

              {/* Row 4: Observaciones */}
              <FormField label="Observaciones (talla, calidad, etc.)" id="observaciones">
                <div className="relative">
                  <AlignLeft size={16} className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    id="observaciones"
                    rows={4}
                    placeholder="Ej: Talla mediana, fresco de la mañana, sin daños visibles..."
                    value={form.observaciones}
                    onChange={handleChange('observaciones')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 resize-none focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </FormField>

              {/* Row 5: Foto */}
              <FormField label="Fotografía del Producto" id="foto-producto">
                <FileUploadArea preview={preview} onFileChange={handleFileChange} />
              </FormField>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  fullWidth
                  className="py-3 text-sm gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    <>
                      <Save size={15} /> Guardar Oferta
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  className="py-3 text-sm gap-2"
                  onClick={() => navigate(-1)}
                >
                  <X size={15} /> Cancelar
                </Button>
              </div>
            </div>

            {/* ── Right: Traza + Consejos ── */}
            <div className="lg:col-span-1">
              <TrazaOrigen batchId={BATCH_ID} />
            </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
