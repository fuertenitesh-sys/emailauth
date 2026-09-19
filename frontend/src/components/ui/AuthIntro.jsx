import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import './ui.css';

const AuthIntro = ({ onComplete }) => {
  const [stage, setStage] = useState('initial'); // 'initial', 'enter', 'exit'

  useEffect(() => {
    // Sequence the animation stages
    const enterTimer = setTimeout(() => {
      setStage('enter');
    }, 100);

    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, 2200); // Wait 2.1s before fading out

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800); // 2.8s total duration

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`auth-intro-container stage-${stage}`}>
      <div className="auth-intro-content">
        <div className="auth-intro-icon-wrapper">
          <Mail size={48} className="auth-intro-icon" />
        </div>
        <h1 className="auth-intro-title">Create your account</h1>
        <p className="auth-intro-subtitle">Secure. Simple. Yours.</p>
      </div>
    </div>
  );
};

export default AuthIntro;
