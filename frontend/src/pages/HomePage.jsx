import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, customer, login, logout } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Please enter an email');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email,
        name: name || 'Demo User'
      });
      login(res.data.customer, res.data.token);
      setLoading(false);
      navigate('/restaurants');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || 'Login failed. Check if backend is running.');
    }
  };

  return (
    <div className="page-container home-page">
      <div className="hero-banner">
        <h1>Welcome to QuickBite 🍕</h1>
        <p>Your instant campus and city food ordering platform.</p>
      </div>

      <div className="auth-box">
        {isAuthenticated ? (
          <div className="logged-in-card">
            <h2>Welcome back, {customer?.name}!</h2>
            <p><strong>Email:</strong> {customer?.email}</p>
            <div className="action-buttons">
              <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
              <Link to="/order" className="btn-secondary">Place an Order</Link>
              <button onClick={logout} className="btn-danger">Logout</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Customer Login</h2>
            <p className="subtext">Enter email to generate token and access protected order features.</p>
            
            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
            
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                placeholder="e.g. Diya Joshi"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address: *</label>
              <input
                type="email"
                placeholder="e.g. diya.joshi@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login & Get Token'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePage;
