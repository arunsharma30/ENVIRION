import { STRATEGIES } from '../utils/simulation';

export default function RightPanel({ sliderValues, onUpdateVal, onDragStart, onDragEnd }) {
  const positive = STRATEGIES.filter(s => s.category === 'positive');
  const negative = STRATEGIES.filter(s => s.category === 'negative');

  const renderGroup = (strategy) => {
    const val = sliderValues[strategy.id] || 0;
    let suffix = '%';
    if (strategy.id === 'parali') suffix = '0 T';
    return (
      <div className="int-group" key={strategy.id} data-intervention={strategy.id} data-category={strategy.category}>
        <div className="int-header">
          <span
            className="int-title"
            draggable="true"
            data-id={strategy.id}
            onDragStart={(e) => onDragStart(e, strategy.id)}
            onDragEnd={onDragEnd}
          >
            <span className="drag-handle">⠿⠿</span>{strategy.icon} {strategy.title}
          </span>
          <span className="int-perc" id={`disp-${strategy.id}`}>{val}{suffix}</span>
        </div>
        <div className="int-desc">{strategy.desc}</div>
        <input
          type="range"
          id={strategy.id}
          min="0"
          max="100"
          value={val}
          onInput={(e) => onUpdateVal(strategy.id, e.target.value)}
          onChange={() => {}}
        />
      </div>
    );
  };

  return (
    <div className="panel panel-right">
      <div className="header">
        <h2>INTERVENTIONS</h2>
        <div className="sub">Drag to Map — Deploy Multiple &amp; Delete</div>
      </div>
      <div className="content" id="int-container">
        <div className="int-section" id="int-positive-section">
          <div className="int-section-title">Positive Interventions</div>
          {positive.map(renderGroup)}
        </div>
        <div className="int-section" id="int-negative-section" style={{marginTop:'14px',paddingTop:'14px',borderTop:'1px dashed var(--border2)'}}>
          <div className="int-section-title" style={{color:'#dc2626'}}>Negative Interventions / Stressors</div>
          {negative.map(renderGroup)}
        </div>
      </div>
    </div>
  );
}
