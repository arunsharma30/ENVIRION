import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/analyst.css';
import { STRATEGIES, BHOSARI } from '../utils/simulation';
import { getOverallAQI } from '../utils/aqi';
import { fetchPrimaryAPI, fetchSecondaryAPI, validateDataRanges, hashData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { saveSimulation, updateSimulation } from '../services/backend';
import AnalystNav from '../components/AnalystNav';
import MapView from '../components/MapView';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';
import HeatmapLegend from '../components/HeatmapLegend';
import AqiScaleBox from '../components/AqiScaleBox';
import AuditLogModal from '../components/AuditLogModal';
import SaveButton from '../components/SaveButton';
import LoadModal from '../components/LoadModal';

export default function Analyst() {
  // ─── REFS (performance-critical, mutable state) ───────────
  const mapRef = useRef(null);
  const liveDataRef = useRef({ pm2_5: 55, pm10: 90, co: 600, no2: 40, co2_baseline: 1000 });
  const currentAQIRef = useRef({ value: 0, category: 'Unknown', color: '#64748b' });
  const projectedAQIRef = useRef({ value: 0, category: 'Unknown', color: '#64748b' });
  const dataStatusRef = useRef({ lastFetch: null, isLive: false, source: 'initializing', apiHealth: 'unknown', validationPassed: false });
  const auditLogRef = useRef([]);
  const interventionPlacementsRef = useRef({});
  const markerCounterRef = useRef(0);
  const draggedElementRef = useRef(null);
  const draggedMarkerIdRef = useRef(null);
  const isDraggingFromPanelRef = useRef(false);
  const currentLocationRef = useRef({ lat: BHOSARI[1], lon: BHOSARI[0], label: 'Bhosari, Pune' });
  const fetchTimerRef = useRef(null);
  const locationInputRef = useRef(null);

  // ─── UI STATE (triggers re-renders for display) ───────────
  const [navStatusText, setNavStatusText] = useState('Connecting...');
  const [locationStatus, setLocationStatus] = useState('Bhosari, Pune (default)');
  const [pollutantValue, setPollutantValue] = useState('pm2_5');
  const [valCur, setValCur] = useState('--');
  const [lblCur, setLblCur] = useState('Current Level (μg/m³)');
  const [valSim, setValSim] = useState('--');
  const [lblSim, setLblSim] = useState('Projected Level');
  const [valAqi, setValAqi] = useState('--');
  const [aqiBadge, setAqiBadge] = useState({ text: '--', color: 'var(--muted)' });
  const [aqiCardBorderColor, setAqiCardBorderColor] = useState('var(--muted)');
  const [aqiChange, setAqiChange] = useState('');
  const [valCo2, setValCo2] = useState('0%');
  const [lblCo2, setLblCo2] = useState('Total CO₂e Reduction');
  const [co2CardStyle, setCo2CardStyle] = useState({ borderColor: '#10b981', background: 'rgba(16,185,129,0.05)', valColor: '#16a34a' });
  const [aqiBreakdown, setAqiBreakdown] = useState({ pm25: '--', pm10: '--', co: '--', no2: '--' });
  const [aqiDescription, setAqiDescription] = useState('Select interventions to see impact');
  const [aqiDescriptionBorderColor, setAqiDescriptionBorderColor] = useState('var(--green)');
  const [statusIndicatorColor, setStatusIndicatorColor] = useState('var(--muted)');
  const [statusText, setStatusText] = useState('Initializing...');
  const [statusTime, setStatusTime] = useState('--');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [sliderValues, setSliderValues] = useState(() => {
    const vals = {};
    STRATEGIES.forEach(s => { vals[s.id] = 0; });
    return vals;
  });
  // Force re-render trigger for markers (DOM manipulation)
  const [, setMarkerTick] = useState(0);

  // ─── SESSION-BASED SIMULATION STATE ──────────────────────
  const [activeSimulationId, setActiveSimulationId] = useState(null);

  // ─── AUTH (for save/load) ─────────────────────────────────
  const { token } = useAuth();

  // ─── AUDIT LOG ─────────────────────────────────────────────
  const logAudit = useCallback((action, details, status) => {
    auditLogRef.current.unshift({ timestamp: new Date().toISOString(), action, details, status, dataHash: hashData(liveDataRef.current) });
    if (auditLogRef.current.length > 50) auditLogRef.current.pop();
  }, []);

  // ─── UPDATE STATUS ─────────────────────────────────────────
  const updateStatus = useCallback((type, msg) => {
    const c = { success: '#10b981', warning: '#f59e0b', error: '#ef4444', fallback: '#8b5cf6', fetching: '#3b82f6' };
    setStatusIndicatorColor(c[type] || '#64748b');
    setStatusText(msg);
    setStatusTime(dataStatusRef.current.lastFetch ? `Updated: ${dataStatusRef.current.lastFetch.toLocaleTimeString()}` : 'Waiting...');
  }, []);

  // ─── UPDATE AQI DISPLAY ───────────────────────────────────
  const updateAQIDisplay = useCallback((currentData, projectedData) => {
    const cAQI = getOverallAQI(currentData);
    const pAQI = getOverallAQI(projectedData);
    currentAQIRef.current = cAQI;
    projectedAQIRef.current = pAQI;

    setValAqi(cAQI.value);
    setAqiBadge({ text: cAQI.category, color: cAQI.color });
    setAqiCardBorderColor(cAQI.color);

    const imp = cAQI.value - pAQI.value;
    if (imp > 0) {
      setAqiChange(`<span style="color:#10b981;">&#9660; ${imp} pts better</span>`);
    } else if (imp < 0) {
      setAqiChange(`<span style="color:#ef4444;">&#9650; ${Math.abs(imp)} pts worse</span>`);
    } else {
      setAqiChange('No change');
    }

    setAqiBreakdown({
      pm25: cAQI.individual.pm2_5,
      pm10: cAQI.individual.pm10,
      co: cAQI.individual.co,
      no2: cAQI.individual.no2
    });

    setAqiDescription(cAQI.description);
    setAqiDescriptionBorderColor(cAQI.color);
  }, []);

  // ─── DRAW HEATMAP ─────────────────────────────────────────
  const drawHeatCloud = useCallback((intensity, visualMode, totalReduction, totalIncrease) => {
    const map = mapRef.current;
    if (!map) return;
    const c = currentLocationRef.current || { lat: BHOSARI[1], lon: BHOSARI[0] };
    const hotspots = [
      { lng: c.lon - .003, lat: c.lat + .002, type: 'industrial', baseMultiplier: 1.8, radius: .008 },
      { lng: c.lon + .002, lat: c.lat, type: 'traffic', baseMultiplier: 1.6, radius: .007 },
      { lng: c.lon - .001, lat: c.lat - .002, type: 'construction', baseMultiplier: 1.7, radius: .006 },
      { lng: c.lon + .004, lat: c.lat + .003, type: 'residential', baseMultiplier: 1.0, radius: .009 },
      { lng: c.lon - .004, lat: c.lat - .001, type: 'traffic', baseMultiplier: 1.4, radius: .006 }
    ];

    const features = [];
    const interventions = {};
    STRATEGIES.forEach(s => {
      const sliderEl = document.getElementById(s.id);
      interventions[s.id] = sliderEl ? parseInt(sliderEl.value) / 100 : 0;
    });

    function getImpact(lng, lat) {
      let reduction = 0, increase = 0;
      Object.values(interventionPlacementsRef.current).forEach(p => {
        const v = interventions[p.strategyId] || 0;
        if (v > 0) {
          const dx = (lng - p.lngLat.lng) * 111000;
          const dy = (lat - p.lngLat.lat) * 111000;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 500) {
            const effect = (1 - dist / 500) * v * .5;
            if (p.strategyId === 'parali') increase += effect;
            else reduction += effect;
          }
        }
      });
      return { red: Math.min(reduction, .9), inc: increase };
    }

    hotspots.forEach(h => {
      for (let i = 0; i < 60; i++) {
        const r = h.radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const lng = h.lng + r * Math.cos(theta);
        const lat = h.lat + r * Math.sin(theta);
        const local = getImpact(lng, lat);

        let val = (intensity / 100) * h.baseMultiplier * (1 - totalReduction * .5) * (1 + totalIncrease) * (1 - local.red) * (1 + local.inc);
        if (visualMode === 'aqi') val = (intensity / 300) * h.baseMultiplier * (1 - local.red) * (1 + local.inc);
        val *= (.8 + Math.random() * .4);
        if (val > 1) val = 1;
        if (val > .05) features.push({
          type: 'Feature',
          properties: { intensity: val },
          geometry: { type: 'Point', coordinates: [lng, lat] }
        });
      }
    });

    const s = map.getSource('pollution');
    if (s) s.setData({ type: 'FeatureCollection', features });
  }, []);

  // ─── SIMULATION ENGINE ─────────────────────────────────────
  const updateSim = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const type = document.getElementById('pollutant').value;
    const liveData = liveDataRef.current;
    const base = type === 'aqi' ? currentAQIRef.current.value : (type === 'co2' ? liveData.co2_baseline : liveData[type]);

    let totalPolRed = 0, totalCo2Red = 0, totalPolInc = 0, totalCo2Inc = 0;
    const counts = {};
    Object.values(interventionPlacementsRef.current).forEach(p => { counts[p.strategyId] = (counts[p.strategyId] || 0) + 1; });

    STRATEGIES.forEach(s => {
      const sliderEl = document.getElementById(s.id);
      if (!sliderEl) return;
      const v = parseInt(sliderEl.value);
      const markerCount = counts[s.id] || 0;
      if (v > 0 && markerCount > 0) {
        let f = (v / 100) * markerCount;
        if (f > 1.5) f = 1.5;
        let w = .5;
        if (type.includes('pm') && s.max_pol > .4) w = 1.0;
        if ((type === 'co' || type === 'no2') && s.id === 'ev') w = 1.2;
        if (type === 'aqi' && s.max_pol > .3) w = .8;
        if (s.id === 'parali') { totalPolInc += (s.max_pol * f * w * .4); totalCo2Inc += (s.max_co2 * f); }
        else { totalPolRed += (s.max_pol * f * w * .4); totalCo2Red += (s.max_co2 * f * .5); }
      }
    });

    if (totalPolRed > .95) totalPolRed = .95;
    if (totalCo2Red > .95) totalCo2Red = .95;

    const netFactorPol = (1 - totalPolRed) * (1 + totalPolInc);
    const netFactorCo2 = (1 - totalCo2Red) * (1 + totalCo2Inc);
    const proj = {
      pm2_5: liveData.pm2_5 * netFactorPol, pm10: liveData.pm10 * netFactorPol,
      co: liveData.co * netFactorPol, no2: liveData.no2 * netFactorPol
    };

    let final;
    if (type === 'aqi') {
      const pAQI = getOverallAQI(proj);
      projectedAQIRef.current = pAQI;
      final = pAQI.value;
      setLblCur('Current AQI');
      setLblSim('Projected AQI');
      setValCur(Math.round(base));
      setValSim(Math.round(final));
    } else if (type === 'co2') {
      final = base * netFactorCo2;
      setLblCur('Current CO₂e');
      setValCur(Math.round(base));
      setValSim(Math.round(final));
    } else {
      final = base * netFactorPol;
      setLblCur('Current Level');
      setValCur(base.toFixed(1));
      setValSim(final.toFixed(1));
    }

    const netChange = (netFactorCo2 - 1) * 100;
    if (netChange > .1) {
      setCo2CardStyle({ borderColor: '#dc2626', background: 'rgba(239,68,68,0.05)', valColor: '#dc2626' });
      setLblCo2('Total CO₂e INCREASE');
      setValCo2(`+${netChange.toFixed(0)}%`);
    } else {
      setCo2CardStyle({ borderColor: '#10b981', background: 'rgba(16,185,129,0.05)', valColor: '#16a34a' });
      setLblCo2('Total CO₂e Reduction');
      setValCo2(`${netChange.toFixed(0)}%`);
    }

    updateAQIDisplay(liveData, proj);
    drawHeatCloud(final, type, totalPolRed, totalPolInc);
  }, [updateAQIDisplay, drawHeatCloud]);

  // ─── MARKER POSITIONS UPDATE ──────────────────────────────
  const updateMarkerPositions = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.values(interventionPlacementsRef.current).forEach(p => {
      const point = map.project(p.lngLat);
      const marker = document.querySelector(`.intervention-marker[data-marker-id="${p.markerId}"]`);
      const zone = document.querySelector(`.impact-zone[data-marker-id="${p.markerId}"]`);
      if (marker && !draggedElementRef.current) {
        marker.style.left = (point.x - 30) + 'px';
        marker.style.top = (point.y - 30) + 'px';
      }
      if (zone) {
        zone.style.left = (point.x - 100) + 'px';
        zone.style.top = (point.y - 100) + 'px';
      }
    });
  }, []);

  // ─── PLACE INTERVENTION ───────────────────────────────────
  const placeIntervention = useCallback((strategyId, x, y) => {
    const strategy = STRATEGIES.find(s => s.id === strategyId);
    const map = mapRef.current;
    if (!strategy || !map) return;

    const markerId = `${strategyId}-${Date.now()}-${markerCounterRef.current++}`;
    const lngLat = map.unproject([x, y]);

    const zone = document.createElement('div');
    zone.className = 'impact-zone';
    zone.dataset.markerId = markerId;
    zone.dataset.strategyId = strategyId;
    zone.style.left = (x - 100) + 'px';
    zone.style.top = (y - 100) + 'px';
    zone.style.width = '200px';
    zone.style.height = '200px';
    zone.style.borderColor = strategy.color;

    const marker = document.createElement('div');
    marker.className = 'intervention-marker';
    marker.dataset.markerId = markerId;
    marker.dataset.strategyId = strategyId;
    marker.style.left = (x - 30) + 'px';
    marker.style.top = (y - 30) + 'px';
    marker.style.background = strategy.color + '22';
    marker.style.borderColor = strategy.color;
    marker.innerHTML = `
      <span class="marker-icon">${strategy.icon}</span>
      <div class="marker-label" style="color:${strategy.color}">${strategy.title}</div>
      <button class="marker-delete" title="Remove" data-delete-marker="${markerId}">&times;</button>`;

    document.getElementById('intervention-markers').appendChild(zone);
    document.getElementById('intervention-markers').appendChild(marker);

    const sliderEl = document.getElementById(strategyId);
    const sliderVal = sliderEl ? parseInt(sliderEl.value) : 0;
    if (sliderVal > 0) { marker.classList.add('active'); zone.classList.add('active'); }

    interventionPlacementsRef.current[markerId] = { markerId, strategyId, lngLat, screenX: x, screenY: y, strategy };
    updateSim();
  }, [updateSim]);

  // ─── DELETE INTERVENTION MARKER ───────────────────────────
  const deleteInterventionMarker = useCallback((markerId, event) => {
    if (event) event.stopPropagation();
    const marker = document.querySelector(`.intervention-marker[data-marker-id="${markerId}"]`);
    const zone = document.querySelector(`.impact-zone[data-marker-id="${markerId}"]`);
    if (marker) marker.remove();
    if (zone) zone.remove();
    delete interventionPlacementsRef.current[markerId];
    updateSim();
  }, [updateSim]);

  // ─── UPDATE INTERVENTION COORDINATES ─────────────────────
  const updateInterventionCoordinates = useCallback((markerId, x, y) => {
    const placement = interventionPlacementsRef.current[markerId];
    const map = mapRef.current;
    if (!placement || !map) return;
    placement.lngLat = map.unproject([x, y]);
    placement.screenX = x;
    placement.screenY = y;
    const zone = document.querySelector(`.impact-zone[data-marker-id="${markerId}"]`);
    if (zone) { zone.style.left = (x - 100) + 'px'; zone.style.top = (y - 100) + 'px'; }
  }, []);

  // ─── DATA FETCHING ─────────────────────────────────────────
  const handleDataSuccess = useCallback((newData, source) => {
    if (!validateDataRanges(newData)) {
      logAudit('VALIDATION_FAILED', `Bad data from ${source}`, 'FAILED');
      if (source === 'primary') throw new Error('Validation failed');
      handleTotalFailure();
      return;
    }
    liveDataRef.current = { ...newData, co2_baseline: 1000 };
    dataStatusRef.current = { lastFetch: new Date(), isLive: true, source, apiHealth: 'healthy', validationPassed: true };
    updateStatus('success', `Live: ${source === 'primary' ? 'Open-Meteo' : 'OpenWeatherMap'}`);
    logAudit('DATA_UPDATE', `Updated via ${source}`, 'SUCCESS');
    setNavStatusText(`Live: ${source === 'primary' ? 'Open-Meteo' : 'OpenWeatherMap'}`);
    updateSim();
    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(() => initiateDataFetch(), 15 * 60 * 1000);
  }, [updateStatus, logAudit, updateSim]);

  const handleTotalFailure = useCallback(() => {
    dataStatusRef.current = { ...dataStatusRef.current, apiHealth: 'failed', source: 'fallback' };
    updateStatus('fallback', 'System Offline (Using Fallback)');
    logAudit('FALLBACK_ACTIVATED', 'Using hardcoded simulation data', 'FALLBACK');
    updateSim();
    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(() => initiateDataFetch(), 2 * 60 * 1000);
  }, [updateStatus, logAudit, updateSim]);

  const initiateDataFetch = useCallback(() => {
    const loc = currentLocationRef.current;
    updateStatus('fetching', 'Connecting to Primary API...');
    logAudit('FETCH_INITIATED', 'Starting fetch sequence', 'INITIATED');
    fetchPrimaryAPI(loc.lat, loc.lon)
      .then(data => handleDataSuccess(data, 'primary'))
      .catch(error => {
        console.warn('Primary Failed:', error);
        logAudit('PRIMARY_FAILED', error.message, 'FAILED');
        updateStatus('warning', 'Primary failed. Switching to OpenWeatherMap...');
        logAudit('FAILOVER_TRIGGERED', 'Switching to Secondary API', 'WARNING');
        return fetchSecondaryAPI(loc.lat, loc.lon);
      })
      .then(data => { if (data) handleDataSuccess(data, 'secondary'); })
      .catch(error => {
        console.error('All APIs Failed:', error);
        logAudit('TOTAL_FAILURE', 'Both APIs unresponsive', 'FAILED');
        handleTotalFailure();
      });
  }, [updateStatus, logAudit, handleDataSuccess, handleTotalFailure]);

  // ─── LOCATION SEARCH ──────────────────────────────────────
  const searchLocation = useCallback(async () => {
    const q = locationInputRef.current ? locationInputRef.current.value.trim() : '';
    if (!q) return;
    setLocationStatus('Searching...');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`, { headers: { 'Accept-Language': 'en' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data || !data.length) { setLocationStatus(`No results found for "${q}"`); return; }
      const place = data[0];
      setLocationFn(parseFloat(place.lat), parseFloat(place.lon), place.display_name.split(',').slice(0, 3).join(', '));
    } catch (err) {
      console.error(err);
      setLocationStatus('Search failed. Try a different name.');
    }
  }, []);

  const setLocationFn = useCallback((lat, lon, label) => {
    currentLocationRef.current = { lat, lon, label: label || `${lat.toFixed(3)}, ${lon.toFixed(3)}` };
    setLocationStatus(currentLocationRef.current.label);
    setNavStatusText(currentLocationRef.current.label);
    const map = mapRef.current;
    if (map) map.flyTo({ center: [lon, lat], zoom: 14, essential: true });
    initiateDataFetch();
  }, [initiateDataFetch]);

  // ─── SLIDER UPDATE ─────────────────────────────────────────
  const handleUpdateVal = useCallback((id, rawValue) => {
    const val = parseInt(rawValue);
    setSliderValues(prev => ({ ...prev, [id]: val }));

    // Update marker active states
    document.querySelectorAll(`.intervention-marker[data-strategy-id="${id}"]`)
      .forEach(m => val > 0 ? m.classList.add('active') : m.classList.remove('active'));
    document.querySelectorAll(`.impact-zone[data-strategy-id="${id}"]`)
      .forEach(z => val > 0 ? z.classList.add('active') : z.classList.remove('active'));
    updateSim();
  }, [updateSim]);

  // ─── DRAG & DROP FROM PANEL ────────────────────────────────
  const handleDragStart = useCallback((e, strategyId) => {
    isDraggingFromPanelRef.current = true;
    e.dataTransfer.setData('intervention-id', strategyId);
    e.target.classList.add('dragging');
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.target.classList.remove('dragging');
    isDraggingFromPanelRef.current = false;
  }, []);

  // ─── POLLUTANT CHANGE ─────────────────────────────────────
  const handlePollutantChange = useCallback((e) => {
    setPollutantValue(e.target.value);
    // updateSim will run on next tick after state update
    setTimeout(() => updateSim(), 0);
  }, [updateSim]);

  // ─── MAP READY CALLBACK ───────────────────────────────────
  const onMapReady = useCallback((map) => {
    // Start data fetch
    initiateDataFetch();

    // Map move/zoom → update marker positions
    map.on('move', updateMarkerPositions);
    map.on('zoom', updateMarkerPositions);
  }, [initiateDataFetch, updateMarkerPositions]);

  // ─── DRAG & DROP SETUP (document-level listeners) ─────────
  useEffect(() => {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };
    const handleDrop = (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('intervention-id');
      if (id) placeIntervention(id, e.clientX, e.clientY);
    };

    mapEl.addEventListener('dragover', handleDragOver);
    mapEl.addEventListener('drop', handleDrop);

    const handleMouseDown = (e) => {
      const marker = e.target.closest('.intervention-marker');
      if (marker) {
        // Check if delete button was clicked
        const deleteBtn = e.target.closest('.marker-delete');
        if (deleteBtn) {
          const markerId = deleteBtn.dataset.deleteMarker;
          if (markerId) {
            deleteInterventionMarker(markerId, e);
          }
          return;
        }
        draggedElementRef.current = marker;
        draggedMarkerIdRef.current = marker.dataset.markerId;
        marker.style.cursor = 'grabbing';
      }
    };
    const handleMouseMove = (e) => {
      if (draggedElementRef.current && draggedMarkerIdRef.current) {
        updateInterventionCoordinates(draggedMarkerIdRef.current, e.clientX, e.clientY);
        draggedElementRef.current.style.left = (e.clientX - 30) + 'px';
        draggedElementRef.current.style.top = (e.clientY - 30) + 'px';
        updateSim();
      }
    };
    const handleMouseUp = () => {
      if (draggedElementRef.current) {
        draggedElementRef.current.style.cursor = 'move';
        draggedElementRef.current = null;
        draggedMarkerIdRef.current = null;
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      mapEl.removeEventListener('dragover', handleDragOver);
      mapEl.removeEventListener('drop', handleDrop);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [placeIntervention, deleteInterventionMarker, updateInterventionCoordinates, updateSim]);

  // ─── BODY STYLE FOR ANALYST PAGE ─────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.background = '#e8f0ed';
    return () => {
      document.body.style.overflow = '';
      document.body.style.background = '';
    };
  }, []);

  // ─── CLEANUP TIMERS ───────────────────────────────────────
  useEffect(() => {
    return () => {
      if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    };
  }, []);

  // ─── SAVE SIMULATION (reads computed values, sends to backend) ─
  const handleSave = useCallback(async () => {
    const payload = {
      title: `Simulation — ${currentLocationRef.current.label || 'Unknown'}`,
      location: {
        name: currentLocationRef.current.label || '',
        lat: currentLocationRef.current.lat,
        lon: currentLocationRef.current.lon
      },
      interventions: { ...interventionPlacementsRef.current },
      sliderValues: { ...sliderValues },
      markers: Object.values(interventionPlacementsRef.current).map(p => ({
        markerId: p.markerId,
        strategyId: p.strategyId,
        lngLat: { lng: p.lngLat.lng, lat: p.lngLat.lat }
      })),
      results: {
        AQI: currentAQIRef.current.value,
        PM25: liveDataRef.current.pm2_5,
        PM10: liveDataRef.current.pm10,
        CO: liveDataRef.current.co,
        NO2: liveDataRef.current.no2
      }
    };

    if (activeSimulationId) {
      // UPDATE existing simulation
      await updateSimulation(token, activeSimulationId, payload);
    } else {
      // CREATE new simulation & store the ID
      const result = await saveSimulation(token, payload);
      if (result && result.simulation && result.simulation._id) {
        setActiveSimulationId(result.simulation._id);
      }
    }
  }, [token, sliderValues, activeSimulationId]);

  // ─── LOAD SIMULATION (restores state from saved data) ──────
  const handleLoadSimulation = useCallback((simulation) => {
    // Restore location
    if (simulation.location) {
      const lat = simulation.location.lat;
      const lon = simulation.location.lon;
      const label = simulation.location.name || `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
      currentLocationRef.current = { lat, lon, label };
      setLocationStatus(label);
      setNavStatusText(label);
      const map = mapRef.current;
      if (map) map.flyTo({ center: [lon, lat], zoom: 14, essential: true });
    }

    // Clear existing markers from DOM
    const markersContainer = document.getElementById('intervention-markers');
    if (markersContainer) markersContainer.innerHTML = '';
    interventionPlacementsRef.current = {};

    // Restore slider values
    if (simulation.sliderValues) {
      const newVals = {};
      STRATEGIES.forEach(s => {
        newVals[s.id] = simulation.sliderValues[s.id] || 0;
      });
      setSliderValues(newVals);
    }

    // Restore markers after a tick (so sliders are updated)
    setTimeout(() => {
      if (simulation.markers && simulation.markers.length > 0 && mapRef.current) {
        simulation.markers.forEach(m => {
          const map = mapRef.current;
          const point = map.project(m.lngLat);
          placeIntervention(m.strategyId, point.x, point.y);
        });
      }
      // Re-fetch live data for new location
      initiateDataFetch();
    }, 100);
  }, [placeIntervention, initiateDataFetch]);

  // ─── EDIT SIMULATION (loads + sets active ID for session editing) ─
  const handleEditSimulation = useCallback((simulation) => {
    setActiveSimulationId(simulation._id);
    handleLoadSimulation(simulation);
  }, [handleLoadSimulation]);

  // ─── CREATE NEW SIMULATION (resets everything) ────────────
  const handleCreateNewSimulation = useCallback(() => {
    setActiveSimulationId(null);

    // Clear existing markers from DOM
    const markersContainer = document.getElementById('intervention-markers');
    if (markersContainer) markersContainer.innerHTML = '';
    interventionPlacementsRef.current = {};

    // Reset slider values
    const resetVals = {};
    STRATEGIES.forEach(s => { resetVals[s.id] = 0; });
    setSliderValues(resetVals);

    // Reset display values
    setValCur('--');
    setValSim('--');
    setValAqi('--');
    setAqiBadge({ text: '--', color: 'var(--muted)' });
    setAqiCardBorderColor('var(--muted)');
    setAqiChange('');
    setValCo2('0%');

    // Re-run simulation with cleared state
    setTimeout(() => updateSim(), 50);
  }, [updateSim]);

  // ─── DELETE SIMULATION (clears active ID if needed) ───────
  const handleDeleteSimulation = useCallback((deletedId) => {
    if (activeSimulationId === deletedId) {
      setActiveSimulationId(null);
    }
  }, [activeSimulationId]);

  return (
    <>
      <AnalystNav
        navStatusText={navStatusText}
        onSave={handleSave}
        onLoad={() => setShowLoadModal(true)}
        activeSimulationId={activeSimulationId}
      />
      <LeftPanel
        locationStatus={locationStatus}
        onSearchLocation={searchLocation}
        onPollutantChange={handlePollutantChange}
        pollutantValue={pollutantValue}
        valCur={valCur}
        lblCur={lblCur}
        valSim={valSim}
        lblSim={lblSim}
        valAqi={valAqi}
        aqiBadge={aqiBadge}
        aqiCardBorderColor={aqiCardBorderColor}
        aqiChange={aqiChange}
        valCo2={valCo2}
        lblCo2={lblCo2}
        co2CardStyle={co2CardStyle}
        aqiBreakdown={aqiBreakdown}
        aqiDescription={aqiDescription}
        aqiDescriptionBorderColor={aqiDescriptionBorderColor}
        statusIndicatorColor={statusIndicatorColor}
        statusText={statusText}
        statusTime={statusTime}
        onShowAuditLog={() => setShowAuditModal(true)}
        locationInputRef={locationInputRef}
      />
      <RightPanel
        sliderValues={sliderValues}
        onUpdateVal={handleUpdateVal}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      <div id="intervention-markers"></div>
      <MapView
        mapRef={mapRef}
        currentLocation={currentLocationRef.current}
        onMapReady={onMapReady}
      />
      <HeatmapLegend />
      <AqiScaleBox />
      {showAuditModal && (
        <AuditLogModal
          auditLog={auditLogRef.current}
          dataStatus={dataStatusRef.current}
          onClose={() => setShowAuditModal(false)}
        />
      )}
      {showLoadModal && (
        <LoadModal
          token={token}
          onLoad={handleLoadSimulation}
          onEdit={handleEditSimulation}
          onCreateNew={handleCreateNewSimulation}
          onDelete={handleDeleteSimulation}
          activeSimulationId={activeSimulationId}
          onClose={() => setShowLoadModal(false)}
        />
      )}
    </>
  );
}
