import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, CalendarHeart, KeyRound, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PassportPhoto from '../../components/ui/PassportPhoto';
import Modal from '../../components/ui/Modal';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import PasswordNotice from '../../components/ui/PasswordNotice';
import { formatDob } from '../../lib/dates';

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5">
      <span className="rounded-xl bg-white p-2 text-brand-600 shadow-sm">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="mt-0.5 break-words text-sm font-semibold text-slate-800">{children}</div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, setSession, refreshUser } = useAuth();
  const [params, setParams] = useSearchParams();
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    if (params.get('change-password')) {
      setResetOpen(true);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);
  // Always show the latest server copy (designation, photo, status may have changed since sign-in).
  useEffect(() => {
    refreshUser().catch(() => {
      /* keep the cached session; a 401 is handled globally */
    });
  }, [refreshUser]);

  if (!user) return null;

  const formattedMobile = user.mobile ? `+91 ${user.mobile.slice(0, 5)} ${user.mobile.slice(5)}` : '—';

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <PasswordNotice onAction={() => setResetOpen(true)} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        {/* ID card header */}
        <div className="relative overflow-hidden bg-brand-gradient px-6 pb-20 pt-6 text-white sm:px-8">
          <img src="/brand/stoneman-mark.png" alt="" className="pointer-events-none absolute -right-8 -top-6 h-52 opacity-10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/brand/stoneman-mark.png" alt="" className="h-9" />
              <div className="leading-none">
                <img src="/brand/stoneman-wordmark-white.png" alt="Stoneman" className="h-5" />
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-lime-300">Food and Beverages Pvt. Ltd.</p>
              </div>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">Employee ID card</span>
          </div>
        </div>
        <div className="h-1.5 bg-leaf-gradient" />

        <div className="relative px-6 pb-8 sm:px-8">
          <div className="-mt-20 flex flex-col items-center gap-5 sm:flex-row sm:items-end">
            <PassportPhoto src={user.photo?.url} name={user.fullName} className="w-36 shadow-lift ring-4 ring-white" rounded="rounded-2xl" />
            <div className="pb-1 text-center sm:text-left">
              <h1 className="text-2xl font-semibold sm:text-3xl">{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</h1>
              <p className="mt-0.5 font-medium text-brand-700">{user.designation}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="chip bg-slate-100 font-mono text-slate-700">{user.employeeCode}</span>
                {user.role === 'admin' && (
                  <span className="chip bg-lime-100 text-lime-600">
                    <ShieldCheck className="h-3.5 w-3.5" /> Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Detail icon={Mail} label="Email">
              {user.email}
            </Detail>
            <Detail icon={Phone} label="Mobile number">
              {formattedMobile}
            </Detail>
            <Detail icon={Briefcase} label="Designation">
              {user.designation || '—'}
            </Detail>
            <Detail icon={CalendarHeart} label="Date of birth">
              {formatDob(user.dob)}
            </Detail>
            <Detail icon={UserRound} label="Gender">
              {user.gender || '—'}
            </Detail>
            <Detail icon={ShieldCheck} label="Member since">
              {user.createdAt ? new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt)) : '—'}
            </Detail>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold">Password &amp; security</h2>
              <p className="text-sm text-slate-500">Confirm your current password, then choose a new one. Other devices will be signed out.</p>
            </div>
            <button type="button" className="btn-primary" onClick={() => setResetOpen(true)}>
              <KeyRound className="h-4 w-4" /> Change password
            </button>
          </div>
        </div>
      </motion.div>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Change password" description={user.mustChangePassword ? 'Enter the temporary password from your admin, then choose your own.' : 'Enter your current password, then choose a new one.'} size="md">
        <ChangePasswordForm
          currentLabel={user.mustChangePassword ? 'Temporary password' : 'Current password'}
          onComplete={(data) => {
            setSession(data);
            setTimeout(() => setResetOpen(false), 1400);
          }}
        />
      </Modal>
    </div>
  );
}
