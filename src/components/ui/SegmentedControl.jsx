import { motion } from 'framer-motion';
import clsx from 'clsx';

/** Pill-style tabs with an animated sliding indicator (Framer Motion layoutId). */
export default function SegmentedControl({ options, value, onChange, layoutId, size = 'md', className }) {
  return (
    <div className={clsx('inline-flex rounded-xl bg-slate-100 p-1', className)} role="tablist">
      {options.map((opt) => {
        const o = typeof opt === 'string' ? { value: opt, label: opt } : opt;
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={clsx(
              'relative inline-flex items-center gap-1.5 rounded-lg font-semibold transition-colors',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
              active ? 'text-brand-800' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {o.icon && <o.icon className="h-4 w-4" />}
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
