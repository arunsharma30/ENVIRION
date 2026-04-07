export default function AuditLogModal({ auditLog, dataStatus, onClose }) {
  const srcC = dataStatus.source === 'primary' ? '#16a34a' : (dataStatus.source === 'secondary' ? '#f59e0b' : '#8b5cf6');

  return (
    <div
      style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(5px)'}}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'14px',padding:'28px',maxWidth:'760px',maxHeight:'80vh',overflowY:'auto',width:'90%',boxShadow:'0 24px 64px rgba(0,0,0,0.12)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px'}}>
          <h3 style={{margin:0,color:'#0f172a',fontSize:'18px'}}>Security &amp; Failover Log</h3>
          <button onClick={onClose} style={{background:'#ef4444',border:'none',color:'white',padding:'7px 14px',borderRadius:'7px',cursor:'pointer',fontWeight:'700'}}>Close</button>
        </div>
        <div style={{background:'#f0fdf4',padding:'14px',borderRadius:'8px',marginBottom:'14px',border:'1px solid #bbf7d0'}}>
          <div style={{fontSize:'10px',color:'#64748b',marginBottom:'8px',textTransform:'uppercase',fontWeight:'700'}}>ACTIVE SOURCE</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',fontSize:'12px'}}>
            <div><span style={{color:'#64748b'}}>Current API:</span> <span style={{color:srcC,fontWeight:'700',textTransform:'uppercase'}}>{dataStatus.source}</span></div>
            <div><span style={{color:'#64748b'}}>Status:</span> <span style={{color:dataStatus.apiHealth==='healthy'?'#10b981':'#ef4444',fontWeight:'700'}}>{dataStatus.apiHealth.toUpperCase()}</span></div>
          </div>
        </div>
        <div style={{fontSize:'10px',color:'#64748b',marginBottom:'8px',textTransform:'uppercase',fontWeight:'700'}}>SYSTEM EVENTS</div>
        <div style={{background:'#f8fafc',borderRadius:'8px',padding:'14px',maxHeight:'380px',overflowY:'auto',fontFamily:'monospace',fontSize:'11px',border:'1px solid #e2e8f0'}}>
          {auditLog.map((entry, i) => {
            const col = { SUCCESS:'#10b981', FAILED:'#ef4444', WARNING:'#f59e0b', INITIATED:'#3b82f6', FALLBACK:'#a855f7' }[entry.status] || '#64748b';
            return (
              <div key={i} style={{borderBottom:'1px solid #e2e8f0',padding:'9px 0'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                  <span style={{color:'#0f172a',fontWeight:'700'}}>{entry.action}</span>
                  <span style={{color:col,fontWeight:'700'}}>{entry.status}</span>
                </div>
                <div style={{color:'#64748b',fontSize:'10px'}}>{entry.timestamp}</div>
                <div style={{color:'#334155',fontSize:'10px'}}>{entry.details}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
