import { motion } from 'framer-motion';
import { CalendarDays, Flag, PartyPopper, Sun } from 'lucide-react';
import { useAsync } from '../../lib/useAsync';
import api from '../../lib/api';
import { dayName, formatLong, formatShort, greeting, todayKey } from '../../lib/dates';
import { useAuth } from '../../context/AuthContext';

/** Top-of-portal date header with the automatic Sunday and holiday banners. */
export default function DateBanner() {
  const { user } = useAuth();
  const { data } = useAsync(() => api.get('/holidays/today').then((r) => r.data), []);
  const key = data?.date || todayKey();
  const isSunday = data ? data.isSunday : new Date(`${key}T00:00:00Z`).getUTCDay() === 0;
  const holiday = data?.holiday;

  return (
    <div className="space-y-3">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 text-white shadow-lift sm:p-8"
      >
        <img src="/brand/stoneman-mark.png" alt="" className="pointer-events-none absolute -right-6 -top-4 h-48 opacity-10 sm:h-56" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-leaf-lime/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-100/80">
              {greeting()}, {user?.firstName}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">{dayName(key)}</h1>
            <p className="mt-1 flex items-center gap-2 text-brand-50">
              <CalendarDays className="h-4 w-4 text-lime-300" /> {formatLong(key)}
            </p>
          </div>
          {data?.upcoming?.length > 0 && (
            <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-300">Upcoming holidays</p>
              <ul className="mt-1.5 space-y-1">
                {data.upcoming.map((h) => (
                  <li key={h._id} className="flex items-center justify-between gap-6 text-sm">
                    <span className="text-white">{h.name}</span>
                    <span className="text-brand-100/80">{formatShort(h.occursOn)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.section>

      {isSunday && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 text-amber-900"
          role="status"
        >
          <span className="rounded-xl bg-amber-400/20 p-2 text-amber-600">
            <Sun className="h-5 w-5" />
          </span>
          <p className="font-semibold">Today is Sunday — Weekly Holiday</p>
        </motion.div>
      )}

      {holiday && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-lime-300 bg-gradient-to-r from-lime-50 via-white to-brand-50 px-5 py-4"
          role="status"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-orange-400 via-white to-green-600" />
          <span className="rounded-xl bg-brand-100 p-2 text-brand-700">
            {holiday.type === 'national' ? <Flag className="h-5 w-5" /> : <PartyPopper className="h-5 w-5" />}
          </span>
          <div>
            <p className="font-semibold text-brand-900">
              {holiday.type === 'national' ? 'Today is a National Holiday: ' : 'Today is a Holiday: '}
              <span className="text-brand-700">{holiday.name}</span>
            </p>
            {holiday.description && <p className="text-xs text-slate-500">{holiday.description}</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}
