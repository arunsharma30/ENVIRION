import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('scrolled', window.scrollY > 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar" id="navbar" ref={navRef}>
      <a href="#" className="nav-logo">
        <div className="logo-icon">🌿</div>
        EN<span className="dot">virion</span>
      </a>
      <div className="nav-links">
        <a href="#how">How It Works</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#Explore & Simulate">Explore & Simulate</a>
      </div>
      <div className="nav-cta">
        {user ? (
          <>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>
              {user.name}
            </span>
            <Link to="/analyst" className="btn-primary">Launch Analyst ↗</Link>
            <button
              onClick={logout}
              className="btn-outline"
              style={{ cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Sign In</Link>
            <Link to="/signup" className="btn-primary">Register ↗</Link>
          </>
        )}
      </div>
    </nav>
  );
}
