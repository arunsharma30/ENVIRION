import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#" className="nav-logo">
            <div className="logo-icon">🌿</div>
            EN<span style={{ color: '#4ade80' }}>virion</span>
          </a>
          <p className="footer-desc">AI-powered environmental intelligence platform. Built for a cleaner, data-driven future.</p>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/analyst">Analyst Mode</Link></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how">How It Works</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Data Sources</h4>
          <ul>
            <li><a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo API</a></li>
            <li><a href="https://openweathermap.org" target="_blank" rel="noreferrer">OpenWeatherMap</a></li>
            <li><a href="https://www.maptiler.com" target="_blank" rel="noreferrer">MapTiler</a></li>
            <li><a href="https://nominatim.org" target="_blank" rel="noreferrer">Nominatim OSM</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Standards</h4>
          <ul>
            <li><a href="#about">US-EPA AQI</a></li>
            <li><a href="#about">IPCC CO₂e</a></li>
            <li><a href="#about">Audit Logging</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 ENvirion. Open source environmental intelligence. All scientific data is real-time.</p>
        <div className="footer-tags">
        </div>
      </div>
    </footer>
  );
}
