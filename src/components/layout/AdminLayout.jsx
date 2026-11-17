import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedOutlet from './AnimatedOutlet';
import { CalendarDays, LineChart, LogOut, Users } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../ui/Logo';
import UserMenu from './UserMenu';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/PassportPhoto';

const NAV = [
  { to: '/admin/reports', label: 'Analytics Overview', icon: LineChart },
  { to: '/admin/employees', label: 'All Employees', icon: Users },
  { to: '/admin/holidays', label: 'Manage Holidays', icon: CalendarDays },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const section = NAV.find((n) => location.pathname.startsWith(n.to))?.to;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-brand-gradient p-5 text-white lg:flex">
        <Logo tone="light" size="md" className="px-2" />
        <p className="mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-200/60">Admin console</p>
        <nav className="mt-2 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = section === to;
            return (
              <NavLink key={to} to={to} className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold">
                {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/15" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                {active && <motion.span layoutId="admin-nav-bar" className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-lime-400" />}
                <Icon className={clsx('relative h-[18px] w-[18px]', active ? 'text-lime-300' : 'text-brand-200/70')} />
                <span className={clsx('relative', active ? 'text-white' : 'text-brand-100/75 hover:text-white')}>{label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <Avatar src={user?.photo?.url} name={user?.fullName} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.fullName}</p>
              <p className="truncate text-xs text-brand-100/70">{user?.email}</p>
            </div>
            <button type="button" onClick={() => logout('You have been signed out.')} className="rounded-lg p-2 text-brand-100 hover:bg-white/10" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Mobile / tablet top bar */}
        <header className="sticky top-0 z-30 bg-brand-gradient text-white lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Logo tone="light" size="sm" showTagline={false} />
            <UserMenu tone="dark" />
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-thin">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = section === to;
              return (
                <NavLink key={to} to={to} className="relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold">
                  {active && <motion.span layoutId="admin-nav-m" className="absolute inset-0 rounded-lg bg-white/15" />}
                  <Icon className={clsx('relative h-4 w-4', active ? 'text-lime-300' : 'text-brand-100/70')} />
                  <span className={clsx('relative', active ? 'text-white' : 'text-brand-100/80')}>{label}</span>
                </NavLink>
              );
            })}
          </nav>
        </header>

        <AnimatedOutlet routeKey={location.pathname} className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8" />
      </div>
    </div>
  );
}
