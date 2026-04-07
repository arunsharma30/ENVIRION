/* ============================================================
   ENVIRION – API Service (services/api.js)
   EXACT copy from analyst.js — DO NOT MODIFY
   ============================================================ */

export const API_CONFIG = {
  primary: {
    id: 'open_meteo',
    name: 'Open-Meteo (Primary)',
    buildUrl: (lat, lon) =>
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide`
  },
  secondary: {
    id: 'open_weather',
    name: 'OpenWeatherMap (Fallback)',
    key: 'INSERT_OPENWEATHER_KEY_HERE',
    url: (lat, lon, key) =>
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`
  }
};

const API_TIMEOUT = 8000;

export async function fetchPrimaryAPI(lat, lon) {
  const c  = new AbortController();
  const id = setTimeout(() => c.abort(), API_TIMEOUT);
  try {
    const url = API_CONFIG.primary.buildUrl(lat, lon);
    const r   = await fetch(url, { signal: c.signal });
    clearTimeout(id);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    if (!d.current) throw new Error('Invalid structure');
    return { pm2_5: d.current.pm2_5, pm10: d.current.pm10, co: d.current.carbon_monoxide, no2: d.current.nitrogen_dioxide };
  } catch(e) { clearTimeout(id); throw e; }
}

export async function fetchSecondaryAPI(lat, lon) {
  if (API_CONFIG.secondary.key.includes('INSERT')) throw new Error('Missing OpenWeatherMap Key');
  const c  = new AbortController();
  const id = setTimeout(() => c.abort(), API_TIMEOUT);
  try {
    const url  = API_CONFIG.secondary.url(lat, lon, API_CONFIG.secondary.key);
    const r    = await fetch(url, { signal: c.signal });
    clearTimeout(id);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    if (!d.list || !d.list[0].components) throw new Error('Missing AQI data');
    const comp = d.list[0].components;
    return { pm2_5: comp.pm2_5, pm10: comp.pm10, co: comp.co, no2: comp.no2 };
  } catch(e) { clearTimeout(id); throw e; }
}

export function validateDataRanges(d) {
  return !(d.pm2_5 < 0 || d.pm2_5 > 900 || d.pm10 < 0 || d.pm10 > 1000);
}

export function hashData(d) {
  return JSON.stringify(d).split('').reduce((a,b) => { a = ((a<<5)-a) + b.charCodeAt(0); return a&a; }, 0).toString(16);
}
