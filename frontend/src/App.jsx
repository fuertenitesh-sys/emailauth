import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PostSignupWelcome from './pages/PostSignupWelcome';
import ProtectedRoute from './components/layout/ProtectedRoute';

// E-Commerce pages
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CategoryProducts from './pages/CategoryProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminOrders from './pages/admin/AdminOrders';

import './App.css';

// Pages that hide Navbar/Footer
const ADMIN_PATHS = ['/admin'];

function App() {
  const isAdminPath = ADMIN_PATHS.some(p => window.location.pathname.startsWith(p));

  return (
    <div className="app-container">
      {!isAdminPath && <Navbar />}
      <main className={isAdminPath ? '' : 'main-content'}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:id" element={<CategoryProducts />} />

          {/* Protected user routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/welcome" element={<ProtectedRoute><PostSignupWelcome /></ProtectedRoute>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/products/edit/:id" element={<AdminAddProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;
