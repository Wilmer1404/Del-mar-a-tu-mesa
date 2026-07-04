import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Camera,
  Save,
  Check,
  Anchor,
  Trash2,
  LogOut,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

// ── Avatar uploader ───────────────────────────────────────────────────────────
function AvatarUploader({ initials }) {
  const [preview, setPreview] = useState(null);
  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };
  return (
    <div className="flex items-center gap-5">
      <label htmlFor="avatar-upload" className="relative cursor-pointer group">
        <div className="w-20 h-20 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-2xl font-extrabold overflow-hidden border-4 border-white shadow-md">
          {preview ? <img src={preview} alt="Avatar" className="w-full h-full object-cover" /> : initials}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={18} className="text-white" />
        </div>
        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </label>
      <div>
        <p className="text-sm font-bold text-slate-900">Cap. Arturo Prat</p>
        <p className="text-xs text-slate-500 mt-0.5">Pescador Artesanal · Puerto Madero</p>
        <label
          htmlFor="avatar-upload"
          className="text-xs text-sky-600 font-semibold mt-1 cursor-pointer hover:text-sky-700 flex items-center gap-1"
        >
          <Camera size={11} /> Cambiar foto
        </label>
      </div>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon size={15} className="text-slate-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-sky-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Configuracion() {
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    nuevosPrecios: true,
    ofertasReservadas: true,
    alertasClima: true,
    newsletter: false,
    actividadCuenta: true,
  });

  const [perfil, setPerfil] = useState({
    nombre: 'Arturo Prat',
    apellido: 'González',
    email: 'arturo.prat@delmar.pe',
    telefono: '+51 996 234 567',
    caleta: 'Parachique',
    embarcacion: 'Esperanza del Mar',
    licencia: 'PRODUCE-2024-00341',
    metodoPago: 'Yape / BCP: 996 234 567',
  });

  const handlePerfilChange = (k) => (e) =>
    setPerfil((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-screen-md mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Configuración de Cuenta</h1>
          <p className="text-sm text-slate-500">Administra tu perfil, seguridad y preferencias.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* ── Perfil ── */}
          <SectionCard title="Perfil Personal" icon={User}>
            <div className="space-y-6">
              <AvatarUploader initials="AP" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre',         key: 'nombre',      placeholder: 'Tu nombre' },
                  { label: 'Apellido',        key: 'apellido',    placeholder: 'Tu apellido' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                    <input
                      type="text"
                      value={perfil[key]}
                      onChange={handlePerfilChange(key)}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Correo Electrónico</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={perfil.email}
                      onChange={handlePerfilChange('email')}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Teléfono</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={perfil.telefono}
                      onChange={handlePerfilChange('telefono')}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Datos de Pesca ── */}
          <SectionCard title="Datos de Actividad Pesquera" icon={Anchor}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Caleta Principal',    key: 'caleta',       icon: MapPin },
                { label: 'Nombre de Embarcación', key: 'embarcacion', icon: Anchor },
                { label: 'N° Licencia PRODUCE',  key: 'licencia',    icon: Shield },
                { label: 'Método de Pago/Cobro', key: 'metodoPago',  icon: null },
              ].map(({ label, key, icon: Icon }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                  <div className="relative">
                    {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
                    <input
                      type="text"
                      value={perfil[key]}
                      onChange={handlePerfilChange(key)}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 ${Icon ? 'pl-9' : 'pl-3'} pr-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── Seguridad ── */}
          <SectionCard title="Seguridad" icon={Lock}>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nueva Contraseña</label>
                <Input type="password" icon={Lock} placeholder="Mínimo 8 caracteres" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Confirmar Contraseña</label>
                <Input type="password" icon={Lock} placeholder="Repite la contraseña" />
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start gap-3">
                <Shield size={16} className="text-sky-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-sky-700">
                  Usa una contraseña de al menos 8 caracteres con letras, números y símbolos para mayor seguridad.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* ── Notificaciones ── */}
          <SectionCard title="Notificaciones" icon={Bell}>
            <div className="space-y-4">
              {[
                { key: 'nuevosPrecios',      label: 'Actualizaciones de precios en la Lonja',     sub: 'Recibe alertas cuando cambien los precios de tu especie' },
                { key: 'ofertasReservadas',  label: 'Ofertas reservadas o compradas',               sub: 'Notificaciones instantáneas de actividad en tus publicaciones' },
                { key: 'alertasClima',       label: 'Alertas climáticas y de oleaje',               sub: 'Avisos del SENAMHI y condiciones del puerto' },
                { key: 'actividadCuenta',    label: 'Actividad de seguridad en la cuenta',          sub: 'Inicios de sesión y cambios en tu perfil' },
                { key: 'newsletter',         label: 'Boletín mensual del marketplace',              sub: 'Novedades, insumos en oferta y consejos de venta' },
              ].map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                  </div>
                  <Toggle
                    checked={notifs[key]}
                    onChange={(val) => setNotifs((prev) => ({ ...prev, [key]: val }))}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Save button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" fullWidth className="py-3 gap-2 text-sm">
              {saved ? (
                <><Check size={15} className="text-emerald-400" /> Cambios guardados</>
              ) : (
                <><Save size={15} /> Guardar Cambios</>
              )}
            </Button>
          </div>
        </form>

        {/* ── Zona peligrosa ── */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-100 bg-red-50">
            <Trash2 size={15} className="text-red-500" />
            <h2 className="text-sm font-bold text-red-600">Zona de Peligro</h2>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full flex items-center justify-between text-sm text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-4 py-3 rounded-xl transition-all">
              <span className="flex items-center gap-2"><LogOut size={15} /> Cerrar sesión en todos los dispositivos</span>
              <ChevronRight size={15} />
            </button>
            <button className="w-full flex items-center justify-between text-sm text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-3 rounded-xl transition-all">
              <span className="flex items-center gap-2"><Trash2 size={15} /> Eliminar mi cuenta permanentemente</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
