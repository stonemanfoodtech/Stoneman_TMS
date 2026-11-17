import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip, NoChartData } from './ChartCard';
import { STATUS_STYLES, BRAND } from '../../lib/constants';
import { formatShort, formatMedium } from '../../lib/dates';

const axis = { fontSize: 11, fill: '#64748b' };

/** Daily task completion trend (area). Expects [{ date, total, completed }]. */
export function DailyTrendChart({ data, height = 280 }) {
  if (!data?.some((d) => d.total)) return <NoChartData />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND.lime} stopOpacity={0.45} />
            <stop offset="100%" stopColor={BRAND.lime} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gDone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND.green} stopOpacity={0.45} />
            <stop offset="100%" stopColor={BRAND.green} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShort} tick={axis} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip labelFormatter={formatMedium} />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area animationDuration={700} type="monotone" name="Tasks logged" dataKey="total" stroke="#98ab31" strokeWidth={2} fill="url(#gTotal)" />
        <Area animationDuration={700} type="monotone" name="Completed" dataKey="completed" stroke={BRAND.green} strokeWidth={2.5} fill="url(#gDone)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Designation-wise productivity: stacked statuses per designation. */
export function DesignationChart({ data, height = 300 }) {
  if (!data?.length) return <NoChartData />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="designation" tick={axis} tickLine={false} axisLine={false} interval={0} tickFormatter={(v) => (v.length > 14 ? `${v.slice(0, 13)}…` : v)} />
        <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(1,84,66,0.05)' }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar animationDuration={600} dataKey="Completed" stackId="s" fill={STATUS_STYLES.Completed.color} />
        <Bar animationDuration={600} dataKey="In Progress" stackId="s" fill={STATUS_STYLES['In Progress'].color} />
        <Bar animationDuration={600} dataKey="Pending" stackId="s" fill={STATUS_STYLES.Pending.color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Task status donut. Expects [{ status, count }]. */
export function StatusDonut({ data, height = 260, centerLabel = 'tasks' }) {
  const total = data?.reduce((s, d) => s + d.count, 0) || 0;
  if (!total) return <NoChartData />;
  return (
    <div>
      <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" innerRadius="62%" outerRadius="88%" paddingAngle={3} stroke="none">
            {data.map((d) => (
              <Cell key={d.status} fill={STATUS_STYLES[d.status]?.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold leading-none text-slate-900">{total}</span>
        <span className="mt-1 text-xs text-slate-500">{centerLabel}</span>
      </div>
      </div>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d) => (
          <li key={d.status} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ background: STATUS_STYLES[d.status]?.color }} />
            {d.status} <span className="font-semibold text-slate-900">{d.count}</span>
            <span className="text-slate-400">({Math.round((d.count / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Per-employee daily output (bars). Expects [{ date, total, completed }]. */
export function DailyOutputChart({ data, height = 220 }) {
  if (!data?.some((d) => d.total)) return <NoChartData />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShort} tick={axis} tickLine={false} axisLine={false} minTickGap={16} />
        <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip labelFormatter={formatMedium} />} cursor={{ fill: 'rgba(1,84,66,0.05)' }} />
        <Bar animationDuration={600} name="Logged" dataKey="total" fill="#cbd96c" radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Bar animationDuration={600} name="Completed" dataKey="completed" fill={BRAND.green} radius={[4, 4, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
