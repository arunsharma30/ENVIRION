export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-label">Methodology</div>
          <h2 className="section-heading">From Real Data to<br />Actionable Simulation</h2>
          <p className="section-sub">Our digital twin pipeline ingests live air quality measurements and applies evidence-based intervention models in real time.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card reveal">
            <div className="step-num">1</div>
            <span className="step-icon">📡</span>
            <div className="step-title">Live Data Ingestion</div>
            <div className="step-desc">Pulls real-time PM2.5, PM10, CO and NO₂ readings from Open-Meteo with automatic OpenWeatherMap failover.</div>
          </div>
          <div className="step-card reveal">
            <div className="step-num">2</div>
            <span className="step-icon">🗺️</span>
            <div className="step-title">Geospatial Mapping</div>
            <div className="step-desc">Renders a satellite-grade 3D city view with a dynamic pollution heatmap layered over real building data.</div>
          </div>
          <div className="step-card reveal">
            <div className="step-num">3</div>
            <span className="step-icon">🎛️</span>
            <div className="step-title">Intervention Simulation</div>
            <div className="step-desc">Drag interventions onto the map — EVs, urban greening, transit shifts — and tune their adoption sliders.</div>
          </div>
          <div className="step-card reveal">
            <div className="step-num">4</div>
            <span className="step-icon">📊</span>
            <div className="step-title">Impact Projection</div>
            <div className="step-desc">The engine recalculates AQI and CO₂e reductions in real time using EPA-calibrated pollutant breakpoints.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
