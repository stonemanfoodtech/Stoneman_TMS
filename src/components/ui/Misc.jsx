import { motion } from 'framer-motion';
import clsx from 'clsx';

export function EmptyState({ icon: Icon, title, message, action, className }) {
  return (
    <div className={clsx('flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center', className)}>
      {Icon && (
        <div className="mb-3 rounded-2xl bg-brand-50 p-3 text-brand-600">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function KpiCard({ icon: Icon, label, value, hint, tone = 'brand', index = 0 }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    lime: 'bg-lime-100 text-lime-600',
    teal: 'bg-teal-50 text-teal-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          {hint && <p className="mt-1 truncate text-xs text-slate-500">{hint}</p>}
        </div>
        {Icon && (
          <div className={clsx('rounded-xl p-2.5', tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 30 } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};
