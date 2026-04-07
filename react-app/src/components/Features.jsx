export default function Features() {
  return (
    <section id="features" style={{background: 'var(--bg)'}}>
      <div className="section-inner">
        <div className="reveal">
          <div className="section-label">Platform Features</div>
          <h2 className="section-heading">Built for Science,<br />Designed for Action</h2>
          <p className="section-sub">Every tool in ENvirion is grounded in environmental science and engineered for real urban planning decisions.</p>
        </div>
        <div className="features-grid">
          <div className="feat-card reveal">
            <div className="feat-icon-wrap" style={{background:'rgba(22,163,74,0.10)'}}>🌡️</div>
            <div className="feat-title">Dual-API Resilience</div>
            <div className="feat-desc">Primary Open-Meteo data stream with live failover to OpenWeatherMap, full audit logging, data validation, and retry logic.</div>
            <span className="feat-tag" style={{background:'rgba(22,163,74,0.08)',color:'var(--green)'}}>Data Integrity</span>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon-wrap" style={{background:'rgba(14,165,233,0.10)'}}>🏙️</div>
            <div className="feat-title">3D City Digital Twin</div>
            <div className="feat-desc">MapLibre GL satellite basemap with real building extrusions, pitch controls, and any-city location search via Nominatim.</div>
            <span className="feat-tag" style={{background:'rgba(14,165,233,0.08)',color:'var(--blue)'}}>Geospatial</span>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon-wrap" style={{background:'rgba(245,158,11,0.10)'}}>⚗️</div>
            <div className="feat-title">EPA AQI Engine</div>
            <div className="feat-desc">Full US-EPA breakpoint calculations for PM2.5, PM10, CO and NO₂ with dominant pollutant detection and category classification.</div>
            <span className="feat-tag" style={{background:'rgba(245,158,11,0.08)',color:'#d97706'}}>Scientific</span>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon-wrap" style={{background:'rgba(239,68,68,0.08)'}}>🔥</div>
            <div className="feat-title">Positive &amp; Negative Stressors</div>
            <div className="feat-desc">Model green interventions AND negative events like stubble burning (Parali) simultaneously with multi-marker spatial logic.</div>
            <span className="feat-tag" style={{background:'rgba(239,68,68,0.08)',color:'#dc2626'}}>Simulation</span>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon-wrap" style={{background:'rgba(139,92,246,0.10)'}}>📉</div>
            <div className="feat-title">CO₂-equivalent Modeling</div>
            <div className="feat-desc">Quantifies net carbon impact of each intervention stack including timber construction, industrial CCS, EV fleet electrification and more.</div>
            <span className="feat-tag" style={{background:'rgba(139,92,246,0.08)',color:'#7c3aed'}}>Carbon</span>
          </div>
          <div className="feat-card reveal">
            <div className="feat-icon-wrap" style={{background:'rgba(16,185,129,0.10)'}}>🔒</div>
            <div className="feat-title">Security Audit Log</div>
            <div className="feat-desc">Every API call, failover event and data update is timestamped and hash-verified in a live audit trail with full transparency.</div>
            <span className="feat-tag" style={{background:'rgba(16,185,129,0.08)',color:'#059669'}}>Provenance</span>
          </div>
        </div>
      </div>
    </section>
  );
}
