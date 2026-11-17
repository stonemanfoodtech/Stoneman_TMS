import { motion } from 'framer-motion';
import { CalendarCheck2, ClipboardList, LineChart } from 'lucide-react';
import Logo from '../ui/Logo';

const POINTS = [
  { icon: ClipboardList, text: 'Log daily tasks and update their status in one click' },
  { icon: CalendarCheck2, text: 'Sundays and national holidays flagged automatically' },
  { icon: LineChart, text: 'Live productivity analytics for the leadership team' },
];

/** Split-screen layout for login / register / reset pages. */
export default function AuthShell({ title, subtitle, children, wide = false }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(380px,0.85fr)_1.15fr]">
      <aside className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-leaf-lime/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-leaf-teal/30 blur-3xl" />
        <img src="/brand/stoneman-mark.png" alt="" className="pointer-events-none absolute -bottom-10 -right-10 h-80 opacity-[0.07]" />

        <Logo tone="light" size="lg" className="relative" />
        <div className="relative mt-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md font-display text-4xl font-semibold leading-tight text-white"
          >
            Every task, every shift, <span className="text-lime-300">one place.</span>
          </motion.h2>
          <p className="mt-4 max-w-md text-brand-100/80">The employee operations portal for the team behind RAWSA and Stoneman products.</p>
          <ul className="mt-8 space-y-3">
            {POINTS.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-brand-50"
              >
                <span className="rounded-lg bg-white/10 p-2 ring-1 ring-white/15">
                  <Icon className="h-4 w-4 text-lime-300" />
                </span>
                {text}
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="relative mt-10 text-xs text-brand-100/60">© {new Date().getFullYear()} Stoneman Food and Beverages Pvt. Ltd.</p>
      </aside>

      <main className="flex min-h-screen flex-col px-5 py-8 sm:px-10">
        <Logo className="mb-8 lg:hidden" />
        <div className={`m-auto w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
