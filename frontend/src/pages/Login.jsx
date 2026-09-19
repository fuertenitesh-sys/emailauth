import { useState, useContext, useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import PasswordInput from '../components/ui/PasswordInput';
import LoadingButton from '../components/ui/LoadingButton';
import './Auth.css';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLoggingInRef = useRef(false);

  // Redirect if already logged in (but not if currently logging in)
  if (user && !isLoggingInRef.current) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    isLoggingInRef.current = true;
    const result = await login(email, password);
    if (result.success) {
      navigate('/welcome', { state: { isLogin: true } });
    } else {
      isLoggingInRef.current = false;
      if (result.requiresOTP) {
        setError('Your email is not verified. Please go to Sign up and enter your details again to receive a new OTP.');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <Mail size={32} className="logo-icon-auth" />
          </div>
          <h2>Welcome back</h2>
          <p>Please enter your details to sign in.</p>
        </div>
        
        {error && (
          <div className="auth-alert error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className="input-field" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="auth-options">
            <label className="checkbox-container">
              <input type="checkbox" name="remember" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="auth-link">Forgot password?</a>
          </div>
          
          <LoadingButton 
            type="submit" 
            className="btn-full btn-lg mt-4" 
            loading={loading}
            loadingText="Signing In..."
          >
            Sign In
          </LoadingButton>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup" className="auth-link font-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
