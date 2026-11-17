import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage, fieldErrors } from '../../lib/api';
import { PasswordField, StrengthMeter } from '../ui/Field';
import Spinner from '../ui/Spinner';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

/** Signed-in password change. Calls onComplete({ token, user }) with the fresh session. */
export default function ChangePasswordForm({ onComplete, currentLabel = 'Current password' }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.currentPassword) next.currentPassword = 'Enter your current password.';
    if (form.newPassword.length < 8 || !/[A-Za-z]/.test(form.newPassword) || !/\d/.test(form.newPassword)) {
      next.newPassword = 'Use at least 8 characters with letters and numbers.';
    }
    if (form.newPassword !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const { data } = await api.patch('/auth/password', form);
      toast.success(data.message);
      setDone(true);
      setForm(EMPTY);
      onComplete?.(data);
    } catch (err) {
      setErrors({ ...fieldErrors(err), form: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600"
          >
            <CheckCircle2 className="h-9 w-9" />
          </motion.div>
          <h3 className="text-lg font-semibold">Password updated</h3>
          <p className="mt-1 text-sm text-slate-500">Other devices have been signed out.</p>
        </motion.div>
      ) : (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={submit} className="space-y-4" noValidate>
          <PasswordField label={currentLabel} name="currentPassword" autoComplete="current-password" value={form.currentPassword} onChange={set('currentPassword')} error={errors.currentPassword} />
          <div>
            <PasswordField label="New password" name="newPassword" autoComplete="new-password" value={form.newPassword} onChange={set('newPassword')} error={errors.newPassword} />
            <StrengthMeter password={form.newPassword} />
          </div>
          <PasswordField label="Confirm new password" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
          {errors.form && !errors.currentPassword && !errors.newPassword && !errors.confirmPassword && (
            <p className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">{errors.form}</p>
          )}
          <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
            {busy ? <Spinner className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
            Update password
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
