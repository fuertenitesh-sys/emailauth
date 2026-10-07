import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, Shield, Mail } from 'lucide-react';
import axios from 'axios';
import { adminCache } from '../../utils/adminCache';
import './Admin.css';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { 
    path: '/admin/products', 
    label: 'Products', 
    icon: Package,
    subItems: [
      { search: '?filter=in-stock', label: 'In Stock' },
      { search: '?filter=out-of-stock', label: 'Sold Out' }
    ]
  },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/subscribers', label: 'Subscribers', icon: Mail },
];

const AdminNav = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Prefetch all admin data in background so that clicking a tab is 100% instant
    if (!adminCache.users) axios.get('/api/admin/users').then(res => adminCache.users = res.data).catch(()=>{});
    if (!adminCache.orders) axios.get('/api/admin/orders').then(res => adminCache.orders = res.data).catch(()=>{});
    if (!adminCache.products) axios.get('/api/admin/products').then(res => adminCache.products = res.data).catch(()=>{});
    if (!adminCache.categories) axios.get('/api/admin/categories').then(res => adminCache.categories = res.data).catch(()=>{});
    if (!adminCache.subscribers) axios.get('/api/subscribers').then(res => adminCache.subscribers = res.data.data).catch(()=>{});
    if (!adminCache.stats) axios.get('/api/admin/stats').then(res => adminCache.stats = res.data).catch(()=>{});
  }, []);

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-icon"><Shield size={24} /></div>
        <h1 className="admin-sidebar-title">Lumen Admin</h1>
      </div>
      <nav className="admin-nav">
        {navItems.map(({ path, label, icon: Icon, subItems }) => {
          const isCurrentPath = location.pathname === path || location.pathname.startsWith(`${path}/`);
          return (
            <div key={path}>
              <Link
                to={path}
                className={`admin-nav-link ${isCurrentPath && (!subItems || !location.search) ? 'active' : ''}`}
              >
                <Icon size={18} /> {label}
              </Link>
              {subItems && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem', paddingLeft: '2.25rem' }}>
                  {subItems.map(sub => (
                    <Link 
                      key={sub.search} 
                      to={`${path}${sub.search}`} 
                      className={`admin-nav-link ${location.search === sub.search ? 'active' : ''}`} 
                      style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminNav;
