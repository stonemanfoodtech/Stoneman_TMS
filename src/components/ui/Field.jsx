import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

export const Field = forwardRef(function Field({ label, error, hint, icon: Icon, className, as = 'input', children, ...props }, ref) {
  const Component = as;
  const id = props.id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <Component
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={clsx('input', Icon && 'pl-10', error && 'input-error', as === 'textarea' && 'min-h-[96px] resize-y')}
          {...props}
        >
          {children}
        </Component>
      </div>
      {error ? <p className="field-error">{error}</p> : hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
});

export function PasswordField({ label = 'Password', error, className, ...props }) {
  const [visible, setVisible] = useState(false);
  const id = props.id || props.name;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input id={id} type={visible ? 'text' : 'password'} className={clsx('input pr-11', error && 'input-error')} aria-invalid={Boolean(error)} {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function passwordStrength(password = '') {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const levels = [
    { label: 'Too weak', color: 'bg-rose-500' },
    { label: 'Weak', color: 'bg-rose-500' },
    { label: 'Fair', color: 'bg-amber-500' },
    { label: 'Good', color: 'bg-lime-500' },
    { label: 'Strong', color: 'bg-brand-600' },
    { label: 'Excellent', color: 'bg-brand-700' },
  ];
  return { score, ...levels[score] };
}

export function StrengthMeter({ password }) {
  if (!password) return null;
  const { score, label, color } = passwordStrength(password);
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={clsx('h-1.5 flex-1 rounded-full transition-colors', i < score ? color : 'bg-slate-200')} />
        ))}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Strength: <span className="font-semibold text-slate-700">{label}</span>
      </p>
    </div>
  );
}

export function Toggle({ checked, onChange, label, id }) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium text-slate-700">
      <span className="relative inline-flex">
        <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-brand-600 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/25" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
      {label}
    </label>
  );
}
