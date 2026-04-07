import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPrimaryAPI } from '../services/api';
import { getOverallAQI } from '../utils/aqi';

// Fallback defaults (Bhosari, Pune)
const FALLBACK_LAT = 18.625;
const FALLBACK_LON = 73.855;
const FALLBACK_LABEL = 'BHOSARI, PUNE';

export default function Hero() {
  const { user } = useAuth();
  const [locationLabel, setLocationLabel] = useState(FALLBACK_LABEL);
  const [aqiValue, setAqiValue] = useState(142);
  const [aqiColor, setAqiColor] = useState('#ef4444');
  const [pm25Value, setPm25Value] = useState(55);
  const [pm25Color, setPm25Color] = useState('#f59e0b');

  useEffect(() => {
    let cancelled = false;

    async function resolveAndFetch() {
      let lat = FALLBACK_LAT;
      let lon = FALLBACK_LON;
      let label = FALLBACK_LABEL;

      // 1️⃣ If user is logged in and has a region, geocode it
      if (user && user.region && user.region.trim()) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(user.region.trim())}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              lat = parseFloat(data[0].lat);
              lon = parseFloat(data[0].lon);
              // Build a clean uppercase label from the region
              label = user.region.trim().toUpperCase();
            }
          }
        } catch {
          // Geocoding failed — use fallback coords, keep trying AQI with fallback
        }
      }

      if (cancelled) return;
      setLocationLabel(label);

      // 2️⃣ Fetch live AQI data using existing API function
      try {
        const rawData = await fetchPrimaryAPI(lat, lon);
        if (cancelled) return;

        const overall = getOverallAQI(rawData);

        setAqiValue(overall.value);
        setAqiColor(overall.color);
        setPm25Value(Math.round(rawData.pm2_5));

        // Derive PM2.5 color from its individual AQI value
        const pm25Aqi = overall.individual.pm2_5;
        if (pm25Aqi <= 50) setPm25Color('#10b981');
        else if (pm25Aqi <= 100) setPm25Color('#f59e0b');
        else if (pm25Aqi <= 150) setPm25Color('#fb923c');
        else setPm25Color('#ef4444');
      } catch {
        // API failed — keep the current (fallback) values
      }
    }

    resolveAndFetch();

    return () => { cancelled = true; };
  }, [user]);

  return (
    <section className="hero" id="home">
      <div className="hero-bg"></div>
      <div className="hero-grid-lines"></div>
      <div className="hero-inner">

        {/* Left: Text Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <div className="badge-dot"></div>
            Live Air Quality Intelligence
          </div>
          <h1>
            AI-Powered<br />
            <span className="highlight">Environmental</span><br />
            Digital Twin
          </h1>
          <p className="hero-sub">
            ENvirion transforms real-time pollution data into interactive urban simulations —
            helping cities plan, model, and deploy green interventions with scientific precision.
          </p>
          <div className="hero-actions">
            <Link to="/analyst" className="btn-hero-primary">Launch Analyst Mode</Link>
            <a href="#how" className="btn-hero-secondary">How It Works</a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-val">6+</div>
              <div className="hero-stat-lbl">Pollution Layers</div>
            </div>
            <div>
              <div className="hero-stat-val">8</div>
              <div className="hero-stat-lbl">Interventions</div>
            </div>
            <div>
              <div className="hero-stat-val">Live</div>
              <div className="hero-stat-lbl">AQI Data</div>
            </div>
          </div>
        </div>

        {/* Right: Visual Card */}
        <div className="hero-visual">
          <div className="hero-card-main">
            <div className="hero-map-mock">
              <div className="map-grid-lines"></div>
              <div className="map-heatspot hspot1"></div>
              <div className="map-heatspot hspot2"></div>
              <div className="map-heatspot hspot3"></div>
              <div className="map-heatspot hspot4"></div>
              <div className="map-label">LIVE · {locationLabel}</div>
              <div className="map-ping"></div>
            </div>
            <div className="hero-card-bottom">
              <div className="mini-metric">
                <div className="mini-metric-val" style={{ color: aqiColor }}>{aqiValue}</div>
                <div className="mini-metric-lbl">AQI</div>
              </div>
              <div className="mini-metric">
                <div className="mini-metric-val" style={{ color: pm25Color }}>{pm25Value}</div>
                <div className="mini-metric-lbl">PM 2.5</div>
              </div>
              <div className="mini-metric">
                <div className="mini-metric-val" style={{ color: '#10b981' }}>-23%</div>
                <div className="mini-metric-lbl">CO₂ Red.</div>
              </div>
            </div>
          </div>
          <div className="status-pill">
            <div className="status-dot"></div>
            Live Data Connected
          </div>
        </div>

      </div>
    </section>
  );
}
