import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Pencil, Trash2, Shield, LogOut, Package } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/admin/products');
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally { setLoading(false); }
  };

  const handleLogout = async () => { try { await axios.post('/api/admin/logout'); } catch {} navigate('/admin'); };

  const handleDelete = async () => {
    try { await axios.delete(`/api/admin/products/${deleting._id}`); setDeleting(null); fetchProducts(); }
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
          <h2>Products ({products.length})</h2>
          <Link to="/admin/products/add" className="btn btn-primary btn-sm"><Plus size={16} /> Add Product</Link>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}><div className="loading-spinner" style={{ margin: '0 auto' }} /></div>
          ) : products.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No products yet. <Link to="/admin/products/add" style={{ color: 'var(--color-primary)' }}>Add one now.</Link></div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Discount</th><th>Stock</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>{p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="admin-product-img" /> : <div className="admin-product-img-placeholder"><Package size={16} style={{ color: 'var(--color-border)' }} /></div>}</td>
                      <td style={{ fontWeight: 600, maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{p.category?.name || '-'}</td>
                      <td style={{ fontWeight: 600 }}>₹{p.price.toFixed(2)}</td>
                      <td>{p.discount > 0 ? <span className="discount-badge">{p.discount}%</span> : '-'}</td>
                      <td>{p.stock === 0 ? <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>0</span> : p.stock}</td>
                      <td><span className={`admin-status-badge ${p.status === 'active' ? 'admin-status-active' : 'admin-status-inactive'}`}>{p.status}</span></td>
                      <td>
                        <div className="admin-table-actions">
                          <Link to={`/admin/products/edit/${p._id}`} className="admin-table-action-btn edit"><Pencil size={15} /></Link>
                          <button className="admin-table-action-btn delete" onClick={() => setDeleting(p)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {deleting && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3 className="modal-title">Delete Product</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Delete <strong>{deleting.name}</strong>? This cannot be undone.</p>
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

export default AdminProducts;
