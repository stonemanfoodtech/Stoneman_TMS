import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2, CircleDashed, ClipboardList, History, Loader, MessageSquareText } from 'lucide-react';
import toast from 'react-hot-toast';
import DateBanner from '../../components/tasks/DateBanner';
import PasswordNotice from '../../components/ui/PasswordNotice';
import TaskComposer from '../../components/tasks/TaskComposer';
import EnquiryBox from '../../components/tasks/EnquiryBox';
import TaskItem from '../../components/tasks/TaskItem';
import DayFeed from '../../components/tasks/DayFeed';
import DateRangeControl from '../../components/ui/DateRangeControl';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { ConfirmModal } from '../../components/ui/Modal';
import { EmptyState, KpiCard } from '../../components/ui/Misc';
import { SkeletonBlock } from '../../components/ui/Spinner';
import { Toggle } from '../../components/ui/Field';
import api, { errorMessage } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { presetRange, todayKey } from '../../lib/dates';

export default function Dashboard() {
  const today = todayKey();
  const [range, setRange] = useState(() => presetRange(14));
  const [status, setStatus] = useState('All');
  const [hasEnquiry, setHasEnquiry] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const todayData = useAsync(
    () =>
      Promise.all([api.get('/tasks', { params: { from: today, to: today } }), api.get('/enquiries', { params: { from: today, to: today } })]).then(([t, e]) => ({
        tasks: t.data.tasks,
        enquiries: e.data.enquiries,
      })),
    [today]
  );

  const history = useAsync(
    () => api.get('/tasks/activity', { params: { ...range, status, hasEnquiry } }).then((r) => r.data),
    [range.from, range.to, status, hasEnquiry]
  );

  const tasks = todayData.data?.tasks || [];
  const counts = useMemo(
    () => ({
      total: tasks.length,
      Completed: tasks.filter((t) => t.status === 'Completed').length,
      'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
      Pending: tasks.filter((t) => t.status === 'Pending').length,
    }),
    [tasks]
  );

  const refreshAll = () => {
    todayData.reload({ silent: true });
    history.reload({ silent: true });
  };

  const onTaskChanged = (task) => {
    todayData.setData((d) => d && { ...d, tasks: d.tasks.map((t) => (t._id === task._id ? task : t)) });
    history.reload({ silent: true });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/tasks/${toDelete._id}`);
      toast.success('Task deleted');
      setToDelete(null);
      refreshAll();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PasswordNotice />
      <DateBanner />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard index={0} icon={ClipboardList} label="Tasks today" value={counts.total} tone="brand" />
        <KpiCard index={1} icon={CheckCircle2} label="Completed" value={counts.Completed} tone="lime" hint={counts.total ? `${Math.round((counts.Completed / counts.total) * 100)}% done` : 'Nothing logged yet'} />
        <KpiCard index={2} icon={Loader} label="In progress" value={counts['In Progress']} tone="sky" />
        <KpiCard index={3} icon={CircleDashed} label="Pending" value={counts.Pending} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <TaskComposer onCreated={refreshAll} />
          <EnquiryBox todaysEnquiries={todayData.data?.enquiries || []} onCreated={refreshAll} />
        </div>

        <section className="card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Today's tasks</h2>
              <p className="text-xs text-slate-500">Tap a status to update it instantly</p>
            </div>
          </div>
          {todayData.loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <SkeletonBlock key={i} className="h-20" />
              ))}
            </div>
          ) : todayData.error ? (
            <EmptyState title="Couldn't load today's tasks" message={todayData.error} action={<button className="btn-secondary" onClick={() => todayData.reload()}>Try again</button>} />
          ) : tasks.length ? (
            <ul className="space-y-2.5">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <TaskItem key={task._id} task={task} editable onChanged={onTaskChanged} onDeleteRequest={setToDelete} />
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <EmptyState icon={ClipboardList} title="No tasks logged today" message="Add what you're working on — it helps the team plan production and dispatch." />
          )}
        </section>
      </div>

      <section>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold">Day-wise history</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DateRangeControl from={range.from} to={range.to} onChange={setRange} />
            <SegmentedControl size="sm" options={['All', 'Completed', 'In Progress', 'Pending']} value={status} onChange={setStatus} layoutId="hist-status" />
            <Toggle id="hist-enq" checked={hasEnquiry} onChange={setHasEnquiry} label="Has enquiry" />
          </div>
        </div>
        {history.loading && !history.data ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <SkeletonBlock key={i} className="h-20" />
            ))}
          </div>
        ) : history.error ? (
          <EmptyState title="Couldn't load your history" message={history.error} />
        ) : history.data?.days.length ? (
          <DayFeed key={`${range.from}${range.to}${status}${hasEnquiry}`} days={history.data.days} editable onTaskChanged={onTaskChanged} onDeleteRequest={setToDelete} />
        ) : (
          <EmptyState icon={MessageSquareText} title="Nothing in this period" message="Try a wider date range or clear the filters." />
        )}
      </section>

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete this task?"
        message={`"${toDelete?.title}" will be removed from today's log.`}
        confirmLabel="Delete task"
      />
    </div>
  );
}
