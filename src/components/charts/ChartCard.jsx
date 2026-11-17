import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, actions, className = '' }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`card p-5 sm:p-6 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </motion.section>
  );
}

export function ChartTooltip({ active, payload, label, labelFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lift backdrop-blur">
      <p className="mb-1 font-semibold text-slate-800">{labelFormatter ? labelFormatter(label) : label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-slate-600">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.payload?.fill }} />
          {p.name}: <span className="font-semibold text-slate-900">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function NoChartData({ message = 'No activity in this period yet.' }) {
  return <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">{message}</div>;
}
