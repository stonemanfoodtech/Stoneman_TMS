import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Loader } from 'lucide-react';
import clsx from 'clsx';
import { TASK_STATUSES } from '../../lib/constants';

const ICONS = { Pending: CircleDashed, 'In Progress': Loader, Completed: CheckCircle2 };
const ACTIVE = {
  Pending: 'text-amber-800',
  'In Progress': 'text-sky-800',
  Completed: 'text-brand-800',
};
const PILL = { Pending: 'bg-amber-100', 'In Progress': 'bg-sky-100', Completed: 'bg-brand-100' };

/** One-click status switcher used on task cards and in the composer. */
export default function StatusPicker({ value, onChange, layoutId, disabled, compact = false }) {
  return (
    <div className={clsx('inline-flex rounded-xl bg-slate-100 p-0.5', disabled && 'opacity-60')}>
      {TASK_STATUSES.map((status) => {
        const Icon = ICONS[status];
        const active = status === value;
        return (
          <button
            key={status}
            type="button"
            disabled={disabled}
            onClick={() => !active && onChange(status)}
            title={status}
            aria-pressed={active}
            className={clsx(
              'relative inline-flex items-center gap-1 rounded-[10px] font-semibold transition-colors',
              compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs',
              active ? ACTIVE[status] : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {active && <motion.span layoutId={layoutId} className={clsx('absolute inset-0 rounded-[10px] shadow-sm', PILL[status])} transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            <Icon className="relative h-3.5 w-3.5" />
            <span className={clsx('relative', compact && 'hidden sm:inline')}>{status}</span>
          </button>
        );
      })}
    </div>
  );
}
