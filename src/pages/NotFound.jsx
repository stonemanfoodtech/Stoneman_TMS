import { Link } from 'react-router-dom';
import { LogoMark } from '../components/ui/Logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <LogoMark className="h-16" />
      <p className="mt-6 font-display text-6xl font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-xl font-semibold">This page doesn't exist</h1>
      <p className="mt-1 text-sm text-slate-500">The link may be broken or the page may have moved.</p>
      <Link to="/" className="btn-primary mt-6">
        Go to my dashboard
      </Link>
    </div>
  );
}
