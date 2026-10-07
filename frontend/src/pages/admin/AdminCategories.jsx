import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Pencil, Trash2, Shield, LogOut } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';
import AdminHeader from '../../components/admin/AdminHeader';
import { adminCache } from '../../utils/adminCache';

const AdminCategories = () => {
  const [categories, setCategories] = useState(adminCache.categories || []);
  const [loading, setLoading] = useState(!adminCache.categories);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/admin/categories');
      adminCache.categories = res.data;
      setCategories(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally { setLoading(false); }
  };


  const handleDelete = async () => {
    if (!deleting) return;
    try { await axios.delete(`/api/admin/categories/${deleting._id}`); setDeleting(null); fetchCategories(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="admin-page-bg">
      <AdminNav />
      <div className="admin-main-wrapper">
        <AdminHeader title="Categories Management" />
        <div className="admin-action-bar">
          <h2>Categories ({categories.length})</h2>
          <Link to="/admin/categories/add" className="btn btn-primary btn-sm"><Plus size={16} /> Add Category</Link>
        </div>

            {/* Table */}
            <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>Image</th><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {loading ? null : categories.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>No categories yet. Create one above.</td></tr>
                      ) : (
                        categories.map(cat => (
                          <tr key={cat._id}>
                            <td>{cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="admin-product-img" /> : <div className="admin-product-img-placeholder" />}</td>
                            <td style={{ fontWeight: 600 }}>{cat.name}</td>
                            <td style={{ color: 'var(--color-text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.description || '-'}</td>
                            <td><span className={`admin-status-badge ${cat.status === 'active' ? 'admin-status-active' : 'admin-status-inactive'}`}>{cat.status}</span></td>
                            <td>
                              <div className="admin-table-actions">
                                <Link to={`/admin/categories/edit/${cat._id}`} state={{ category: cat }} className="admin-table-action-btn edit"><Pencil size={15} /></Link>
                                <button className="admin-table-action-btn delete" onClick={() => setDeleting(cat)}><Trash2 size={15} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
            </div>

        {/* Delete confirm */}
        {deleting && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3 className="modal-title">Delete Category</h3>
              <p className="admin-confirm-modal">Are you sure you want to delete <strong>{deleting.name}</strong>? This cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                <button className="btn btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
