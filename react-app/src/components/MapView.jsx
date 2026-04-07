import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapView({ mapRef, currentLocation, onMapReady }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // Map already initialized — NEVER recreate

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://api.maptiler.com/maps/hybrid/style.json?key=clnDzZdD448hn1yD8EF3',
      center: [currentLocation.lon, currentLocation.lat],
      zoom: 15, pitch: 60, bearing: -20, antialias: true
    });

    mapRef.current = map;

    map.on('load', () => {
      map.addLayer({
        'id': '3d-buildings', 'source': 'openfreemap', 'source-layer': 'building',
        'type': 'fill-extrusion', 'minzoom': 13,
        'paint': {
          'fill-extrusion-color': '#1a1a2e',
          'fill-extrusion-height': ['interpolate',['linear'],['zoom'],13,0,13.05,['get','render_height']],
          'fill-extrusion-base': ['get','render_min_height'],
          'fill-extrusion-opacity': .85
        }
      });
      map.addSource('pollution', { type:'geojson', data:{type:'FeatureCollection',features:[]} });
      map.addLayer({
        id: 'pollution-heat', type: 'heatmap', source: 'pollution', maxzoom: 20,
        paint: {
          'heatmap-weight':     ['interpolate',['linear'],['get','intensity'],0,0,1,1],
          'heatmap-intensity':  ['interpolate',['linear'],['zoom'],0,1,15,2,18,3],
          'heatmap-color':      ['interpolate',['linear'],['heatmap-density'],
            0,'rgba(0,0,0,0)',.1,'rgba(56,189,248,.6)',.3,'rgba(16,185,129,.7)',
            .5,'rgba(250,204,21,.8)',.7,'rgba(251,146,60,.85)',1,'rgba(239,68,68,.9)'],
          'heatmap-radius':     ['interpolate',['linear'],['zoom'],0,2,15,30,18,50],
          'heatmap-opacity':    .8
        }
      });
      if (onMapReady) onMapReady(map);
    });

    return () => {
      // Do NOT destroy map on unmount to prevent re-creation issues
    };
  }, []); // Empty deps — initialize ONCE

  return <div id="map" ref={containerRef}></div>;
}
