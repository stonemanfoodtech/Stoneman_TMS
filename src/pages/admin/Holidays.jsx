import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, CalendarPlus, Flag, Pencil, PartyPopper, Repeat, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Field, Toggle } from '../../components/ui/Field';
import { ConfirmModal } from '../../components/ui/Modal';
import { EmptyState, PageHeader, itemVariants } from '../../components/ui/Misc';
import { SkeletonBlock } from '../../components/ui/Spinner';
import Spinner from '../../components/ui/Spinner';
import api, { errorMessage, fieldErrors } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { HOLIDAY_TYPES } from '../../lib/constants';
import { formatMedium, todayKey } from '../../lib/dates';

const EMPTY = { name: '', date: '', type: 'national', recurring: false, description: '' };
const TYPE_STYLE = {
  national: { chip: 'bg-orange-100 text-orange-800', icon: Flag, label: 'National' },
  festival: { chip: 'bg-lime-100 text-lime-600', icon: PartyPopper, label: 'Festival' },
  company: { chip: 'bg-sky-100 text-sky-800', icon: CalendarDays, label: 'Company' },
};

export default function Holidays() {
  const { data, loading, error, reload } = useAsync(() => api.get('/holidays').then((r) => r.data.holidays), []);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [filter, setFilter] = useState('upcoming');
  const today = todayKey();

  const holidays = useMemo(() => {
    const list = (data || []).map((h) => {
      const thisYear = `${today.slice(0, 4)}-${h.monthDay}`;
      const next = h.recurring ? (thisYear >= today ? thisYear : `${Number(today.slice(0, 4)) + 1}-${h.monthDay}`) : h.date;
      return { ...h, next };
    });
    const filtered = filter === 'upcoming' ? list.filter((h) => h.next >= today) : filter === 'past' ? list.filter((h) => !h.recurring && h.date < today) : list;
    return filtered.sort((x, y) => (x.next < y.next ? -1 : 1));
  }, [data, filter, today]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setErrors({});
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter a holiday name.';
    if (!form.date) next.date = 'Choose a date.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      if (editingId) await api.put(`/holidays/${editingId}`, form);
      else await api.post('/holidays', form);
      toast.success(editingId ? 'Holiday updated' : 'Holiday added');
      reset();
      reload({ silent: true });
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (h) => {
    setEditingId(h._id);
    setForm({ name: h.name, date: h.date, type: h.type, recurring: h.recurring, description: h.description || '' });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.delete(`/holidays/${toDelete._id}`);
      toast.success('Holiday removed');
      if (editingId === toDelete._id) reset();
      setToDelete(null);
      reload({ silent: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Manage holidays" subtitle="National holidays and company off-days shown on every employee's dashboard. Sundays are automatic." />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="card h-fit p-5 sm:p-6 lg:sticky lg:top-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit holiday' : 'Add a holiday'}</h2>
            {editingId ? (
              <button type="button" onClick={reset} className="btn-ghost p-2" aria-label="Cancel editing">
                <X className="h-4 w-4" />
              </button>
            ) : (
              <span className="rounded-xl bg-brand-50 p-2 text-brand-700">
                <CalendarPlus className="h-5 w-5" />
              </span>
            )}
          </div>
          <div className="space-y-4">
            <Field label="Holiday name" name="name" placeholder="e.g. Rath Yatra" value={form.name} onChange={set('name')} error={errors.name} maxLength={100} />
            <Field label="Date" name="date" type="date" value={form.date} onChange={set('date')} error={errors.date} />
            <Field as="select" label="Type" name="type" value={form.type} onChange={set('type')} error={errors.type}>
              {HOLIDAY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Field>
            <Field as="textarea" label="Note (optional)" name="description" rows={2} maxLength={300} value={form.description} onChange={set('description')} error={errors.description} />
            <Toggle id="recurring" checked={form.recurring} onChange={(v) => setForm((f) => ({ ...f, recurring: v }))} label="Repeats every year on this date" />
            <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
              {busy ? <Spinner className="h-4 w-4" /> : editingId ? <Save className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />}
              {editingId ? 'Save changes' : 'Add holiday'}
            </button>
          </div>
        </form>

        <section>
          <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-1">
            {[
              ['upcoming', 'Upcoming'],
              ['all', 'All'],
              ['past', 'Past one-time'],
            ].map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setFilter(v)}
                className={clsx('rounded-lg px-3 py-1.5 text-xs font-semibold transition', filter === v ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-500 hover:text-slate-800')}
              >
                {label}
              </button>
            ))}
          </div>

          {loading && !data ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonBlock key={i} className="h-20" />
              ))}
            </div>
          ) : error ? (
            <EmptyState title="Couldn't load holidays" message={error} action={<button className="btn-secondary" onClick={() => reload()}>Try again</button>} />
          ) : !holidays.length ? (
            <EmptyState icon={CalendarDays} title="No holidays here" message="Add national or company holidays using the form." />
          ) : (
            <ul className="space-y-2.5">
              <AnimatePresence initial={false}>
                {holidays.map((h) => {
                  const style = TYPE_STYLE[h.type];
                  const Icon = style.icon;
                  const isToday = h.next === today;
                  return (
                    <motion.li
                      key={h._id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className={clsx('card flex items-center gap-4 p-4', isToday && 'ring-2 ring-lime-400', editingId === h._id && 'ring-2 ring-brand-500')}
                    >
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                        <span className="text-lg font-bold leading-none">{h.next.slice(8)}</span>
                        <span className="text-[10px] font-bold uppercase">{formatMedium(h.next).split(' ')[2]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">{h.name}</p>
                          <span className={clsx('chip', style.chip)}>
                            <Icon className="h-3 w-3" /> {style.label}
                          </span>
                          {h.recurring && (
                            <span className="chip bg-slate-100 text-slate-600">
                              <Repeat className="h-3 w-3" /> Yearly
                            </span>
                          )}
                          {isToday && <span className="chip bg-lime-200 text-brand-900">Today</span>}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {formatMedium(h.next)}
                          {h.description && ` · ${h.description}`}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button type="button" onClick={() => startEdit(h)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Edit ${h.name}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setToDelete(h)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${h.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </section>
      </div>

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={busy}
        title="Remove this holiday?"
        message={`"${toDelete?.name}" will no longer appear on employee dashboards.`}
        confirmLabel="Remove"
      />
    </div>
  );
}
