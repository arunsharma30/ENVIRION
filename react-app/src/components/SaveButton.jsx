import { useState } from 'react';

export default function SaveButton({ onSave, activeSimulationId }) {
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const [hover, setHover] = useState(false);

  const handleClick = async () => {
    if (status === 'saving') return;
    setStatus('saving');
    try {
      await onSave();
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      console.error('Save failed:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const isEditing = !!activeSimulationId;

  const labels = {
    idle: isEditing ? 'Update Simulation' : 'Save Simulation',
    saving: isEditing ? 'Updating...' : 'Saving...',
    saved: isEditing ? 'Updated!' : 'Saved!',
    error: isEditing ? 'Update Failed' : 'Save Failed'
  };

  const getStyle = () => {
    if (status === 'idle') {
      return {
        padding: '7px 14px', borderRadius: '8px',
        border: '1.5px solid var(--green)', color: hover ? '#fff' : 'var(--green)',
        fontSize: '12px', fontWeight: '700', cursor: 'pointer',
        background: hover ? 'var(--green)' : 'rgba(22,163,74,0.06)', transition: 'all .2s',
        fontFamily: "'Inter', sans-serif"
      };
    } else if (status === 'saving') {
      return {
        padding: '7px 14px', borderRadius: '8px',
        border: '1.5px solid #94a3b8', color: '#fff',
        fontSize: '12px', fontWeight: '700', cursor: 'wait',
        background: '#94a3b8', transition: 'all .2s',
        fontFamily: "'Inter', sans-serif"
      };
    } else if (status === 'saved') {
      return {
        padding: '7px 14px', borderRadius: '8px',
        border: '1.5px solid #10b981', color: '#fff',
        fontSize: '12px', fontWeight: '700', cursor: 'default',
        background: '#10b981', transition: 'all .2s',
        fontFamily: "'Inter', sans-serif"
      };
    } else {
      return {
        padding: '7px 14px', borderRadius: '8px',
        border: '1.5px solid #ef4444', color: '#fff',
        fontSize: '12px', fontWeight: '700', cursor: 'pointer',
        background: '#ef4444', transition: 'all .2s',
        fontFamily: "'Inter', sans-serif"
      };
    }
  };

  return (
    <button
      id="save-simulation-btn"
      onClick={handleClick}
      disabled={status === 'saving'}
      style={getStyle()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {labels[status]}
    </button>
  );
}