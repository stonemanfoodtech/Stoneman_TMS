import clsx from 'clsx';

/**
 * Stoneman brand lockup: sprout mark + wordmark + legal descriptor.
 * `tone="light"` swaps to the white wordmark for dark/green backgrounds.
 */
export default function Logo({ tone = 'dark', size = 'md', showTagline = true, className }) {
  const sizes = {
    sm: { mark: 'h-8', word: 'h-[18px]', tag: 'text-[8px] tracking-[0.22em]' },
    md: { mark: 'h-10', word: 'h-[22px]', tag: 'text-[9px] tracking-[0.24em]' },
    lg: { mark: 'h-14', word: 'h-8', tag: 'text-[11px] tracking-[0.28em]' },
  }[size];

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <img src="/brand/stoneman-mark.png" alt="" className={clsx(sizes.mark, 'w-auto shrink-0')} />
      <div className="flex flex-col justify-center leading-none">
        <img
          src={tone === 'light' ? '/brand/stoneman-wordmark-white.png' : '/brand/stoneman-wordmark.png'}
          alt="Stoneman"
          className={clsx(sizes.word, 'w-auto')}
        />
        {showTagline && (
          <span className={clsx(sizes.tag, 'mt-1 font-semibold uppercase', tone === 'light' ? 'text-lime-300' : 'text-leaf-teal')}>
            Food and Beverages
          </span>
        )}
      </div>
    </div>
  );
}

export function LogoMark({ className }) {
  return <img src="/brand/stoneman-mark.png" alt="Stoneman" className={clsx('w-auto', className)} />;
}
