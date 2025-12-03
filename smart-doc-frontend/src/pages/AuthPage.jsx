import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { API_BASE_URL } from '../config'; // Import it

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Signup
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // const API_URL = "http://localhost:8080/api/auth";
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    const endpoint = isLogin ? '/login' : '/signup';
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth${endpoint}`, formData);
      
      if (isLogin) {
        // LOGIN SUCCESS: Save session and go to dashboard
        localStorage.setItem('user_id', res.data.username); 
        navigate('/dashboard'); 
      } else {
        // SIGNUP SUCCESS: Stay here but switch to Login view
        setSuccessMsg("Account Created Successfully! Please Login.");
        setIsLogin(true); // Switch to login tab automatically
        setFormData({ username: '', password: '' }); // Clear form
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Check backend.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* --- NEW: TABS SECTION --- */}
        <div className="auth-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            <LogIn size={16} /> Login
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            <UserPlus size={16} /> Sign Up
          </button>
        </div>

        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-sub">
          {isLogin ? 'Enter your credentials to access.' : 'Register to start uploading docs.'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder="Username" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={18} color="#64748b" />
            <input 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {error && <div className="msg error">{error}</div>}
          {successMsg && <div className="msg success">{successMsg}</div>}

          <button type="submit" className="btn-auth">
            {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}