import { useState } from 'react';
import { User, Mail, Phone, Shield, Bell, Camera, Save, Check, Lock, Trash2, LogOut, ChevronRight } from 'lucide-react';
import { CompradorLayout } from '../../layouts/CompradorLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}/>
    </button>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center"><Icon size={15} className="text-emerald-600"/></div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function AvatarUploader({ initials }) {
  const [preview, setPreview] = useState(null);
  const handleChange = (e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); };
  return (
    <div className="flex items-center gap-5">
      <label htmlFor="av" className="relative cursor-pointer group">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl font-extrabold overflow-hidden border-4 border-white shadow-md">
          {preview ? <img src={preview} alt="av" className="w-full h-full object-cover"/> : initials}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={18} className="text-white"/></div>
        <input id="av" type="file" accept="image/*" className="hidden" onChange={handleChange}/>
      </label>
      <div>
        <p className="text-sm font-bold text-slate-900">{initials === 'CL' ? 'Comprador' : initials}</p>
        <p className="text-xs text-slate-500 mt-0.5">Cuenta de Comprador</p>
        <label htmlFor="av" className="text-xs text-emerald-600 font-semibold mt-1 cursor-pointer hover:text-emerald-700 flex items-center gap-1"><Camera size={11}/> Cambiar foto</label>
      </div>
    </div>
  );
}

export default function CompradorConfig() {
  const { auth, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [notifs, setNotifs] = useState({ reservas: true, precios: true, ofertas: false, seguridad: true });
  const [perfil, setPerfil] = useState({
    nombre:   auth?.nombre ?? '',
    email:    auth?.email  ?? '',
    telefono: auth?.telefono ?? '',
    empresa:  '',
  });

  const handleChange = (k) => (e) => setPerfil(p => ({...p, [k]: e.target.value}));
  const handleSave   = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateProfile({
        nombre: perfil.nombre || undefined,
        email: perfil.email || undefined,
        telefono: perfil.telefono || undefined,
        empresa: perfil.empresa || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = auth?.nombre?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() ?? 'CL';

  return (
    <CompradorLayout>
      <div className="max-w-screen-md mx-auto space-y-6">
        <div><h1 className="text-xl font-extrabold text-slate-900">Configuración de Cuenta</h1><p className="text-sm text-slate-500">Administra tu perfil y preferencias de comprador.</p></div>

        <form onSubmit={handleSave} className="space-y-6">

          <SectionCard title="Perfil Personal" icon={User}>
            <div className="space-y-5">
              <AvatarUploader initials={initials}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{label:'Nombre Completo',key:'nombre'},{label:'Empresa / Negocio',key:'empresa'}].map(({label,key})=>(
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                    <input type="text" value={perfil[key]} onChange={handleChange(key)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Correo Electrónico</label>
                  <div className="relative"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="email" value={perfil.email} onChange={handleChange('email')} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Teléfono</label>
                  <div className="relative"><Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="tel" value={perfil.telefono} onChange={handleChange('telefono')} placeholder="+51 9XX XXX XXX" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Seguridad" icon={Lock}>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nueva Contraseña</label><Input type="password" icon={Lock} placeholder="Mínimo 8 caracteres"/></div>
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Confirmar Contraseña</label><Input type="password" icon={Lock} placeholder="Repite la contraseña"/></div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3"><Shield size={16} className="text-emerald-500 flex-shrink-0 mt-0.5"/><p className="text-xs text-emerald-700">Usa al menos 8 caracteres con letras, números y símbolos.</p></div>
            </div>
          </SectionCard>

          <SectionCard title="Notificaciones" icon={Bell}>
            <div className="space-y-4">
              {[
                {key:'reservas', label:'Confirmación de reservas',     sub:'Cuando un pescador acepta tu compra'},
                {key:'precios',  label:'Alertas de precios bajos',     sub:'Cuando baje el precio de tus especies favoritas'},
                {key:'ofertas',  label:'Nuevas ofertas del día',       sub:'Publicaciones recientes en el marketplace'},
                {key:'seguridad',label:'Actividad de seguridad',       sub:'Inicios de sesión y cambios en tu cuenta'},
              ].map(({key,label,sub})=>(
                <div key={key} className="flex items-center justify-between gap-4">
                  <div><p className="text-sm font-semibold text-slate-800">{label}</p><p className="text-xs text-slate-400 mt-0.5">{sub}</p></div>
                  <Toggle checked={notifs[key]} onChange={v => setNotifs(p=>({...p,[key]:v}))}/>
                </div>
              ))}
            </div>
          </SectionCard>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <Button type="submit" fullWidth className="py-3 gap-2 text-sm bg-emerald-500 hover:bg-emerald-600" disabled={saving}>
            {saved ? <><Check size={15} className="text-white"/> Cambios guardados</> : <><Save size={15}/> Guardar Cambios</>}
          </Button>
        </form>

        {/* Zona peligrosa */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-100 bg-red-50"><Trash2 size={15} className="text-red-500"/><h2 className="text-sm font-bold text-red-600">Zona de Peligro</h2></div>
          <div className="p-6 space-y-3">
            <button onClick={handleLogout} className="w-full flex items-center justify-between text-sm text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-4 py-3 rounded-xl transition-all">
              <span className="flex items-center gap-2"><LogOut size={15}/> Cerrar sesión</span><ChevronRight size={15}/>
            </button>
            <button className="w-full flex items-center justify-between text-sm text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-3 rounded-xl transition-all">
              <span className="flex items-center gap-2"><Trash2 size={15}/> Eliminar cuenta</span><ChevronRight size={15}/>
            </button>
          </div>
        </div>
      </div>
    </CompradorLayout>
  );
}
