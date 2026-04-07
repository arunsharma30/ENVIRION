import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SaveButton from './SaveButton';

export default function AnalystNav({ navStatusText, onSave, onLoad, activeSimulationId }) {
  const { user, logout } = useAuth();

  return (
    <nav className="analyst-nav">
      <Link to="/" className="anav-brand">
        <div className="anav-logo">🌿</div>
        ENvirion
        <span className="anav-mode">Analyst Mode</span>
      </Link>
      <div className="anav-status">
        <div className="anav-dot"></div>
        <span id="nav-status-text">{navStatusText}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user && (
          <span style={{
            fontSize: '12px', fontWeight: '600', color: 'var(--muted)',
            padding: '5px 12px', borderRadius: '6px',
            background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.12)',
            maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {user.name}
          </span>
        )}
        {onSave && (
          <SaveButton onSave={onSave} activeSimulationId={activeSimulationId} />
        )}
        {onLoad && (
          <button
            onClick={onLoad}
            style={{
              padding: '7px 14px', borderRadius: '8px',
              border: '1.5px solid var(--blue)', color: 'var(--blue)',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              background: 'rgba(14,165,233,0.06)', transition: 'all .2s',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--blue)'; e.target.style.color = '#fff'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(14,165,233,0.06)'; e.target.style.color = 'var(--blue)'; }}
          >
            Load
          </button>
        )}
        <Link to="/" className="anav-back">← Home</Link>
        {user && (
          <button
            onClick={logout}
            style={{
              padding: '7px 14px', borderRadius: '8px',
              border: '1.5px solid var(--border)', color: 'var(--muted)',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              background: 'var(--bg-card)', transition: 'all .2s',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)'; }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
