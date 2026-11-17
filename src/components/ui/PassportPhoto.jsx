import { useState } from 'react';
import clsx from 'clsx';
import { UserRound } from 'lucide-react';

/** Renders a Cloudinary passport portrait at the 3.5:4.5 ratio, with an initials fallback. */
export default function PassportPhoto({ src, name = '', className, rounded = 'rounded-xl' }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <div className={clsx('relative aspect-[35/45] overflow-hidden bg-gradient-to-br from-brand-100 to-lime-100', rounded, className)}>
      {src && !failed ? (
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-brand-700">
          {initials ? <span className="font-display text-2xl font-semibold">{initials}</span> : <UserRound className="h-8 w-8" />}
        </div>
      )}
    </div>
  );
}

export function Avatar({ src, name = '', size = 'h-9 w-9' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  return src ? (
    <img src={src} alt={name} className={clsx(size, 'shrink-0 rounded-full object-cover object-top ring-2 ring-white')} />
  ) : (
    <span className={clsx(size, 'inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800 ring-2 ring-white')}>
      {initials}
    </span>
  );
}
