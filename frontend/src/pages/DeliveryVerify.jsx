import { useState } from 'react';
import axios from 'axios';
import { Package, ShieldCheck, CheckCircle } from 'lucide-react';

const DeliveryVerify = () => {
  const [orderId, setOrderId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setOrderData(null);

    try {
      const res = await axios.post(`/api/orders/${orderId}/verify-delivery-otp`, { otp });
      setSuccess(true);
      setOrderData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Check Order ID or OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '50%', marginBottom: '1rem' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Verify Delivery</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>Enter Order ID and OTP to confirm delivery.</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
            <h2 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.25rem' }}>Delivery Confirmed!</h2>
            <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', textAlign: 'left', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Order:</strong> #{orderData?._id?.slice(-8).toUpperCase()}</p>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Payment:</strong> <span style={{ color: orderData?.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{orderData?.paymentStatus.toUpperCase()}</span></p>
              <p style={{ fontSize: '0.875rem' }}><strong>Total:</strong> ₹{orderData?.totalAmount}</p>
            </div>
            <button 
              onClick={() => { setSuccess(false); setOrderId(''); setOtp(''); }}
              style={{ width: '100%', padding: '0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Verify Another Order
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify}>
            {error && <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#ef4444', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Order ID</label>
              <input 
                type="text" 
                value={orderId} 
                onChange={e => setOrderId(e.target.value)} 
                placeholder="Paste Order ID here"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Delivery OTP</label>
              <input 
                type="text" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                placeholder="6-digit OTP"
                required
                maxLength={6}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', letterSpacing: '4px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '0.875rem', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Verifying...' : 'Verify Delivery'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeliveryVerify;
