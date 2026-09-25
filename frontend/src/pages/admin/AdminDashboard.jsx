import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, LogOut, Users, Clock, Mail } from 'lucide-react';
import '../Auth.css'; // Reuse some base styles if needed

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin');
      } else {
        setError('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/admin/logout');
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top, #1a0b2e 0%, #000000 100%)', color: 'white', padding: '2rem' }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10 pb-6" style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
              <Shield size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ background: 'linear-gradient(to right, #c4b5fd, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Command Center
            </h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Users size={24} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <h3 className="text-3xl font-bold">{users.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-semibold">Registered Users</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading intelligence data...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <th className="px-6 py-4 text-sm font-medium text-slate-300">User</th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-300">Contact</th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-300">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr 
                      key={user._id} 
                      className="transition-colors hover:bg-white/5"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 flex items-center gap-2">
                        <Mail size={14} className="text-slate-500" /> {user.email}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={14} /> {formatDate(user.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
