

/**
 * FormField – Envuelve un label + children (input/select/textarea).
 * Props: label, id, hint (texto de ayuda opcional), children
 */
export function FormField({ label, id, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
