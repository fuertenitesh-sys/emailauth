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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(p => ({...p, imageUrl: reader.result}));
      };
      reader.readAsDataURL(file);
    }
  };

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
      <AdminNav />
      <div className="admin-main-wrapper">
        <header className="admin-header" style={{ marginBottom: '2rem' }}>
          <h1 className="admin-title">Categories Management</h1>
          <button onClick={handleLogout} className="admin-logout-btn"><LogOut size={16} /> Logout</button>
        </header>

        <div className="admin-action-bar">
          <h2>Categories ({categories.length})</h2>
          <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={16} /> Add Category</button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="admin-split-layout" style={{ marginBottom: '2rem' }}>
            <div className="admin-form-card" style={{ maxWidth: '100%', marginBottom: 0 }}>
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
                  <label className="input-label">Image Upload</label>
                  <input type="file" accept="image/*" className="input-field" onChange={handleImageUpload} />
                  {form.imageUrl && <img src={form.imageUrl} alt="Preview" style={{ marginTop: '1rem', maxHeight: '150px', borderRadius: '4px', objectFit: 'contain' }} />}
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
          
          <div className="admin-preview-panel">
            <h3>Live Preview</h3>
            <div style={{ 
              position: 'relative', width: '100%', height: '240px', borderRadius: '16px', overflow: 'hidden', 
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              backgroundColor: '#f1f5f9'
            }}>
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.1em' }}>NO IMAGE</div>
              )}
              
              <div style={{ 
                position: 'absolute', inset: 0, 
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', 
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem', textAlign: 'left' 
              }}>
                <span className={`admin-status-badge ${form.status === 'active' ? 'admin-status-active' : 'admin-status-inactive'}`} style={{ alignSelf: 'flex-start', marginBottom: 'auto', background: form.status === 'active' ? 'rgba(22, 163, 74, 0.9)' : 'rgba(220, 38, 38, 0.9)', color: 'white', border: 'none' }}>
                  {form.status}
                </span>
                <h4 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  {form.name || 'Category Name'}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  {form.description || 'Premium category description will appear here. Add details to see it.'}
                </p>
              </div>
            </div>
          </div>
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
