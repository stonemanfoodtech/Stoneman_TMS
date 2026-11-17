import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/** Shown after an admin resets the password, until the employee picks their own. */
export default function PasswordNotice({ onAction }) {
  const { user } = useAuth();
  if (!user?.mustChangePassword) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold">You're using a temporary password</p>
          <p className="text-sm text-amber-800/80">Your admin reset it for you. Choose your own password to keep your account secure.</p>
        </div>
      </div>
      {onAction ? (
        <button type="button" onClick={onAction} className="btn-primary shrink-0">
          Change password
        </button>
      ) : (
        <Link to="/profile?change-password=1" className="btn-primary shrink-0">
          Change password
        </Link>
      )}
    </motion.div>
  );
}
