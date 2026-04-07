import { Link } from 'react-router-dom';

export default function CtaBanner() {
  return (
    <section className="cta-banner" id="Explore & Simulate">
      <div className="cta-bg-glow"></div>
      <div className="cta-inner reveal">
        <div className="cta-badge">Open Access Platform</div>
        <h2 className="cta-heading">
          Ready to Simulate a<br /><span className="g">Greener City?</span>
        </h2>
        <p className="cta-sub">
          Launch the full Analyst Mode to drag interventions onto live satellite maps,
          compute AQI projections, and export your findings.
        </p>
        <div className="cta-actions">
          <Link to="/analyst" className="btn-cta-primary">Launch Analyst Mode</Link>
          <a href="#how" className="btn-cta-secondary">Explore Features</a>
        </div>
      </div>
    </section>
  );
}
