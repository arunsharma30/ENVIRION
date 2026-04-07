import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../services/backend';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginAPI(email, password);
      login(data.token, data.user);
      navigate('/analyst');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"></div>
      <div className="auth-grid-lines"></div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="logo-icon">🌿</div>
              EN<span className="dot">virion</span>
            </Link>
            <div className="auth-govt-badge">
              Government Digital Twin Platform
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your municipality account to access the environmental intelligence dashboard.</p>
          </div>
          <div className="auth-body">
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="auth-form-group">
                <label className="auth-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  className="auth-input"
                  placeholder="municipality@government.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <input
                  id="login-password"
                  type="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <button
                id="login-submit"
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In to Dashboard'}
              </button>
            </form>
            <div className="auth-footer">
              Don't have an account? <Link to="/signup">Register Municipality</Link>
            </div>
            <Link to="/" className="auth-back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
