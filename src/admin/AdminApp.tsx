import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminApp() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (pathname === '/admin/login') return <AdminLogin />;

  const logged = localStorage.getItem('admin_logged_in') === '1';
  if (!logged) {
    // redirect to login
    if (typeof window !== 'undefined') window.location.pathname = '/admin/login';
    return null;
  }

  return <AdminDashboard />;
}
