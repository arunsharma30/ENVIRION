export default function HeatmapLegend() {
  return (
    <div className="heatmap-legend">
      <div className="legend-title">Pollution Intensity / AQI</div>
      <div className="legend-gradient"></div>
      <div className="legend-labels">
        <span>Good</span><span>Moderate</span><span>Unhealthy</span><span>Hazardous</span>
      </div>
    </div>
  );
}
