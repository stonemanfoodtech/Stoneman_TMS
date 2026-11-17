import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../lib/api';
import { formatTime, todayKey } from '../../lib/dates';
import { StatusBadge } from '../ui/Badges';
import StatusPicker from './StatusPicker';
import { itemVariants } from '../ui/Misc';

/**
 * A task row. Editable (one-click status + delete for today's tasks) for the owner,
 * read-only for admins.
 */
export default function TaskItem({ task, editable = false, onChanged, onDeleteRequest }) {
  const [busy, setBusy] = useState(false);

  const setStatus = async (status) => {
    setBusy(true);
    try {
      const { data } = await api.patch(`/tasks/${task._id}`, { status });
      onChanged?.(data.task);
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const accent = { Pending: 'bg-amber-400', 'In Progress': 'bg-sky-500', Completed: 'bg-brand-600' }[task.status];

  return (
    <motion.li layout variants={itemVariants} initial="hidden" animate="show" exit="exit" className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pl-5">
      <span className={clsx('absolute inset-y-0 left-0 w-1', accent)} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className={clsx('font-semibold text-slate-900', task.status === 'Completed' && 'text-slate-500 line-through decoration-brand-400/60')}>{task.title}</p>
          {task.description && <p className="mt-1 whitespace-pre-line text-sm text-slate-500">{task.description}</p>}
          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" /> Added {formatTime(task.createdAt)}
            {task.completedAt && <> · Completed {formatTime(task.completedAt)}</>}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {editable ? (
            <>
              <StatusPicker value={task.status} onChange={setStatus} disabled={busy} layoutId={`status-${task._id}`} compact />
              {task.workDate === todayKey() && onDeleteRequest && (
                <button type="button" onClick={() => onDeleteRequest(task)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete task">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <StatusBadge status={task.status} />
          )}
        </div>
      </div>
    </motion.li>
  );
}
