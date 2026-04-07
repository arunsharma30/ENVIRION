import { useState, useEffect } from 'react';
import { getHistory, getSimulation, deleteSimulation } from '../services/backend';

export default function LoadModal({ token, onLoad, onEdit, onCreateNew, onDelete, activeSimulationId, onClose }) {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getHistory(token);
      setSimulations(data.simulations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id) => {
    try {
      setLoadingId(id);
      const data = await getSimulation(token, id);
      onLoad(data.simulation);
      onClose();
    } catch (err) {
      setError('Failed to load simulation: ' + err.message);
      setLoadingId(null);
    }
  };

  const handleEdit = async (id, e) => {
    e.stopPropagation();
    try {
      setLoadingId(id);
      const data = await getSimulation(token, id);
      onEdit(data.simulation);
      onClose();
    } catch (err) {
      setError('Failed to load simulation: ' + err.message);
      setLoadingId(null);
    }
  };

  const handleCreateNew = () => {
    onCreateNew();
    onClose();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this simulation? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await deleteSimulation(token, id);
      setSimulations(prev => prev.filter(s => s._id !== id));
      if (onDelete) onDelete(id);
    } catch (err) {
      setError('Failed to delete simulation: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#f59e0b';
    if (aqi <= 150) return '#fb923c';
    if (aqi <= 200) return '#ef4444';
    if (aqi <= 300) return '#dc2626';
    return '#991b1b';
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif"
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '520px', maxHeight: '80vh',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          background: 'rgba(240,253,244,0.9)', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--heading)' }}>
              Load Simulation
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Select a previously saved simulation to restore
            </div>
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer',
            color: 'var(--muted)', padding: '4px 8px', borderRadius: '6px'
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Create New Simulation Button */}
          <button
            onClick={handleCreateNew}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '10px', marginBottom: '14px',
              border: '2px dashed var(--green)', background: 'rgba(22,163,74,0.04)',
              cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: 'var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s', fontFamily: "'Inter', sans-serif"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.1)'; e.currentTarget.style.borderColor = '#059669'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.04)'; e.currentTarget.style.borderColor = 'var(--green)'; }}
          >
            Create New Simulation
          </button>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: '14px' }}>
              Loading simulations...
            </div>
          )}
          {error && (
            <div style={{
              padding: '12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px',
              marginBottom: '12px'
            }}>
              {error}
            </div>
          )}
          {!loading && simulations.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: '14px' }}>
              No saved simulations yet. Run a simulation and click "Save" to see it here.
            </div>
          )}
          {simulations.map(sim => (
            <div
              key={sim._id}
              onClick={() => handleSelect(sim._id)}
              style={{
                padding: '14px 16px', borderRadius: '10px', marginBottom: '10px',
                border: '1px solid var(--border)', background: 'var(--bg-tint)',
                cursor: loadingId ? 'wait' : 'pointer',
                transition: 'all 0.2s', opacity: loadingId && loadingId !== sim._id ? 0.5 : 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={e => { if (!loadingId) { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(22,163,74,0.1)'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--heading)' }}>
                  {loadingId === sim._id ? '⏳ Loading...' : (sim.title || 'Untitled')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {sim.results && sim.results.AQI > 0 && (
                    <div style={{
                      fontSize: '12px', fontWeight: '700', padding: '2px 10px',
                      borderRadius: '20px', color: 'white',
                      background: getAqiColor(sim.results.AQI)
                    }}>
                      AQI {sim.results.AQI}
                    </div>
                  )}
                  <button
                    onClick={(e) => handleEdit(sim._id, e)}
                    title="Edit this simulation"
                    style={{
                      padding: '4px 10px', borderRadius: '6px',
                      border: '1px solid var(--border)', background: 'white',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      color: 'var(--blue)', transition: 'all 0.2s',
                      fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '3px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--blue)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(sim._id, e)}
                    title="Delete this simulation"
                    style={{
                      padding: '4px 10px', borderRadius: '6px',
                      border: '1px solid var(--border)', background: 'white',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      color: '#ef4444', transition: 'all 0.2s',
                      fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '3px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {sim.location?.name || `${sim.location?.lat?.toFixed(3)}, ${sim.location?.lon?.toFixed(3)}`}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  {formatDate(sim.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
            {simulations.length} simulation{simulations.length !== 1 ? 's' : ''} saved
          </div>
          <button onClick={onClose} style={{
            padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--border)',
            background: 'white', color: 'var(--text)', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer'
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}