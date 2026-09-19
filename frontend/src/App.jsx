import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PostSignupWelcome from './pages/PostSignupWelcome';
import EffectsExperience from './pages/EffectsExperience';
import ProtectedRoute from './components/layout/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/welcome" 
            element={
              <ProtectedRoute>
                <PostSignupWelcome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/effects" 
            element={
              <ProtectedRoute>
                <EffectsExperience />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
