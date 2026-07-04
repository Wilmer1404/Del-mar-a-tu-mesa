

export function StatCard({ label, value, sub, subColor = 'text-emerald-500', icon: Icon, iconBg = 'bg-sky-100', iconColor = 'text-sky-600' }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
        {Icon && (
          <div className={`${iconBg} p-2 rounded-xl`}>
            <Icon size={16} className={iconColor} />
          </div>
        )}
      </div>
      <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      {sub && <p className={`text-xs font-semibold ${subColor}`}>{sub}</p>}
    </div>
  );
}
