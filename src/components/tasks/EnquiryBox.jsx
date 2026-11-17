import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquareText, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../lib/api';
import { formatTime } from '../../lib/dates';
import { EnquiryBadge } from '../ui/Badges';
import Spinner from '../ui/Spinner';

/** "Enquiry / Operational Note" — queries, blockers or requests for the day. */
export default function EnquiryBox({ todaysEnquiries = [], onCreated }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (message.trim().length < 3) {
      setError('Write your enquiry or note (at least 3 characters).');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/enquiries', { message });
      toast.success(data.message);
      setMessage('');
      onCreated?.(data.enquiry);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Enquiry / Operational note</h2>
          <p className="text-xs text-slate-500">Queries, blockers or requests for the admin team</p>
        </div>
        <span className="rounded-xl bg-amber-50 p-2 text-amber-600">
          <MessageSquareText className="h-5 w-5" />
        </span>
      </div>
      <form onSubmit={submit}>
        <textarea
          className={`input min-h-[96px] resize-y ${error ? 'input-error' : ''}`}
          placeholder="e.g. Need 200 more PET bottles for tomorrow's Nimbupani run."
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Enquiry or operational note"
        />
        <div className="mt-1 flex items-center justify-between">
          {error ? <p className="field-error mt-0">{error}</p> : <span className="text-xs text-slate-400">{message.length}/2000</span>}
        </div>
        <button type="submit" className="btn-accent mt-3 w-full py-3" disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          Submit enquiry
        </button>
      </form>

      {todaysEnquiries.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Submitted today</p>
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {todaysEnquiries.map((q) => (
                <motion.li
                  key={q._id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
                >
                  <p className="whitespace-pre-line">{q.message}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{formatTime(q.createdAt)}</span>
                    <EnquiryBadge status={q.status} />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
}
