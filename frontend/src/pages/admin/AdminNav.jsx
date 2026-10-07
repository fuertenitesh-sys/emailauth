import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, Shield, Mail } from 'lucide-react';
import axios from 'axios';
import { adminCache, setAdminCache } from '../../utils/adminCache';
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
    // Removed massive prefetch because it congests the network and blocks the main thread.
    // LocalStorage caching now handles instant zero-delay loading anyway!
  }, []);

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-icon"><Shield size={24} /></div>
        <h1 className="admin-sidebar-title">Lumen Admin <span style={{fontSize: '0.6rem', color: '#8b5cf6', verticalAlign: 'top'}}>v2</span></h1>
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
