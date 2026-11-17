import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { homePathFor, useAuth } from '../../context/AuthContext';
import { FullPageLoader } from '../ui/Spinner';

export function ProtectedRoute({ roles }) {
  const { user, booting } = useAuth();
  const location = useLocation();
  if (booting) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homePathFor(user)} replace />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, booting } = useAuth();
  if (booting) return <FullPageLoader />;
  if (user) return <Navigate to={homePathFor(user)} replace />;
  return <Outlet />;
}

export function HomeRedirect() {
  const { user, booting } = useAuth();
  if (booting) return <FullPageLoader />;
  return <Navigate to={user ? homePathFor(user) : '/login'} replace />;
}
