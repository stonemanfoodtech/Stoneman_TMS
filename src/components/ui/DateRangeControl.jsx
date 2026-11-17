import { CalendarRange } from 'lucide-react';
import clsx from 'clsx';
import { RANGE_PRESETS, presetRange, todayKey } from '../../lib/dates';

export default function DateRangeControl({ from, to, onChange, className }) {
  const activePreset = RANGE_PRESETS.find((p) => {
    const r = presetRange(p.days);
    return r.from === from && r.to === to;
  });
  const max = todayKey();

  return (
    <div className={clsx('flex flex-wrap items-center gap-2', className)}>
      <div className="inline-flex rounded-xl bg-slate-100 p-1">
        {RANGE_PRESETS.map((p) => (
          <button
            key={p.days}
            type="button"
            onClick={() => onChange(presetRange(p.days))}
            className={clsx(
              'rounded-lg px-2.5 py-1 text-xs font-semibold transition',
              activePreset?.days === p.days ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5">
        <CalendarRange className="h-4 w-4 text-slate-400" />
        <input
          type="date"
          aria-label="Start date"
          value={from}
          max={to}
          onChange={(e) => e.target.value && onChange({ from: e.target.value, to })}
          className="w-[8.6rem] border-0 bg-transparent p-0 text-xs font-medium text-slate-700 focus:outline-none focus:ring-0"
        />
        <span className="text-xs text-slate-400">–</span>
        <input
          type="date"
          aria-label="End date"
          value={to}
          min={from}
          max={max}
          onChange={(e) => e.target.value && onChange({ from, to: e.target.value })}
          className="w-[8.6rem] border-0 bg-transparent p-0 text-xs font-medium text-slate-700 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
