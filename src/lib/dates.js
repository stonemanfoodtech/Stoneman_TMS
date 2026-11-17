export const TIMEZONE = 'Asia/Kolkata';

const keyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' });

export const todayKey = () => keyFormatter.format(new Date());

export function addDays(key, days) {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const fmt = (options) => new Intl.DateTimeFormat('en-IN', { timeZone: 'UTC', ...options });
const longFmt = fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const mediumFmt = fmt({ weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const shortFmt = fmt({ day: 'numeric', month: 'short' });
const dayNameFmt = fmt({ weekday: 'long' });

const toDate = (key) => new Date(`${key}T00:00:00Z`);

export const formatLong = (key) => longFmt.format(toDate(key));
export const formatMedium = (key) => mediumFmt.format(toDate(key));
export const formatShort = (key) => shortFmt.format(toDate(key));
export const dayName = (key) => dayNameFmt.format(toDate(key));

export function relativeDayLabel(key) {
  const today = todayKey();
  if (key === today) return 'Today';
  if (key === addDays(today, -1)) return 'Yesterday';
  return formatMedium(key);
}

export function formatTime(iso) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: TIMEZONE, hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
}

export function formatDob(iso) {
  if (!iso) return '—';
  return fmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export function greeting() {
  const hour = Number(new Intl.DateTimeFormat('en-IN', { timeZone: TIMEZONE, hour: 'numeric', hour12: false }).format(new Date()));
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export const RANGE_PRESETS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

export const presetRange = (days) => ({ from: addDays(todayKey(), -(days - 1)), to: todayKey() });
