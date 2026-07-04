import { useState, useEffect } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { TopBar } from '../components/dashboard/TopBar';

export function DashboardLayout({ children }) {
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
        <Sidebar />
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
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
