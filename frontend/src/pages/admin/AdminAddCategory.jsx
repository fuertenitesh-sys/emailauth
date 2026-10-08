import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminAddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const location = useLocation();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(() => {
    if (isEdit && location.state?.category) {
      const c = location.state.category;
      return {
        name: c.name || '', description: c.description || '', imageUrl: c.imageUrl || '', status: c.status || 'active'
      };
    }
    return { name: '', description: '', imageUrl: '', status: 'active' };
  });

  useEffect(() => {
    if (isEdit && !location.state?.category) {
      axios.get('/api/admin/categories').then(r => {
        const c = r.data.find(x => x._id === id);
        if (c) setForm({ name: c.name, description: c.description, imageUrl: c.imageUrl, status: c.status });
      }).catch(() => {});
    }
  }, [id]);

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
      if (isEdit) { await axios.put(`/api/admin/categories/${id}`, form); }
      else { await axios.post('/api/admin/categories', form); }
      navigate('/admin/categories');
    } catch (err) { setError(err.response?.data?.message || 'Failed to save category'); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-page-bg">
      <AdminNav />
      <div className="admin-main-wrapper">
        <AdminHeader title={isEdit ? 'Edit Category' : 'Add Category'} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Link to="/admin/categories" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}><ArrowLeft size={16} /> Categories</Link>
          <span style={{ color: 'var(--color-border)' }}>/</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{isEdit ? 'Edit Category' : 'Add Category'}</span>
        </div>

        <div className="admin-split-layout" style={{ marginBottom: '2rem' }}>
          <div className="admin-form-card" style={{ maxWidth: '100%', marginBottom: 0 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>{isEdit ? 'Edit Category' : 'Add New Category'}</h3>
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
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}</button>
                <Link to="/admin/categories" className="btn btn-ghost">Cancel</Link>
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
      </div>
    </div>
  );
};

export default AdminAddCategory;
