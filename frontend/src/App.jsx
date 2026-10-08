import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import AnnouncementBar from './components/layout/AnnouncementBar';

// Auth pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PostSignupWelcome = lazy(() => import('./pages/PostSignupWelcome'));
import ProtectedRoute from './components/layout/ProtectedRoute';

// E-Commerce pages
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoryProducts = lazy(() => import('./pages/CategoryProducts'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const DeliveryVerify = lazy(() => import('./pages/DeliveryVerify'));

// Info pages
const ContactPage = lazy(() => import('./pages/info/ContactPage'));
const TrackOrderPage = lazy(() => import('./pages/info/TrackOrderPage'));
const StoresPage = lazy(() => import('./pages/info/StoresPage'));
const FaqPage = lazy(() => import('./pages/info/FaqPage'));
const SizeGuidePage = lazy(() => import('./pages/info/SizeGuidePage'));
const LegalPages = lazy(() => import('./pages/info/LegalPages'));
import { GiftCardsPage, StudentDiscountPage, PaymentMethodsPage } from './pages/info/SpecialtyPages';

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminAddCategory = lazy(() => import('./pages/admin/AdminAddCategory'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAddProduct = lazy(() => import('./pages/admin/AdminAddProduct'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers'));

import './App.css';

// Pages that hide Navbar/Footer
const ADMIN_PATHS = ['/admin'];

function App() {
  const isAdminPath = ADMIN_PATHS.some(p => window.location.pathname.startsWith(p));

  return (
    <div className="app-container">
      <ScrollToTop />
      {!isAdminPath && <AnnouncementBar />}
      {!isAdminPath && <Navbar />}
      <main className={isAdminPath ? '' : 'main-content'}>
        <Suspense fallback={<div className="page-loader"><div className="loading-spinner" /></div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/category/:id" element={<CategoryProducts />} />
            <Route path="/delivery-verify" element={<DeliveryVerify />} />

            {/* Protected user routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/welcome" element={<ProtectedRoute><PostSignupWelcome /></ProtectedRoute>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

            {/* Footer Info Routes */}
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/delivery-returns" element={<LegalPages />} />
            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/cookie-settings" element={<LegalPages />} />
            <Route path="/corporate" element={<LegalPages />} />
            <Route path="/student-discount" element={<StudentDiscountPage />} />
            <Route path="/terms" element={<LegalPages />} />
            <Route path="/gift-cards" element={<GiftCardsPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/accessibility" element={<LegalPages />} />
            <Route path="/cookie-policy" element={<LegalPages />} />
            <Route path="/privacy" element={<LegalPages />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/categories/add" element={<AdminAddCategory />} />
            <Route path="/admin/categories/edit/:id" element={<AdminAddCategory />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/add" element={<AdminAddProduct />} />
            <Route path="/admin/products/edit/:id" element={<AdminAddProduct />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/subscribers" element={<AdminSubscribers />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;
