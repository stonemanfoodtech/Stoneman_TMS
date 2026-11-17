import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, LogIn, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthShell from '../../components/auth/AuthShell';
import { Field, PasswordField } from '../../components/ui/Field';
import Spinner from '../../components/ui/Spinner';
import { errorMessage, fieldErrors } from '../../lib/api';
import { homePathFor, useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const goHome = (user) => {
    const from = location.state?.from;
    const allowed = from && (user.role === 'admin' ? from.startsWith('/admin') || from === '/profile' : !from.startsWith('/admin'));
    navigate(allowed ? from : homePathFor(user), { replace: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const user = await login(form.email.trim(), form.password);
      toast.success(`Welcome back, ${user.firstName}!`);
      goHome(user);
    } catch (err) {
      setErrors({ ...fieldErrors(err), form: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Sign in to Stoneman Ops" subtitle="Use your registered work email and password.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <Field
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="you@stonemanfoodtech.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
        />
        <div>
          <PasswordField
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
          />
          <div className="mt-2 text-right">
            <button type="button" onClick={() => setShowHelp((v) => !v)} className="text-xs font-semibold text-brand-700 hover:text-brand-800">
              Forgot password?
            </button>
          </div>
        </div>

        <AnimatePresence>
          {errors.form && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">
              {errors.form}
            </motion.p>
          )}
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900"
            >
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <p className="font-semibold">Forgot your password?</p>
                <p className="mt-0.5 text-brand-800/80">
                  Ask your admin or HR to reset it from the admin console. They'll give you a temporary password, and you'll choose your own after signing in.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        New to the team?{' '}
        <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
          Create your employee account
        </Link>
      </p>
    </AuthShell>
  );
}
