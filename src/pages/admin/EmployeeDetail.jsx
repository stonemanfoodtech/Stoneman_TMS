import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, KeyRound, CalendarHeart, CheckCircle2, CircleDashed, ClipboardList, Filter, Mail, MessageSquareText, Phone, Power, Trash2, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import PassportPhoto from '../../components/ui/PassportPhoto';
import DateRangeControl from '../../components/ui/DateRangeControl';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { Toggle } from '../../components/ui/Field';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import ResetPasswordForm from '../../components/auth/AdminResetPasswordForm';
import { EmptyState } from '../../components/ui/Misc';
import { FullPageLoader, SkeletonBlock } from '../../components/ui/Spinner';
import ChartCard from '../../components/charts/ChartCard';
import { DailyOutputChart, StatusDonut } from '../../components/charts/Charts';
import DayFeed from '../../components/tasks/DayFeed';
import api, { errorMessage } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatDob, formatMedium, presetRange } from '../../lib/dates';

function MiniKpi({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3.5">
      <div className={`mb-2 inline-flex rounded-lg p-1.5 ${tone}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="font-display text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="break-words text-sm font-medium text-slate-800">{value}</div>
      </div>
    </div>
  );
}

export default function EmployeeDetail() {
  const { id } = useParams();
  const [range, setRange] = useState(() => presetRange(30));
  const [status, setStatus] = useState('All');
  const [hasEnquiry, setHasEnquiry] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const profile = useAsync(() => api.get(`/admin/employees/${id}`).then((r) => r.data), [id]);
  const activity = useAsync(
    () => api.get(`/admin/employees/${id}/activity`, { params: { ...range, status, hasEnquiry } }).then((r) => r.data),
    [id, range.from, range.to, status, hasEnquiry]
  );

  if (profile.loading && !profile.data) return <FullPageLoader label="Loading employee…" />;
  if (profile.error)
    return (
      <EmptyState
        title="Employee not found"
        message={profile.error}
        action={
          <Link to="/admin/employees" className="btn-secondary">
            Back to all employees
          </Link>
        }
      />
    );

  const { employee: e, kpis } = profile.data;

  const resolveEnquiry = async (q) => {
    try {
      await api.patch(`/admin/enquiries/${q._id}`, { status: q.status === 'resolved' ? 'open' : 'resolved' });
      toast.success(q.status === 'resolved' ? 'Enquiry reopened' : 'Enquiry resolved');
      activity.reload({ silent: true });
      profile.reload({ silent: true });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const toggleActive = async () => {
    setToggling(true);
    try {
      const { data } = await api.patch(`/admin/employees/${id}/status`, { isActive: !e.isActive });
      toast.success(data.message);
      profile.setData((p) => ({ ...p, employee: data.employee }));
      setConfirmToggle(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setToggling(false);
    }
  };

  const deleteEmployee = async () => {
    setDeleting(true);
    try {
      const { data } = await api.delete(`/admin/employees/${id}`);
      toast.success(data.message);
      setConfirmDelete(false);
      navigate('/admin/employees', { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
      setDeleting(false);
    }
  };

  const a = activity.data?.analytics;
  const donutData = a ? Object.entries(a.statusCounts).map(([s, count]) => ({ status: s, count })) : [];

  return (
    <div>
      <Link to="/admin/employees" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> All employees
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(300px,35%)_1fr]">
        {/* Left: sticky profile panel (35%) */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="card overflow-hidden">
            <div className="relative h-24 bg-brand-gradient">
              <img src="/brand/stoneman-mark.png" alt="" className="absolute -right-4 -top-3 h-28 opacity-10" />
              <span className="absolute left-4 top-4 font-mono text-xs font-semibold text-lime-300">{e.employeeCode}</span>
            </div>
            <div className="h-1 bg-leaf-gradient" />
            <div className="px-5 pb-5">
              <PassportPhoto src={e.photo?.url} name={e.fullName} className="-mt-16 mx-auto w-32 shadow-lift ring-4 ring-white" rounded="rounded-2xl" />
              <div className="mt-3 text-center">
                <h1 className="text-xl font-semibold">{e.fullName}</h1>
                <p className="text-sm font-medium text-brand-700">{e.designation}</p>
                <div className="mt-2 flex justify-center gap-2">
                  {e.isActive ? <span className="chip bg-brand-50 text-brand-700">Active</span> : <span className="chip bg-rose-100 text-rose-700">Inactive</span>}
                </div>
              </div>

              <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                <Row icon={Mail} label="Email" value={e.email} />
                <Row icon={Phone} label="Mobile" value={`+91 ${e.mobile}`} />
                <Row icon={Briefcase} label="Designation" value={e.designation} />
                <Row icon={CalendarHeart} label="Date of birth" value={formatDob(e.dob)} />
                <Row icon={UserRound} label="Gender" value={e.gender} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <MiniKpi icon={ClipboardList} label="Total tasks" value={kpis.totalTasks} tone="bg-brand-100 text-brand-700" />
                <MiniKpi icon={CheckCircle2} label="Completed" value={`${kpis.completionRate}%`} tone="bg-lime-100 text-lime-600" />
                <MiniKpi icon={CircleDashed} label="Pending tasks" value={kpis.pending + kpis.inProgress} tone="bg-amber-100 text-amber-700" />
                <MiniKpi icon={MessageSquareText} label={`Enquiries (${kpis.openEnquiries} open)`} value={kpis.enquiries} tone="bg-sky-100 text-sky-700" />
              </div>
              {kpis.lastActiveDate && <p className="mt-3 text-center text-xs text-slate-500">Last activity: {formatMedium(kpis.lastActiveDate)}</p>}

              <div className="mt-4 grid gap-2">
                <button type="button" onClick={() => setResetOpen(true)} className="btn-secondary w-full">
                  <KeyRound className="h-4 w-4" /> Reset password
                </button>
                <button type="button" onClick={() => setConfirmToggle(true)} className={`w-full ${e.isActive ? 'btn-secondary text-rose-600' : 'btn-primary'}`}>
                  <Power className="h-4 w-4" /> {e.isActive ? 'Deactivate account' : 'Activate account'}
                </button>
                <button type="button" onClick={() => setConfirmDelete(true)} className="btn-danger w-full">
                  <Trash2 className="h-4 w-4" /> Delete employee
                </button>
              </div>
            </div>
          </motion.div>
        </aside>

        {/* Right: filters, analytics, feed (65%) */}
        <section className="min-w-0 space-y-6">
          <div className="card flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter className="h-4 w-4 text-brand-600" /> Filters
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <DateRangeControl from={range.from} to={range.to} onChange={setRange} />
              <SegmentedControl size="sm" options={['All', 'Completed', 'In Progress', 'Pending']} value={status} onChange={setStatus} layoutId="detail-status" />
              <Toggle id="detail-enq" checked={hasEnquiry} onChange={setHasEnquiry} label="Has enquiry" />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-5">
            <ChartCard title="Daily output" subtitle="Tasks logged vs completed" className="xl:col-span-3">
              {a ? <DailyOutputChart data={a.daily} /> : <SkeletonBlock className="h-[220px]" />}
            </ChartCard>
            <ChartCard title="Completion rate" subtitle={a ? `${a.totals.completionRate}% of ${a.totals.tasks} tasks` : 'Selected period'} className="xl:col-span-2">
              {a ? <StatusDonut data={donutData} height={180} /> : <SkeletonBlock className="h-[220px]" />}
            </ChartCard>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Day-wise tasks &amp; enquiries</h2>
            {activity.loading && !activity.data ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <SkeletonBlock key={i} className="h-20" />
                ))}
              </div>
            ) : activity.error ? (
              <EmptyState title="Couldn't load activity" message={activity.error} />
            ) : activity.data.days.length ? (
              <DayFeed key={`${range.from}${range.to}${status}${hasEnquiry}`} days={activity.data.days} onResolveEnquiry={resolveEnquiry} defaultOpen={3} />
            ) : (
              <EmptyState icon={ClipboardList} title="No activity for these filters" message="Try a wider date range or a different status." />
            )}
          </div>
        </section>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title={`Reset ${e.firstName}'s password`}
        description="Set a temporary password and share it with them privately. They'll be signed out and asked to choose their own."
      >
        <ResetPasswordForm employeeId={e._id} name={e.firstName} onDone={() => setResetOpen(false)} />
      </Modal>

      <ConfirmModal
        open={confirmToggle}
        onClose={() => setConfirmToggle(false)}
        onConfirm={toggleActive}
        busy={toggling}
        tone={e.isActive ? 'danger' : 'primary'}
        title={e.isActive ? `Deactivate ${e.firstName}?` : `Activate ${e.firstName}?`}
        message={e.isActive ? 'They will be signed out and unable to log in until reactivated. Their task history is kept.' : 'They will be able to sign in and log tasks again.'}
        confirmLabel={e.isActive ? 'Deactivate' : 'Activate'}
      />

      <ConfirmModal
        open={confirmDelete}
        onClose={() => !deleting && setConfirmDelete(false)}
        onConfirm={deleteEmployee}
        busy={deleting}
        tone="danger"
        title={`Delete ${e.fullName}?`}
        message={`This permanently removes ${e.firstName}'s account, all ${kpis.totalTasks} task${kpis.totalTasks === 1 ? '' : 's'}, ${kpis.enquiries} enquir${kpis.enquiries === 1 ? 'y' : 'ies'} and their photo. This cannot be undone — to keep their history, deactivate the account instead.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete permanently'}
      />
    </div>
  );
}
