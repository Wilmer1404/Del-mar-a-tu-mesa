import { useState, useEffect } from 'react';
import { CompradorSidebar } from '../components/comprador/CompradorSidebar';
import { Bell, Search, Menu } from 'lucide-react';

export function CompradorLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnim(open));
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full flex-shrink-0">
        <CompradorSidebar />
      </div>

      {/* Mobile overlay + sidebar */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
            anim ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        {/* Sidebar panel */}
        <div
          className={`relative z-50 flex flex-col h-full transition-transform duration-300 ease-out ${
            anim ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <CompradorSidebar />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar productos, vendedores…"
              aria-label="Buscar"
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button aria-label="Notificaciones" className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
