import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const navItems = [
    { name: 'Analytics', path: '/admin' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Bookings', path: '/admin/bookings' },
  ];

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'px-3 py-4 text-sm font-medium border-b-2 -mb-px transition-colors',
                  location.pathname === item.path
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <Outlet />
    </div>
  );
};

export default AdminDashboard; 