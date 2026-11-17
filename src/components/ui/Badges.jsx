import clsx from 'clsx';
import { STATUS_STYLES } from '../../lib/constants';

export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={clsx('chip', style.chip, className)}>
      <span className={clsx('h-1.5 w-1.5 rounded-full', style.dot)} />
      {status}
    </span>
  );
}

export function EnquiryBadge({ status }) {
  return status === 'resolved' ? (
    <span className="chip bg-slate-100 text-slate-600">Resolved</span>
  ) : (
    <span className="chip bg-amber-100 text-amber-800">Open</span>
  );
}
