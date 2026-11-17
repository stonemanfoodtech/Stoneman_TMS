import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, Download, MessageSquareText, RefreshCw, Trophy, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import ChartCard from '../../components/charts/ChartCard';
import { DailyTrendChart, DesignationChart, StatusDonut } from '../../components/charts/Charts';
import DateRangeControl from '../../components/ui/DateRangeControl';
import { EmptyState, KpiCard, PageHeader } from '../../components/ui/Misc';
import { SkeletonBlock } from '../../components/ui/Spinner';
import Spinner from '../../components/ui/Spinner';
import { Avatar } from '../../components/ui/PassportPhoto';
import api, { errorMessage } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatMedium, presetRange, relativeDayLabel } from '../../lib/dates';
import { filenameFromDisposition, saveBlob } from '../../lib/download';

export default function Reports() {
  const [range, setRange] = useState(() => presetRange(30));
  const [exporting, setExporting] = useState(false);
  const { data, loading, error, reload } = useAsync(() => api.get('/admin/reports', { params: range }).then((r) => r.data), [range.from, range.to]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await api.get('/admin/reports/export', { params: range, responseType: 'blob' });
      saveBlob(res.data, filenameFromDisposition(res.headers['content-disposition'], `stoneman-report_${range.from}_to_${range.to}.csv`));
      toast.success('Report downloaded');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not export the report.'));
    } finally {
      setExporting(false);
    }
  };

  const resolve = async (enquiry) => {
    try {
      await api.patch(`/admin/enquiries/${enquiry._id}`, { status: 'resolved' });
      toast.success('Enquiry resolved');
      reload({ silent: true });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const k = data?.kpis;

  return (
    <div>
      <PageHeader
        title="Analytics overview"
        subtitle={`Company-wide performance · ${formatMedium(range.from)} – ${formatMedium(range.to)}`}
        actions={
          <>
            <DateRangeControl from={range.from} to={range.to} onChange={setRange} />
            <button type="button" className="btn-secondary px-3" onClick={() => reload()} aria-label="Refresh">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" className="btn-primary" onClick={exportCsv} disabled={exporting}>
              {exporting ? <Spinner className="h-4 w-4" /> : <Download className="h-4 w-4" />} Export report to CSV
            </button>
          </>
        }
      />

      {error && !data ? (
        <EmptyState title="Couldn't load analytics" message={error} action={<button className="btn-secondary" onClick={() => reload()}>Try again</button>} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {loading && !data ? (
              [0, 1, 2, 3].map((i) => <SkeletonBlock key={i} className="h-[118px]" />)
            ) : (
              <>
                <KpiCard index={0} icon={Users} label="Registered employees" value={k.totalEmployees} hint={`${k.activeEmployees} active accounts`} />
                <KpiCard index={1} icon={Activity} label="Active today" value={k.activeToday} tone="teal" hint={k.totalEmployees ? `${Math.round((k.activeToday / k.totalEmployees) * 100)}% of the team` : '—'} />
                <KpiCard index={2} icon={CheckCircle2} label="Task completion rate" value={`${k.completionRate}%`} tone="lime" hint={`${k.completed} of ${k.totalTasks} tasks`} />
                <KpiCard index={3} icon={MessageSquareText} label="Total enquiries" value={k.totalEnquiries} tone="amber" hint={`${k.openEnquiries} open right now`} />
              </>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <ChartCard title="Daily task completion trend" subtitle="Tasks logged vs completed per day" className="xl:col-span-2">
              {data ? <DailyTrendChart data={data.dailyTrend} /> : <SkeletonBlock className="h-[280px]" />}
            </ChartCard>
            <ChartCard title="Task status breakdown" subtitle="All tasks in the selected period">
              {data ? <StatusDonut data={data.statusBreakdown} /> : <SkeletonBlock className="h-[280px]" />}
            </ChartCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <ChartCard title="Designation-wise productivity" subtitle="Task distribution by role and status" className="xl:col-span-2">
              {data ? <DesignationChart data={data.byDesignation} /> : <SkeletonBlock className="h-[300px]" />}
              {data?.byDesignation.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {data.byDesignation.slice(0, 6).map((d) => (
                    <div key={d.designation} className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="truncate text-xs font-semibold text-slate-700">{d.designation}</p>
                      <p className="text-[11px] text-slate-500">
                        {d.employees} staff · {d.total} tasks · <span className="font-semibold text-brand-700">{d.completionRate}% done</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ChartCard>

            <ChartCard title="Top performers" subtitle="Most tasks completed in this period" actions={<Trophy className="h-5 w-5 text-lime-500" />}>
              {data?.topPerformers.length ? (
                <ol className="space-y-2">
                  {data.topPerformers.map((p, i) => (
                    <motion.li key={p._id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/admin/employees/${p._id}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50">
                        <span className="w-5 text-center font-display text-sm font-semibold text-slate-400">{i + 1}</span>
                        <Avatar src={p.photo} name={p.name} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
                          <p className="truncate text-xs text-slate-500">{p.designation}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-brand-700">{p.completed}</p>
                          <p className="text-[10px] text-slate-400">{p.completionRate}%</p>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ol>
              ) : data ? (
                <p className="py-10 text-center text-sm text-slate-400">No completed tasks yet.</p>
              ) : (
                <SkeletonBlock className="h-[260px]" />
              )}
            </ChartCard>
          </div>

          <ChartCard title="Open enquiries" subtitle="Latest queries and blockers raised by employees">
            {data?.recentEnquiries.length ? (
              <ul className="divide-y divide-slate-100">
                {data.recentEnquiries.map((q) => (
                  <li key={q._id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <Avatar src={q.user?.photo} name={`${q.user?.firstName || ''} ${q.user?.lastName || ''}`} />
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700">{q.message}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {q.user ? (
                            <Link to={`/admin/employees/${q.user._id}`} className="font-semibold text-slate-600 hover:text-brand-700">
                              {q.user.firstName} {q.user.lastName}
                            </Link>
                          ) : (
                            'Unknown'
                          )}{' '}
                          · {q.user?.designation} · {relativeDayLabel(q.workDate)}
                        </p>
                      </div>
                    </div>
                    <button type="button" className="btn-secondary shrink-0 px-3 py-1.5 text-xs" onClick={() => resolve(q)}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark resolved
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">{data ? 'No open enquiries. All clear!' : 'Loading…'}</p>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
}
