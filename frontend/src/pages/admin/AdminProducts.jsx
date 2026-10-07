import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Plus, Pencil, Trash2, Shield, LogOut, Package, Search } from 'lucide-react';
import './Admin.css';
import AdminNav from './AdminNav';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialFilter = searchParams.get('filter') || 'all';
  const [filter, setFilter] = useState(initialFilter); // 'all', 'in-stock', 'out-of-stock'
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setFilter(searchParams.get('filter') || 'all');
  }, [location.search]);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/admin/products');
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally { setLoading(false); }
  };


  const handleDelete = async () => {
    try { await axios.delete(`/api/admin/products/${deleting._id}`); setDeleting(null); fetchProducts(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="admin-page-bg">
      <AdminNav />
      <div className="admin-main-wrapper">
        <AdminHeader title="Products Management" />

        <div className="admin-action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <h2>Products</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>
                  <Search size={15} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="input-field" 
                  style={{ padding: '0.4rem 1rem 0.4rem 2.2rem', width: '250px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="input-field" 
                style={{ padding: '0.4rem 1rem', width: 'auto', minWidth: '150px' }} 
                value={filter} 
                onChange={e => navigate(e.target.value === 'all' ? '/admin/products' : `/admin/products?filter=${e.target.value}`)}
              >
                <option value="all">All Products</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Sold Out</option>
              </select>
            </div>
          </div>
          <Link to="/admin/products/add" className="btn btn-primary btn-sm"><Plus size={16} /> Add Product</Link>
        </div>

        <div className="admin-table-container">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Discount</th><th>Stock</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? null : products.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>No products yet. <Link to="/admin/products/add" style={{ color: 'var(--color-primary)' }}>Add one now.</Link></td></tr>
                ) : (
                  products.filter(p => {
                    if (filter === 'out-of-stock' && p.stock > 0) return false;
                    if (filter === 'in-stock' && p.stock === 0) return false;
                    
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      const matchName = p.name.toLowerCase().includes(query);
                      const matchCat = p.category?.name?.toLowerCase().includes(query);
                      if (!matchName && !matchCat) return false;
                    }
                    
                    return true;
                  }).map(p => (
                    <tr key={p._id} style={{ background: p.stock === 0 ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                      <td>{p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="admin-product-img" /> : <div className="admin-product-img-placeholder"><Package size={16} style={{ color: 'var(--color-border)' }} /></div>}</td>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                          {p.stock === 0 && <span style={{ fontSize: '0.65rem', background: 'var(--color-danger)', color: 'white', padding: '0.15rem 0.4rem', borderRadius: '4px', flexShrink: 0 }}>SOLD OUT</span>}
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{p.category?.name || '-'}</td>
                      <td style={{ fontWeight: 600 }}>₹{p.price.toFixed(2)}</td>
                      <td>{p.discount > 0 ? <span className="discount-badge">{p.discount}%</span> : '-'}</td>
                      <td>{p.stock === 0 ? <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>0</span> : p.stock}</td>
                      <td><span className={`admin-status-badge ${p.status === 'active' ? 'admin-status-active' : 'admin-status-inactive'}`}>{p.status}</span></td>
                      <td>
                        <div className="admin-table-actions">
                          <Link to={`/admin/products/edit/${p._id}`} state={{ product: p }} className="admin-table-action-btn edit"><Pencil size={15} /></Link>
                          <button className="admin-table-action-btn delete" onClick={() => setDeleting(p)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
