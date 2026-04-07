import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupAPI } from '../services/backend';
import '../styles/auth.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const data = await signupAPI(name, email, password, region);
      signup(data.token, data.user);
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
            <h1 className="auth-title">Register Municipality</h1>
            <p className="auth-subtitle">Create an account to access the ENVIRION environmental intelligence and simulation platform.</p>
          </div>
          <div className="auth-body">
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="auth-form-group">
                <label className="auth-label">Municipality / Organization Name</label>
                <input
                  id="signup-name"
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Pune Municipal Corporation"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="organization"
                />
              </div>
              <div className="auth-form-group">
                <label className="auth-label">Official Email</label>
                <input
                  id="signup-email"
                  type="email"
                  className="auth-input"
                  placeholder="admin@pmc.gov.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  className="auth-input"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="auth-form-group">
                <label className="auth-label">Region / District (Optional)</label>
                <input
                  id="signup-region"
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Pune, Maharashtra"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                />
              </div>
              <button
                id="signup-submit"
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register & Access Dashboard'}
              </button>
            </form>
            <div className="auth-footer">
              Already registered? <Link to="/login">Sign In</Link>
            </div>
            <Link to="/" className="auth-back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
