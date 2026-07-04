import { Ship } from 'lucide-react';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900">
      {/* Left Column - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-100 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://saludconlupa.com/media/images/juanjose_melchor.width-1920.jpg')",
            filter: 'brightness(0.8) contrast(1.2)'
          }}
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900/90" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-16">
            <Ship size={32} className="text-sky-400" />
            <span className="text-2xl font-bold tracking-tight">Del Mar a Tu Mesa</span>
          </div>

          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Conectando el mar con tu mesa mediante tecnología y trazabilidad digital.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              Optimizamos la cadena de suministro pesquera con datos en tiempo real y transparencia total desde el origen.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative justify-center px-6 py-12 sm:px-12 lg:px-24">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden flex items-center gap-2 mb-10 text-slate-900">
          <div className="bg-slate-900 p-2 rounded-lg">
            <Ship size={24} className="text-sky-400" />
          </div>
          <span className="text-xl font-bold">Del Mar a Tu Mesa</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
