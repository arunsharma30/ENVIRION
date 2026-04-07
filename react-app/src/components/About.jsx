export default function About() {
  return (
    <section className="about" id="about">
      <div className="section-inner">
        <div className="about-inner reveal">
          <div className="about-graphic">
            <div className="about-graphic-title">Live AQI Snapshot — Bhosari, Pune</div>
            <div className="aqi-bar-item">
              <div className="aqi-color" style={{ background: '#ef4444' }}></div>
              <div className="aqi-label">PM 2.5</div>
              <div className="aqi-bar-bg"><div className="aqi-bar-fill" style={{ width: '65%', background: '#ef4444' }}></div></div>
              <div className="aqi-val">142</div>
            </div>
            <div className="aqi-bar-item">
              <div className="aqi-color" style={{ background: '#fb923c' }}></div>
              <div className="aqi-label">PM 10</div>
              <div className="aqi-bar-bg"><div className="aqi-bar-fill" style={{ width: '50%', background: '#fb923c' }}></div></div>
              <div className="aqi-val">104</div>
            </div>
            <div className="aqi-bar-item">
              <div className="aqi-color" style={{ background: '#f59e0b' }}></div>
              <div className="aqi-label">NO₂</div>
              <div className="aqi-bar-bg"><div className="aqi-bar-fill" style={{ width: '30%', background: '#f59e0b' }}></div></div>
              <div className="aqi-val">62</div>
            </div>
            <div className="aqi-bar-item">
              <div className="aqi-color" style={{ background: '#10b981' }}></div>
              <div className="aqi-label">CO</div>
              <div className="aqi-bar-bg"><div className="aqi-bar-fill" style={{ width: '18%', background: '#10b981' }}></div></div>
              <div className="aqi-val">38</div>
            </div>
            <div className="intervention-preview">
              <div className="int-prev-title">Active Interventions</div>
              <span className="int-prev-chip" style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', borderColor: 'rgba(22,163,74,0.2)' }}>🌳 Urban Greening</span>
              <span className="int-prev-chip" style={{ background: 'rgba(14,165,233,0.08)', color: '#0ea5e9', borderColor: 'rgba(14,165,233,0.2)' }}>⚡ EV Adoption</span>
              <span className="int-prev-chip" style={{ background: 'rgba(245,158,11,0.08)', color: '#d97706', borderColor: 'rgba(245,158,11,0.2)' }}>🚇 Public Transit</span>
            </div>
          </div>
          <div className="about-text">
            <div className="section-label">About the Platform</div>
            <h2 className="section-heading">Turning Data Into<br />Environmental Policy</h2>
            <p className="section-sub">ENvirion bridges the gap between raw sensor data and urban planning decisions — giving researchers, policymakers, and students a visual tool to explore the real-world impact of environmental interventions.</p>
            <ul className="about-bullets">
              <li>
                <div className="bullet-icon"></div>
                <div>Built on peer-reviewed environmental science, including US-EPA AQI standard and IPCC CO₂ equivalency factors.</div>
              </li>
              <li>
                <div className="bullet-icon"></div>
                <div>Works globally — search any city on earth and get live pollution readings in seconds from our dual API system.</div>
              </li>
              <li>
                <div className="bullet-icon"></div>
                <div>Deploy multiple intervention markers per zone to model compound effects across industrial, traffic, and residential hotspots.</div>
              </li>
              <li>
                <div className="bullet-icon"></div>
                <div>Full audit trail with data source attribution, failover history, and hash-verified provenance for every data point shown.</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
