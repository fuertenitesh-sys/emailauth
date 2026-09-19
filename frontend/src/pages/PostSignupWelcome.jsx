import { useContext, useEffect, useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Effects.css'; 

const PostSignupWelcome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState('entering');
  
  const isLogin = location.state?.isLogin;

  useEffect(() => {
    // Stage 1: Animation finishes, trigger exit
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 2800);

    // Stage 2: Actually navigate
    const navTimer = setTimeout(() => {
      navigate('/effects', { replace: true });
    }, 3500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={`welcome-screen ${stage}`}>
      <div className="welcome-content">
        <div className="welcome-icon">✨</div>
        <h1 className="welcome-title">Welcome to EmailAuth, {user.name}!</h1>
        <p className="welcome-subtitle">
          {isLogin ? "You have successfully logged in." : "Your account has been created successfully."}
        </p>
        <p className="welcome-tagline">Let's make your experience unforgettable.</p>
        
        <div className="welcome-progress">
          <div className="welcome-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSignupWelcome;
