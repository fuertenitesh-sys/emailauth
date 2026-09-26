import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, LogOut, ArrowLeft, Plus, X } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '', discount: 0,
    category: '', images: [], stock: '', status: 'active'
  });

  useEffect(() => {
    axios.get('/api/admin/categories').then(r => setCategories(r.data)).catch(() => {});
    if (isEdit) {
      axios.get(`/api/admin/products`).then(r => {
        const p = r.data.find(x => x._id === id);
        if (p) setForm({ name: p.name, description: p.description, price: p.price, discount: p.discount, category: p.category?._id || '', images: p.images || [], stock: p.stock, status: p.status });
      }).catch(() => {});
    }
  }, [id]);

  const handleLogout = async () => { try { await axios.post('/api/admin/logout'); } catch {} navigate('/admin'); };

  const addImage = () => {
    if (imageInput.trim()) { setForm(p => ({ ...p, images: [...p.images, imageInput.trim()] })); setImageInput(''); }
  };

  const removeImage = (idx) => setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    const data = { ...form, price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock) };
    try {
      if (isEdit) { await axios.put(`/api/admin/products/${id}`, data); }
      else { await axios.post('/api/admin/products', data); }
      navigate('/admin/products');
    } catch (err) { setError(err.response?.data?.message || 'Failed to save product'); }
    finally { setSaving(false); }
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}><ArrowLeft size={16} /> Products</Link>
          <span style={{ color: 'var(--color-border)' }}>/</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{isEdit ? 'Edit Product' : 'Add Product'}</span>
        </div>

        <div className="admin-form-card">
          <h2 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          {error && <div className="auth-alert error" style={{ marginBottom: '1rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="input-group admin-form-full">
                <label className="input-label">Product Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required placeholder="Enter product name" />
              </div>
              <div className="input-group">
                <label className="input-label">Category *</label>
                <select className="input-field" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Price (₹) *</label>
                <input type="number" className="input-field" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} required min="0" step="0.01" placeholder="0.00" />
              </div>
              <div className="input-group">
                <label className="input-label">Discount (%)</label>
                <input type="number" className="input-field" value={form.discount} onChange={e => setForm(p => ({...p, discount: e.target.value}))} min="0" max="100" placeholder="0" />
              </div>
              <div className="input-group">
                <label className="input-label">Stock Quantity *</label>
                <input type="number" className="input-field" value={form.stock} onChange={e => setForm(p => ({...p, stock: e.target.value}))} required min="0" placeholder="0" />
              </div>
              <div className="input-group admin-form-full">
                <label className="input-label">Description *</label>
                <textarea className="input-field" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} required rows={4} style={{ resize: 'vertical' }} placeholder="Describe the product..." />
              </div>
              <div className="input-group admin-form-full">
                <label className="input-label">Product Images (URLs)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input className="input-field" value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="https://..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} style={{ flex: 1 }} />
                  <button type="button" className="btn btn-outline" onClick={addImage}><Plus size={16} /> Add</button>
                </div>
                {form.images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.375rem 0.625rem', fontSize: '0.8rem' }}>
                        <img src={img} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} onError={e => e.target.style.display='none'} />
                        <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }}>{img}</span>
                        <button type="button" onClick={() => removeImage(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', display: 'flex', padding: 0 }}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}</button>
              <Link to="/admin/products" className="btn btn-ghost">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
