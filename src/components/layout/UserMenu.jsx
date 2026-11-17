import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, IdCard, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/PassportPhoto';

export default function UserMenu({ tone = 'light' }) {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-xl px-1.5 py-1 transition ${tone === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar src={user?.photo?.url} name={user?.fullName} />
        <span className="hidden text-left sm:block">
          <span className={`block text-sm font-semibold leading-tight ${tone === 'dark' ? 'text-white' : 'text-slate-800'}`}>{user?.firstName}</span>
          <span className={`block text-[11px] leading-tight ${tone === 'dark' ? 'text-brand-100/70' : 'text-slate-500'}`}>{user?.designation}</span>
        </span>
        <ChevronDown className={`h-4 w-4 ${tone === 'dark' ? 'text-brand-100' : 'text-slate-400'}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lift"
          >
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.fullName}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="my-1 h-px bg-slate-100" />
            <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <IdCard className="h-4 w-4 text-slate-400" /> My profile
            </Link>
            {isAdmin && (
              <Link to="/admin/reports" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <ShieldCheck className="h-4 w-4 text-slate-400" /> Admin console
              </Link>
            )}
            <button
              type="button"
              onClick={() => logout('You have been signed out.')}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
