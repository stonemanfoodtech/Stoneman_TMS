import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, MessageSquareText } from 'lucide-react';
import clsx from 'clsx';
import { relativeDayLabel, dayName, formatTime } from '../../lib/dates';
import { EnquiryBadge } from '../ui/Badges';
import TaskItem from './TaskItem';

/** Day-wise accordion of tasks and enquiries. */
export default function DayFeed({ days, editable = false, onTaskChanged, onDeleteRequest, onResolveEnquiry, defaultOpen = 2 }) {
  const [open, setOpen] = useState(() => new Set(days.slice(0, defaultOpen).map((d) => d.date)));

  const toggle = (date) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });

  return (
    <motion.div className="space-y-3" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
      {days.map((day) => {
        const isOpen = open.has(day.date);
        const done = day.tasks.filter((t) => t.status === 'Completed').length;
        const pct = day.tasks.length ? Math.round((done / day.tasks.length) * 100) : 0;
        return (
          <motion.section key={day.date} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="card overflow-hidden">
            <button type="button" onClick={() => toggle(day.date)} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/70" aria-expanded={isOpen}>
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                <span className="text-lg font-bold leading-none">{day.date.slice(8)}</span>
                <span className="text-[9px] font-bold uppercase">{dayName(day.date).slice(0, 3)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{relativeDayLabel(day.date)}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" /> {done}/{day.tasks.length} tasks done
                  </span>
                  {day.enquiries.length > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <MessageSquareText className="h-3.5 w-3.5 text-amber-500" /> {day.enquiries.length} enquir{day.enquiries.length === 1 ? 'y' : 'ies'}
                    </span>
                  )}
                </div>
              </div>
              {day.tasks.length > 0 && (
                <div className="hidden w-28 sm:block">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div className="h-full rounded-full bg-leaf-gradient" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                  </div>
                  <p className="mt-1 text-right text-[11px] font-semibold text-slate-500">{pct}%</p>
                </div>
              )}
              <ChevronDown className={clsx('h-5 w-5 shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="space-y-4 border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-5">
                    {day.tasks.length > 0 && (
                      <ul className="space-y-2.5">
                        <AnimatePresence initial={false}>
                          {day.tasks.map((task) => (
                            <TaskItem key={task._id} task={task} editable={editable} onChanged={onTaskChanged} onDeleteRequest={onDeleteRequest} />
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                    {day.enquiries.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Enquiries &amp; notes</p>
                        <ul className="space-y-2">
                          {day.enquiries.map((q) => (
                            <li key={q._id} className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-3.5">
                              <p className="whitespace-pre-line text-sm text-slate-700">{q.message}</p>
                              <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                                <span>{formatTime(q.createdAt)}</span>
                                <div className="flex items-center gap-2">
                                  <EnquiryBadge status={q.status} />
                                  {onResolveEnquiry && (
                                    <button type="button" onClick={() => onResolveEnquiry(q)} className="font-semibold text-brand-700 hover:text-brand-800">
                                      {q.status === 'resolved' ? 'Reopen' : 'Mark resolved'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!day.tasks.length && !day.enquiries.length && <p className="text-sm text-slate-500">Nothing logged.</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        );
      })}
    </motion.div>
  );
}
