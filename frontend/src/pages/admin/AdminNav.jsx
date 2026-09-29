import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, Shield } from 'lucide-react';
import './Admin.css';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/users', label: 'Users', icon: Users },
];

const AdminNav = () => {
  const location = useLocation();
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-icon"><Shield size={24} /></div>
        <h1 className="admin-sidebar-title">Lumen Admin</h1>
      </div>
      <nav className="admin-nav">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`admin-nav-link ${location.pathname.startsWith(path) ? 'active' : ''}`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminNav;
