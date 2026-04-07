export default function AqiScaleBox() {
  return (
    <div className="aqi-scale-box">
      <div className="aqi-scale-title">AQI Scale</div>
      <div style={{fontSize:'11px',lineHeight:'2'}}>
        <div style={{display:'flex',alignItems:'center',gap:'7px'}}><div style={{width:'18px',height:'10px',background:'#10b981',borderRadius:'2px'}}></div><span>0-50 Good</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'7px'}}><div style={{width:'18px',height:'10px',background:'#f59e0b',borderRadius:'2px'}}></div><span>51-100 Moderate</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'7px'}}><div style={{width:'18px',height:'10px',background:'#fb923c',borderRadius:'2px'}}></div><span>101-150 Sensitive</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'7px'}}><div style={{width:'18px',height:'10px',background:'#ef4444',borderRadius:'2px'}}></div><span>151-200 Unhealthy</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'7px'}}><div style={{width:'18px',height:'10px',background:'#dc2626',borderRadius:'2px'}}></div><span>201-300 Very Unhealthy</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'7px'}}><div style={{width:'18px',height:'10px',background:'#991b1b',borderRadius:'2px'}}></div><span>301+ Hazardous</span></div>
      </div>
    </div>
  );
}
