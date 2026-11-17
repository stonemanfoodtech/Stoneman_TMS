import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage, fieldErrors } from '../../lib/api';
import { Field } from '../ui/Field';
import StatusPicker from './StatusPicker';
import Spinner from '../ui/Spinner';

const EMPTY = { title: '', description: '', status: 'Pending' };

export default function TaskComposer({ onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrors({ title: 'Enter a task title.' });
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const { data } = await api.post('/tasks', form);
      toast.success('Task added for today');
      setForm(EMPTY);
      onCreated?.(data.task);
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Update your task</h2>
          <p className="text-xs text-slate-500">Added to today's log</p>
        </div>
        <span className="rounded-xl bg-brand-50 p-2 text-brand-700">
          <Plus className="h-5 w-5" />
        </span>
      </div>
      <div className="space-y-4">
        <Field
          label="Task title"
          name="title"
          placeholder="e.g. Batch QC check — Aam Ras line 2"
          maxLength={140}
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          error={errors.title}
        />
        <Field
          as="textarea"
          label="Description"
          name="description"
          placeholder="Details, quantities, people involved…"
          maxLength={2000}
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          error={errors.description}
        />
        <div>
          <span className="label">Status</span>
          <StatusPicker value={form.status} onChange={(status) => setForm((f) => ({ ...f, status }))} layoutId="composer-status" />
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          Add task
        </button>
      </div>
    </form>
  );
}
