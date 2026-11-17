import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeRedirect, ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';
import EmployeeLayout from './components/layout/EmployeeLayout';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/employee/Dashboard';
import Profile from './pages/employee/Profile';
import Reports from './pages/admin/Reports';
import Employees from './pages/admin/Employees';
import EmployeeDetail from './pages/admin/EmployeeDetail';
import Holidays from './pages/admin/Holidays';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* One shared EmployeeLayout so moving between Dashboard and Profile never remounts the shell. */}
      <Route element={<ProtectedRoute roles={['employee', 'admin']} />}>
        <Route element={<EmployeeLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route element={<ProtectedRoute roles={['employee']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="reports" replace />} />
          <Route path="reports" element={<Reports />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
          <Route path="holidays" element={<Holidays />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
