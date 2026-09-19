import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import PasswordInput from '../components/ui/PasswordInput';
import PasswordStrength from '../components/ui/PasswordStrength';
import LoadingButton from '../components/ui/LoadingButton';
import AuthIntro from '../components/ui/AuthIntro';
import './Auth.css';

const Signup = () => {
  const { signup, verifyEmail, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP States
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState(''); // State for name validation error
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Check if we should show intro (only if coming from Navbar)
  const [showIntro, setShowIntro] = useState(
    location.state && location.state.fromNavbar === true
  );

  const isSigningUpRef = useRef(false);

  useEffect(() => {
    // If intro was triggered, clear the location state immediately
    // so refreshing the page won't replay the animation
    if (showIntro && location.state?.fromNavbar) {
      window.history.replaceState({}, document.title);
    }
  }, [showIntro, location.state]);

  // Redirect if already logged in (but NOT if we are currently signing up)
  if (user && !isSigningUpRef.current) {
    return <Navigate to="/dashboard" />;
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setNameError('');
    setSuccessMsg('');

    // Frontend strict validation (must contain at least one letter)
    const nameRegex = /^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      setNameError('Name must contain letters');
      return;
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    const result = await signup(name, email, password);
    
    if (result.success && result.requiresOTP) {
      // Show the OTP screen
      setSuccessMsg(result.message);
      setShowOTP(true);
    } else if (result.success) {
      // Fallback if backend doesn't use OTP
      isSigningUpRef.current = true;
      navigate('/welcome', { replace: true });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setSuccessMsg('');

    if (otp.length < 6) {
      return setError('Please enter a valid 6-digit OTP');
    }

    setLoading(true);
    isSigningUpRef.current = true;
    
    const result = await verifyEmail(email, otp);
    
    if (result.success) {
      navigate('/welcome', { replace: true });
    } else {
      isSigningUpRef.current = false;
      setError(result.message);
    }
    
    setLoading(false);
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  if (showIntro) {
    return <AuthIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container">
        
        {!showOTP ? (
          <>
            <div className="auth-header">
              <div className="auth-logo">
                <Mail size={32} className="logo-icon-auth" />
              </div>
              <h2>Create an account</h2>
              <p>Join us today to get started.</p>
            </div>
            
            {error && (
              <div className="auth-alert error" role="alert">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="name">Full name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  className={`input-field ${nameError ? 'border-red-500 focus:border-red-500' : ''}`} 
                  placeholder="Jane Doe" 
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    const nameRegex = /^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/;
                    if (val && !nameRegex.test(val)) {
                      setNameError('Name must contain letters');
                    } else {
                      setNameError('');
                    }
                  }}
                  onBlur={(e) => {
                    // Real-time feedback on blur
                    const nameRegex = /^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/;
                    if (e.target.value && !nameRegex.test(e.target.value)) {
                      setNameError('Name must contain letters');
                    }
                  }}
                  required
                  autoComplete="name"
                />
                {nameError && (
                  <div className="validation-msg error animate-fade-in mt-1 text-red-500 text-sm">
                    {nameError}
                  </div>
                )}
              </div>
              
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
              
              <div className="input-group-auth">
                <PasswordInput
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password.length > 0 && <PasswordStrength password={password} />}
              </div>

              <div className="input-group-auth">
                <PasswordInput
                  id="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordsMatch && (
                  <div className="validation-msg success animate-fade-in">Passwords match</div>
                )}
                {passwordsMismatch && (
                  <div className="validation-msg error animate-fade-in">Passwords do not match</div>
                )}
              </div>
              
              <LoadingButton 
                type="submit" 
                className="btn-full btn-lg mt-4" 
                loading={loading}
                loadingText="Creating account..."
                disabled={passwordsMismatch}
              >
                Get Started
              </LoadingButton>
            </form>
            
            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login" className="auth-link font-semibold">Log in</Link>
              </p>
            </div>
          </>
        ) : (
          /* ==================================
             OTP VERIFICATION SCREEN 
             ================================== */
          <div className="otp-screen animate-fade-in">
            <div className="auth-header">
              <div className="auth-logo">
                <CheckCircle size={32} className="logo-icon-auth text-green-500" />
              </div>
              <h2>Verify your email</h2>
              <p>We sent a 6-digit code to <strong>{email}</strong></p>
            </div>

            {successMsg && (
              <div className="auth-alert success" role="alert">
                {successMsg}
              </div>
            )}

            {error && (
              <div className="auth-alert error" role="alert">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleOTPSubmit}>
              <div className="input-group text-center">
                <label className="input-label text-center" htmlFor="otp">Enter Verification Code</label>
                <input 
                  type="text" 
                  id="otp" 
                  name="otp"
                  className="input-field text-center text-2xl tracking-widest font-mono font-bold" 
                  placeholder="------" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  required
                  autoComplete="one-time-code"
                />
              </div>

              <LoadingButton 
                type="submit" 
                className="btn-full btn-lg mt-4" 
                loading={loading}
                loadingText="Verifying..."
                disabled={otp.length !== 6}
              >
                Verify & Continue
              </LoadingButton>
            </form>

            <div className="auth-footer mt-6">
              <button 
                type="button"
                className="text-slate-400 hover:text-white transition-colors text-sm flex items-center justify-center w-full gap-2"
                onClick={() => {
                  setShowOTP(false);
                  setError('');
                  setSuccessMsg('');
                }}
              >
                <ArrowLeft size={16} /> Back to Sign up
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Signup;
