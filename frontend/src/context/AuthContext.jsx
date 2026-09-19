import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup axios defaults for cookies
  axios.defaults.withCredentials = true;
  // Use the live backend URL
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://emailauth-dhfg.onrender.com';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data);
      return { success: true };
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.requiresOTP) {
        return {
          success: false,
          requiresOTP: true,
          email: error.response.data.email,
          message: error.response.data.message
        };
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password });
      // Hum yahan setUser() nahi karenge kyunki abhi verify hona baaki hai
      return { 
        success: true, 
        requiresOTP: res.data.requiresOTP,
        email: res.data.email,
        message: res.data.message 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const res = await axios.post('/api/auth/verify-email', { email, otp });
      setUser(res.data); // OTP sahi hone ke baad user login ho jayega
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Verification failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
