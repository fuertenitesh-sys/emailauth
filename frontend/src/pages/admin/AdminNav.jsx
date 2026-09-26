import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, LogOut, Shield } from 'lucide-react';
import axios from 'axios';
import './Admin.css';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/users', label: 'Users', icon: Users },
];

const AdminNav = ({ onLogout }) => {
  const location = useLocation();
  return (
    <nav className="admin-nav">
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          className={`admin-nav-link ${location.pathname.startsWith(path) ? 'active' : ''}`}
        >
          <Icon size={15} /> {label}
        </Link>
      ))}
    </nav>
  );
};

export default AdminNav;
