import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ImagePlus, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Passport photo picker with a live 3.5:4.5 frame preview and face guide. */
export default function PhotoPicker({ file, onChange, error }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState('');
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = (candidate) => {
    if (!candidate) return;
    if (!TYPES.includes(candidate.type)) {
      setLocalError('Use a JPG, PNG or WEBP image.');
      return;
    }
    if (candidate.size > MAX_BYTES) {
      setLocalError('Photo must be 5 MB or smaller.');
      return;
    }
    setLocalError('');
    onChange(candidate);
  };

  const shownError = localError || error;

  return (
    <div>
      <span className="label">Passport size photo</span>
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files?.[0]);
          }}
          className={clsx(
            'group relative aspect-[35/45] w-[120px] shrink-0 overflow-hidden rounded-xl border-2 border-dashed transition',
            shownError ? 'border-rose-400 bg-rose-50' : dragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/50'
          )}
          aria-label={preview ? 'Change photo' : 'Upload photo'}
        >
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.img
                key={preview}
                src={preview}
                alt="Passport preview"
                className="h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.div key="empty" className="flex h-full flex-col items-center justify-center gap-2 px-2 text-slate-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ImagePlus className="h-7 w-7" />
                <span className="text-[11px] font-semibold leading-tight">Add photo</span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* face guide */}
          <svg viewBox="0 0 35 45" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <ellipse cx="17.5" cy="18" rx="9" ry="11.5" fill="none" stroke={preview ? 'rgba(255,255,255,.75)' : 'rgba(1,84,66,.25)'} strokeWidth="0.5" strokeDasharray="1.4 1" />
          </svg>
          {preview && (
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-brand-900/70 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
              <RefreshCw className="h-3 w-3" /> Change
            </span>
          )}
        </button>
        <div className="space-y-1.5 pt-1 text-xs text-slate-500">
          <p className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Camera className="h-4 w-4 text-brand-600" /> 3.5 × 4.5 cm portrait
          </p>
          <p>Front-facing, plain background, face inside the guide.</p>
          <p>JPG, PNG or WEBP · up to 5 MB.</p>
          <p className="text-slate-400">We auto-crop it to a passport frame around your face.</p>
          <button type="button" onClick={() => inputRef.current?.click()} className="pt-1 font-semibold text-brand-700 hover:text-brand-800">
            {preview ? 'Choose another photo' : 'Browse files'}
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {shownError && <p className="field-error">{shownError}</p>}
    </div>
  );
}
