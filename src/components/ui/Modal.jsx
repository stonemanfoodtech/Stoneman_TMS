import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

export default function Modal({ open, onClose, title, description, children, size = 'md', dismissible = true }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && dismissible && onClose?.();
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, dismissible, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
            onClick={() => dismissible && onClose?.()}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={clsx(
              'relative w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl',
              { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg', xl: 'sm:max-w-2xl' }[size]
            )}
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="h-1.5 bg-leaf-gradient" />
            <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-7">
              {(title || dismissible) && (
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    {title && <h2 className="text-lg font-semibold">{title}</h2>}
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                  </div>
                  {dismissible && (
                    <button type="button" onClick={onClose} className="btn-ghost -mr-2 -mt-1 p-2" aria-label="Close">
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', tone = 'danger', busy }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button type="button" className={tone === 'danger' ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={busy}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
