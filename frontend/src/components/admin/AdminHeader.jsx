import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Bell, User, ShoppingBag, X, Sun, Moon, Mail } from 'lucide-react';
import '../../pages/admin/Admin.css';

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('adminDarkMode') === 'true');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('admin-dark');
      localStorage.setItem('adminDarkMode', 'true');
    } else {
      document.body.classList.remove('admin-dark');
      localStorage.setItem('adminDarkMode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    fetchNotifications();
    
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      // Get the last read timestamp from localStorage
      const lastRead = localStorage.getItem('adminNotificationsLastRead');
      const lastReadTime = lastRead ? parseInt(lastRead, 10) : 0;
      
      const [usersRes, ordersRes, subsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/orders'),
        axios.get('/api/subscribers')
      ]);
      
      const newNotifications = [];
      
      // Parse users
      usersRes.data.forEach(user => {
        const userTime = new Date(user.createdAt).getTime();
        if (userTime > lastReadTime) {
          newNotifications.push({
            id: `user-${user._id}`,
            type: 'user',
            message: `New user ${user.name} registered`,
            time: userTime,
            isUnread: true
          });
        }
      });
      
      // Parse orders
      ordersRes.data.forEach(order => {
        const orderTime = new Date(order.createdAt).getTime();
        if (orderTime > lastReadTime) {
          newNotifications.push({
            id: `order-${order._id}`,
            type: 'order',
            message: `New order #${order._id.slice(-6).toUpperCase()} placed`,
            time: orderTime,
            isUnread: true
          });
        }
        
        // Also check if cancelled recently (this is a simplified check, assuming updated recently to cancelled)
        if (order.orderStatus === 'cancelled') {
           const updateTime = new Date(order.updatedAt).getTime();
           if (updateTime > lastReadTime && updateTime > orderTime) {
             newNotifications.push({
               id: `order-cancel-${order._id}`,
               type: 'cancel',
               message: `Order #${order._id.slice(-6).toUpperCase()} was cancelled`,
               time: updateTime,
               isUnread: true
             });
           }
        }
      });
      
      // Parse subscribers
      if (subsRes && subsRes.data && subsRes.data.data) {
        subsRes.data.data.forEach(sub => {
          const subTime = new Date(sub.createdAt || sub.subscribedAt).getTime();
          if (subTime > lastReadTime) {
            newNotifications.push({
              id: `sub-${sub._id}`,
              type: 'subscriber',
              message: `New subscriber: ${sub.email}`,
              time: subTime,
              isUnread: true
            });
          }
        });
      }
      
      // Sort newest first
      newNotifications.sort((a, b) => b.time - a.time);
      
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const handleLogout = async () => {
    try { await axios.post('/api/admin/logout'); } catch {}
    navigate('/admin');
  };

  const handleBellClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && unreadCount > 0) {
      // Mark as read when opening
      setUnreadCount(0);
      localStorage.setItem('adminNotificationsLastRead', Date.now().toString());
      setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    }
  };

  const formatTime = (ms) => {
    const diff = Math.floor((Date.now() - ms) / 60000); // in minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <header className="admin-header">
      <h1 className="admin-title">{title}</h1>
      
      <div className="admin-header-actions">
        <button className="admin-icon-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Theme">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="admin-notification-wrapper" ref={dropdownRef}>
          <button className="admin-icon-btn" onClick={handleBellClick}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="admin-notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {isDropdownOpen && (
            <div className="admin-notification-dropdown">
              <div className="admin-notification-header">
                <h3>Notifications</h3>
                <span className="admin-notification-count">{notifications.length} Total</span>
              </div>
              
              <div className="admin-notification-list">
                {notifications.length === 0 ? (
                  <div className="admin-notification-empty">
                    <Bell size={32} style={{ color: 'var(--color-border)', marginBottom: '0.5rem' }} />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`admin-notification-item ${notif.isUnread ? 'unread' : ''}`}>
                      <div className={`admin-notification-icon bg-${notif.type}`}>
                        {notif.type === 'user' ? <User size={14} /> : 
                         notif.type === 'order' ? <ShoppingBag size={14} /> : 
                         notif.type === 'subscriber' ? <Mail size={14} /> : <X size={14} />}
                      </div>
                      <div className="admin-notification-content">
                        <p>{notif.message}</p>
                        <span>{formatTime(notif.time)}</span>
                      </div>
                      {notif.isUnread && <div className="admin-notification-dot"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="admin-header-divider"></div>
        
        <button onClick={handleLogout} className="admin-logout-btn">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
