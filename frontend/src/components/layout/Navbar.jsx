import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Mail size={24} />
          </div>
          <span className="logo-text">EmailAuth</span>
        </Link>
        
        <nav className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/effects" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)' }}>
                <Sparkles size={18} /> Effects
              </Link>
              <button onClick={handleLogout} className="btn btn-outline nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut size={18} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log in</Link>
              <Link to="/signup" state={{ fromNavbar: true }} className="btn btn-primary nav-btn">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
