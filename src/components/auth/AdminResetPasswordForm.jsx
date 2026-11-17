import { useState } from 'react';
import { Copy, KeyRound, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage, fieldErrors } from '../../lib/api';
import { Field } from '../ui/Field';
import Spinner from '../ui/Spinner';

/** Readable temporary password, e.g. "Mango-4827-Leaf" (letters + digits, no confusing characters). */
function generatePassword() {
  const words = ['Mango', 'Lime', 'Leaf', 'Sprout', 'Fresh', 'Juice', 'Green', 'Rasa', 'Sip', 'Fruit'];
  const rand = new Uint32Array(3);
  crypto.getRandomValues(rand);
  const pick = (n) => words[n % words.length];
  return `${pick(rand[0])}-${String(1000 + (rand[1] % 9000))}-${pick(rand[2] >> 3)}`;
}

export default function AdminResetPasswordForm({ employeeId, name, onDone }) {
  const [password, setPassword] = useState(generatePassword);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed — select the text and copy it manually.');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setErrors({ password: 'Use at least 8 characters with letters and numbers.' });
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const { data } = await api.patch(`/admin/employees/${employeeId}/password`, { password, confirmPassword: password });
      toast.success(data.message, { duration: 6000 });
      onDone?.();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <Field
          label="Temporary password"
          name="tempPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="off"
          spellCheck={false}
          className="[&_input]:font-mono"
        />
        <div className="mt-2 flex gap-2">
          <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={() => setPassword(generatePassword())}>
            <Wand2 className="h-3.5 w-3.5" /> Generate new
          </button>
          <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={copy}>
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
      </div>
      <p className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
        Share this with {name} in person or by phone. It works only until they sign in and choose their own password.
      </p>
      <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
        {busy ? <Spinner className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
        Set temporary password
      </button>
    </form>
  );
}
