import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Phone, UserPlus, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthShell from '../../components/auth/AuthShell';
import PhotoPicker from '../../components/auth/PhotoPicker';
import { Field, PasswordField, StrengthMeter } from '../../components/ui/Field';
import Spinner from '../../components/ui/Spinner';
import api, { errorMessage, fieldErrors } from '../../lib/api';
import { DESIGNATIONS, GENDERS } from '../../lib/constants';
import { addDays, todayKey } from '../../lib/dates';
import { useAuth } from '../../context/AuthContext';

const INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  designation: '',
  customDesignation: '',
  dob: '',
  gender: '',
  password: '',
  confirmPassword: '',
};

function validate(form, photo) {
  const e = {};
  if (!form.firstName.trim()) e.firstName = 'Enter your first name.';
  if (!form.lastName.trim()) e.lastName = 'Enter your last name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
  const digits = form.mobile.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').replace(/^0/, '');
  if (!/^[6-9]\d{9}$/.test(digits)) e.mobile = 'Enter a valid 10-digit mobile number.';
  if (!form.designation) e.designation = 'Select your designation.';
  if (form.designation === 'Other') {
    const custom = form.customDesignation.trim();
    if (custom.length < 2) e.customDesignation = 'Type your designation.';
    else if (custom.length > 60) e.customDesignation = 'Keep it under 60 characters.';
  }
  if (!form.dob) e.dob = 'Enter your date of birth.';
  if (!form.gender) e.gender = 'Select a gender.';
  if (!photo) e.photo = 'Upload a passport size photo.';
  if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) e.password = 'Use at least 8 characters with letters and numbers.';
  if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
  return e;
}

export default function Register() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState(INITIAL);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const pickDesignation = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, designation: value, customDesignation: value === 'Other' ? f.customDesignation : '' }));
    setErrors((x) => ({ ...x, designation: undefined, customDesignation: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const clientErrors = validate(form, photo);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    const { customDesignation, ...fields } = form;
    const designation = form.designation === 'Other' ? customDesignation.trim().replace(/\s+/g, ' ') : form.designation;
    const body = new FormData();
    Object.entries({ ...fields, designation }).forEach(([k, v]) => body.append(k, typeof v === 'string' ? v.trim() : v));
    body.set('password', form.password);
    body.set('confirmPassword', form.confirmPassword);
    body.append('photo', photo);

    setBusy(true);
    try {
      const { data } = await api.post('/auth/register', body);
      setSession(data);
      toast.success(`Welcome to Stoneman, ${data.user.firstName}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const fe = fieldErrors(err);
      // A server-side designation error refers to the typed text when "Other" is selected.
      if (form.designation === 'Other' && fe.designation) {
        fe.customDesignation = fe.designation;
        delete fe.designation;
      }
      setErrors(fe);
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell wide title="Create your employee account" subtitle="Register once with your work details and passport photo. You'll be signed in straight away.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <PhotoPicker file={photo} onChange={(f) => { setPhoto(f); setErrors((x) => ({ ...x, photo: undefined })); }} error={errors.photo} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" name="firstName" icon={UserRound} autoComplete="given-name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
          <Field label="Last name" name="lastName" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} />
          <Field label="Email address" name="email" type="email" icon={Mail} autoComplete="email" placeholder="you@stonemanfoodtech.com" value={form.email} onChange={set('email')} error={errors.email} />
          <Field label="Mobile number" name="mobile" type="tel" icon={Phone} autoComplete="tel" placeholder="98765 43210" value={form.mobile} onChange={set('mobile')} error={errors.mobile} />
          <Field as="select" label="Designation" name="designation" icon={Briefcase} value={form.designation} onChange={pickDesignation} error={errors.designation} hint={form.designation === 'Other' ? 'Not listed? Type it below.' : undefined}>
            <option value="">Select designation</option>
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Field>
          {form.designation === 'Other' && (
            <Field
              className="sm:order-last sm:col-span-2"
              label="Your designation"
              name="customDesignation"
              icon={Briefcase}
              placeholder="e.g. Brand Ambassador"
              maxLength={60}
              autoFocus
              value={form.customDesignation}
              onChange={set('customDesignation')}
              error={errors.customDesignation}
            />
          )}
          <Field label="Date of birth" name="dob" type="date" max={addDays(todayKey(), -18 * 365)} value={form.dob} onChange={set('dob')} error={errors.dob} />
        </div>

        <div>
          <span className="label">Gender</span>
          <div className="grid grid-cols-3 gap-2">
            {GENDERS.map((g) => (
              <label
                key={g}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  form.gender === g ? 'border-brand-500 bg-brand-50 text-brand-800 ring-4 ring-brand-500/10' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={set('gender')} className="sr-only" />
                {g}
              </label>
            ))}
          </div>
          {errors.gender && <p className="field-error">{errors.gender}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <PasswordField name="password" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} />
            <StrengthMeter password={form.password} />
          </div>
          <PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        </div>

        <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {busy ? 'Uploading photo & creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
