export default function LeftPanel({
  locationStatus,
  onSearchLocation,
  onPollutantChange,
  pollutantValue,
  valCur,
  lblCur,
  valSim,
  lblSim,
  valAqi,
  aqiBadge,
  aqiCardBorderColor,
  aqiChange,
  valCo2,
  lblCo2,
  co2CardStyle,
  aqiBreakdown,
  aqiDescription,
  aqiDescriptionBorderColor,
  statusIndicatorColor,
  statusText,
  statusTime,
  onShowAuditLog,
  locationInputRef
}) {
  return (
    <div className="panel panel-left">
      <div className="header">
        <h2>ENVIRION</h2>
        <div className="sub">Digital Twin Analyst</div>
      </div>
      <div className="content">

        {/* Location Search */}
        <div style={{marginBottom:'14px'}}>
          <label style={{fontSize:'10px',fontWeight:'700',color:'var(--muted)',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'.8px'}}>LOCATION</label>
          <div style={{display:'flex',gap:'6px',marginBottom:'4px'}}>
            <input
              id="location-input"
              className="location-input"
              placeholder="Search area e.g. Shivajinagar, Pune"
              ref={locationInputRef}
            />
            <button className="location-btn" onClick={onSearchLocation}>Go</button>
          </div>
          <div id="location-status" style={{fontSize:'10px',color:'var(--muted)'}}>{locationStatus}</div>
        </div>

        {/* Pollutant Selector */}
        <label style={{fontSize:'10px',fontWeight:'700',color:'var(--muted)',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'.8px'}}>VISUALIZATION LAYER</label>
        <select id="pollutant" value={pollutantValue} onChange={onPollutantChange}>
          <option value="pm2_5">PM 2.5 (Fine Dust)</option>
          <option value="pm10">PM 10 (Coarse Dust)</option>
          <option value="co">CO (Traffic Emissions)</option>
          <option value="no2">NO2 (Industrial)</option>
          <option value="co2">CO₂ Emissions (Carbon)</option>
          <option value="aqi">Overall AQI (Combined)</option>
        </select>

        {/* Metric Cards */}
        <div className="metric-card">
          <div className="metric-val" id="val-cur">{valCur}</div>
          <div className="metric-lbl" id="lbl-cur">{lblCur}</div>
        </div>
        <div className="metric-card" style={{borderLeft:'3px solid var(--blue)'}}>
          <div className="metric-val val-sim" id="val-sim">{valSim}</div>
          <div className="metric-lbl" id="lbl-sim">{lblSim}</div>
        </div>
        <div className="metric-card" id="aqi-card" style={{borderLeft:`3px solid ${aqiCardBorderColor}`}}>
          <div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:'10px'}}>
            <div className="metric-val" id="val-aqi">{valAqi}</div>
            <div id="aqi-badge" style={{fontSize:'12px',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',background:aqiBadge.color,color:'white'}}>{aqiBadge.text}</div>
          </div>
          <div className="metric-lbl">Air Quality Index</div>
          <div id="aqi-change" style={{fontSize:'11px',marginTop:'6px',color:'var(--muted)'}} dangerouslySetInnerHTML={{__html: aqiChange}}></div>
        </div>
        <div className="metric-card" id="co2-card" style={{borderLeft:`3px solid ${co2CardStyle.borderColor}`, background: co2CardStyle.background}}>
          <div className="metric-val val-co2" id="val-co2" style={{color: co2CardStyle.valColor}}>{valCo2}</div>
          <div className="metric-lbl" id="lbl-co2">{lblCo2}</div>
        </div>

        {/* AQI Breakdown */}
        <div style={{marginTop:'16px',padding:'14px',background:'var(--bg-tint)',borderRadius:'8px',border:'1px solid var(--border)'}}>
          <div style={{fontSize:'10px',fontWeight:'700',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase'}}>AQI BREAKDOWN</div>
          <div id="aqi-breakdown" style={{fontSize:'11px',color:'var(--text)',lineHeight:'1.7'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span>PM 2.5:</span><span id="aqi-pm25" style={{fontWeight:'700'}}>{aqiBreakdown.pm25}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span>PM 10:</span><span id="aqi-pm10" style={{fontWeight:'700'}}>{aqiBreakdown.pm10}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span>CO:</span><span id="aqi-co" style={{fontWeight:'700'}}>{aqiBreakdown.co}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span>NO₂:</span><span id="aqi-no2" style={{fontWeight:'700'}}>{aqiBreakdown.no2}</span></div>
          </div>
          <div className="aqi-description" style={{borderLeftColor: aqiDescriptionBorderColor}}>{aqiDescription}</div>
        </div>

        {/* Data Status */}
        <div id="data-status">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
            <span style={{fontSize:'10px',fontWeight:'700',color:'var(--muted)',textTransform:'uppercase'}}>DATA STATUS</span>
            <span id="status-indicator" style={{width:'9px',height:'9px',borderRadius:'50%',background:statusIndicatorColor,display:'inline-block'}}></span>
          </div>
          <div id="status-text" style={{fontSize:'11px',color:'var(--text)'}}>{statusText}</div>
          <div id="status-time" style={{fontSize:'10px',color:'var(--muted)',marginTop:'3px'}}>{statusTime}</div>
          <button onClick={onShowAuditLog} style={{width:'100%',marginTop:'8px',padding:'7px',background:'rgba(22,163,74,0.08)',border:'1px solid var(--green)',borderRadius:'7px',color:'var(--green)',fontSize:'11px',fontWeight:'700',cursor:'pointer',textTransform:'uppercase'}}>
            View Audit Log
          </button>
        </div>

      </div>
    </div>
  );
}
