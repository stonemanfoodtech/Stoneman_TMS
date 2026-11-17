import clsx from 'clsx';
import { LogoMark } from './Logo';

export default function Spinner({ className }) {
  return (
    <svg className={clsx('h-5 w-5 animate-spin', className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function FullPageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-brand-700">
      <LogoMark className="h-12 animate-pulse" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

export function SkeletonBlock({ className }) {
  return <div className={clsx('animate-pulse rounded-xl bg-slate-200/70', className)} />;
}
