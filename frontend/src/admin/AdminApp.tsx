import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { getAuthToken } from '../api/client';

export default function AdminApp() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (pathname === '/admin/login') return <AdminLogin />;

  const logged = Boolean(getAuthToken());
  if (!logged) {
    if (typeof window !== 'undefined') window.location.pathname = '/admin/login';
    return null;
  }

  return <AdminDashboard />;
}
