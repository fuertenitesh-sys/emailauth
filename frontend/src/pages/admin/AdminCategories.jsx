import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Pencil, Trash2, Shield, LogOut } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', status: 'active' });
  const navigate = useNavigate();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/admin/categories');
      setCategories(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally { setLoading(false); }
  };

  const handleLogout = async () => { try { await axios.post('/api/admin/logout'); } catch {} navigate('/admin'); };

  const openAdd = () => { setForm({ name: '', description: '', imageUrl: '', status: 'active' }); setEditing(null); setError(''); setShowForm(true); };
  const openEdit = (cat) => { setForm({ name: cat.name, description: cat.description, imageUrl: cat.imageUrl, status: cat.status }); setEditing(cat); setError(''); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editing) { await axios.put(`/api/admin/categories/${editing._id}`, form); }
      else { await axios.post('/api/admin/categories', form); }
      setShowForm(false);
      fetchCategories();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try { await axios.delete(`/api/admin/categories/${deleting._id}`); setDeleting(null); fetchCategories(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="admin-page-bg">
      <div className="admin-container">
        <header className="admin-header">
          <div className="admin-header-title-container">
            <div className="admin-header-icon"><Shield size={24} /></div>
            <h1 className="admin-title">Admin Panel</h1>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn"><LogOut size={16} /> Logout</button>
        </header>

        <AdminNav />

        <div className="admin-action-bar">
          <h2>Categories ({categories.length})</h2>
          <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={16} /> Add Category</button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="admin-form-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>{editing ? 'Edit Category' : 'Add New Category'}</h3>
            {error && <div className="auth-alert error" style={{ marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="input-group">
                  <label className="input-label">Name *</label>
                  <input className="input-field" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select className="input-field" value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="input-group admin-form-full">
                  <label className="input-label">Image URL</label>
                  <input className="input-field" value={form.imageUrl} onChange={e => setForm(p => ({...p, imageUrl: e.target.value}))} placeholder="https://..." />
                </div>
                <div className="input-group admin-form-full">
                  <label className="input-label">Description</label>
                  <textarea className="input-field" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={3} style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="admin-table-container">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}><div className="loading-spinner" style={{ margin: '0 auto' }} /></div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No categories yet. Create one above.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Image</th><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat._id}>
                      <td>{cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="admin-product-img" /> : <div className="admin-product-img-placeholder" />}</td>
                      <td style={{ fontWeight: 600 }}>{cat.name}</td>
                      <td style={{ color: 'var(--color-text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.description || '-'}</td>
                      <td><span className={`admin-status-badge ${cat.status === 'active' ? 'admin-status-active' : 'admin-status-inactive'}`}>{cat.status}</span></td>
                      <td>
                        <div className="admin-table-actions">
                          <button className="admin-table-action-btn edit" onClick={() => openEdit(cat)}><Pencil size={15} /></button>
                          <button className="admin-table-action-btn delete" onClick={() => setDeleting(cat)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
