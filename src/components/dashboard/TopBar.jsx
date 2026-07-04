import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

export function TopBar({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Left: mobile menu + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-slate-800"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900">Panel del Pescador</h1>
          <p className="text-xs text-slate-400 hidden sm:block">Bienvenido de nuevo, Cap. Arturo</p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-72">
        <Search size={15} className="text-slate-400" />
        <input
          type="text"
          placeholder="Buscar capturas, pedidos…"
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
}
