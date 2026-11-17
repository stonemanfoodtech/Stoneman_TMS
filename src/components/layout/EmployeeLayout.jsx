import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedOutlet from './AnimatedOutlet';
import { IdCard, LayoutDashboard, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../ui/Logo';
import UserMenu from './UserMenu';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeLayout() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const links = [
    ...(isAdmin ? [{ to: '/admin/reports', label: 'Admin console', icon: ShieldCheck }] : [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }]),
    { to: '/profile', label: 'My profile', icon: IdCard },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink to={isAdmin ? '/admin/reports' : '/dashboard'} aria-label="Home">
            <Logo size="sm" />
          </NavLink>
          <nav className="hidden items-center gap-1 rounded-xl bg-slate-100 p-1 md:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className="relative rounded-lg px-3.5 py-1.5 text-sm font-semibold">
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="emp-nav" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                    <span className={clsx('relative z-10 flex items-center gap-1.5', isActive ? 'text-brand-800' : 'text-slate-500 hover:text-slate-800')}>
                      <Icon className="h-4 w-4" /> {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <UserMenu />
        </div>
        <nav className="flex gap-1 border-t border-slate-100 px-4 py-2 md:hidden">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx('flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold', isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-500')
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <AnimatedOutlet routeKey={location.pathname} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8" />
    </div>
  );
}
