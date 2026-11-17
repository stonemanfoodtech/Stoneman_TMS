import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ChevronRight, LayoutGrid, List, Power, Search, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import PassportPhoto, { Avatar } from '../../components/ui/PassportPhoto';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { EmptyState, PageHeader, itemVariants, listVariants } from '../../components/ui/Misc';
import { SkeletonBlock } from '../../components/ui/Spinner';
import { ConfirmModal } from '../../components/ui/Modal';
import api, { errorMessage } from '../../lib/api';
import { useAsync, useDebounced } from '../../lib/useAsync';

function EmployeeActions({ employee, onToggle, onDelete, className }) {
  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onToggle(employee)}
        className={clsx('rounded-lg p-2 transition', employee.isActive ? 'text-slate-400 hover:bg-amber-50 hover:text-amber-700' : 'text-brand-600 hover:bg-brand-50')}
        title={employee.isActive ? 'Deactivate account' : 'Activate account'}
        aria-label={`${employee.isActive ? 'Deactivate' : 'Activate'} ${employee.fullName}`}
      >
        <Power className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(employee)}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
        title="Delete employee"
        aria-label={`Delete ${employee.fullName}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

const VIEW_KEY = 'stoneman_ops_employee_view';
const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) || 'grid';
  } catch {
    return 'grid';
  }
};

export default function Employees() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [view, setView] = useState(readView);
  const q = useDebounced(search.trim(), 300);
  const [pending, setPending] = useState(null); // { type: 'toggle' | 'delete', employee }
  const [busy, setBusy] = useState(false);
  const { data, loading, error, reload, setData } = useAsync(() => api.get('/admin/employees', { params: { search: q } }).then((r) => r.data), [q]);

  const changeView = (v) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* ignore */
    }
  };

  const employees = data?.employees || [];
  const open = (id) => navigate(`/admin/employees/${id}`);

  const runPending = async () => {
    if (!pending) return;
    const { type, employee } = pending;
    setBusy(true);
    try {
      if (type === 'delete') {
        const { data: res } = await api.delete(`/admin/employees/${employee._id}`);
        setData((d) => d && { ...d, count: d.count - 1, employees: d.employees.filter((x) => x._id !== employee._id) });
        toast.success(res.message);
      } else {
        const { data: res } = await api.patch(`/admin/employees/${employee._id}/status`, { isActive: !employee.isActive });
        setData((d) => d && { ...d, employees: d.employees.map((x) => (x._id === employee._id ? { ...x, isActive: res.employee.isActive } : x)) });
        toast.success(res.message);
      }
      setPending(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  const askToggle = (employee) => setPending({ type: 'toggle', employee });
  const askDelete = (employee) => setPending({ type: 'delete', employee });
  const pe = pending?.employee;

  return (
    <div>
      <PageHeader title="All employees" subtitle={data ? `${data.count} registered team member${data.count === 1 ? '' : 's'}` : 'Your registered team'} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            className="input pl-10"
            placeholder="Search by name or designation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search employees"
          />
        </div>
        <SegmentedControl
          value={view}
          onChange={changeView}
          layoutId="emp-view"
          options={[
            { value: 'grid', label: 'Cards', icon: LayoutGrid },
            { value: 'list', label: 'List', icon: List },
          ]}
        />
      </div>

      {loading && !data ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-72" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Couldn't load employees" message={error} action={<button className="btn-secondary" onClick={() => reload()}>Try again</button>} />
      ) : !employees.length ? (
        <EmptyState icon={Users} title={q ? 'No matches' : 'No employees yet'} message={q ? `Nobody matches "${q}".` : 'Employees appear here once they register and verify their email.'} />
      ) : (
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {view === 'grid' ? (
              <motion.ul
                key="grid"
                variants={listVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {employees.map((e) => (
                  <motion.li key={e._id} layout variants={itemVariants}>
                    <motion.button
                      type="button"
                      onClick={() => open(e._id)}
                      whileHover={{ y: -6 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-card transition-shadow hover:shadow-lift focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
                    >
                      <div className="relative bg-gradient-to-b from-brand-50 to-white p-3 pb-0">
                        <PassportPhoto src={e.photo?.url} name={e.fullName} className="mx-auto w-full max-w-[150px] shadow-sm ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-[1.03]" />
                        {!e.isActive && <span className="chip absolute right-2 top-2 bg-rose-100 text-rose-700">Inactive</span>}
                      </div>
                      <div className="p-3.5 text-center">
                        <p className="truncate font-display text-[15px] font-semibold text-slate-900">{e.fullName}</p>
                        <p className="truncate text-xs font-medium text-brand-700">{e.designation}</p>
                        <div className="mt-3 flex items-center justify-center gap-3 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
                          <span>
                            <b className="text-slate-800">{e.stats.totalTasks}</b> tasks
                          </span>
                          <span className="h-3 w-px bg-slate-200" />
                          <span>
                            <b className="text-slate-800">{e.stats.completionRate}%</b> done
                          </span>
                        </div>
                      </div>
                    </motion.button>
                    <EmployeeActions employee={e} onToggle={askToggle} onDelete={askDelete} className="mt-1.5 justify-center" />
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card overflow-hidden">
                <div className="hidden items-center gap-4 border-b border-slate-100 bg-slate-50 py-3 pl-5 pr-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:flex">
                  <div className="grid flex-1 grid-cols-[2fr_1.4fr_1.6fr_0.8fr_0.8fr_24px] gap-4">
                    <span>Employee</span>
                    <span>Designation</span>
                    <span>Contact</span>
                    <span>Tasks</span>
                    <span>Completion</span>
                    <span />
                  </div>
                  <span className="w-[76px] shrink-0 text-right">Actions</span>
                </div>
                <motion.ul variants={listVariants} initial="hidden" animate="show" className="divide-y divide-slate-100">
                  {employees.map((e) => (
                    <motion.li key={e._id} layout variants={itemVariants} className="flex items-center gap-2 pr-3 transition hover:bg-brand-50/40 md:gap-4">
                      <button
                        type="button"
                        onClick={() => open(e._id)}
                        className="grid min-w-0 flex-1 grid-cols-[1fr_auto] items-center gap-4 py-3 pl-5 text-left md:grid-cols-[2fr_1.4fr_1.6fr_0.8fr_0.8fr_24px]"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Avatar src={e.photo?.url} name={e.fullName} size="h-10 w-10" />
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-slate-900">{e.fullName}</span>
                            <span className="block truncate text-xs text-slate-500 md:hidden">{e.designation}</span>
                          </span>
                          {!e.isActive && <span className="chip bg-rose-100 text-rose-700">Inactive</span>}
                        </span>
                        <span className="hidden truncate text-sm text-slate-600 md:block">{e.designation}</span>
                        <span className="hidden min-w-0 text-xs text-slate-500 md:block">
                          <span className="block truncate">{e.email}</span>
                          <span className="block">+91 {e.mobile}</span>
                        </span>
                        <span className="hidden text-sm font-semibold text-slate-800 md:block">
                          {e.stats.totalTasks}
                          {e.stats.tasksToday > 0 && <span className="ml-1.5 text-[11px] font-medium text-brand-600">+{e.stats.tasksToday} today</span>}
                        </span>
                        <span className="hidden md:block">
                          <span className="block h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <span className={clsx('block h-full rounded-full bg-leaf-gradient')} style={{ width: `${e.stats.completionRate}%` }} />
                          </span>
                          <span className="mt-1 block text-[11px] font-semibold text-slate-500">{e.stats.completionRate}%</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </button>
                      <EmployeeActions employee={e} onToggle={askToggle} onDelete={askDelete} className="w-[76px] shrink-0 justify-end" />
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      )}

      <ConfirmModal
        open={Boolean(pending)}
        onClose={() => !busy && setPending(null)}
        onConfirm={runPending}
        busy={busy}
        tone={pending?.type === 'toggle' && !pe?.isActive ? 'primary' : 'danger'}
        title={
          pending?.type === 'delete' ? `Delete ${pe?.fullName}?` : pe?.isActive ? `Deactivate ${pe?.firstName}?` : `Activate ${pe?.firstName}?`
        }
        message={
          pending?.type === 'delete'
            ? `This permanently removes ${pe?.firstName}'s account, tasks, enquiries and photo. It cannot be undone — deactivate instead to keep their history.`
            : pe?.isActive
              ? 'They will be signed out and unable to log in until reactivated. Their task history is kept.'
              : 'They will be able to sign in and log tasks again.'
        }
        confirmLabel={pending?.type === 'delete' ? (busy ? 'Deleting…' : 'Delete permanently') : pe?.isActive ? 'Deactivate' : 'Activate'}
      />
    </div>
  );
}
