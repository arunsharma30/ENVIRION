/* ============================================================
   ENVIRION – Backend API Service (services/backend.js)
   Handles auth + simulation persistence calls
   NOTE: Does NOT touch services/api.js (Open-Meteo/OpenWeatherMap)
   ============================================================ */

const API_BASE = '/api';

// ─── AUTH ─────────────────────────────────────────────────
export async function signupAPI(name, email, password, region) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, region })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function loginAPI(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Auth check failed');
  return data;
}

// ─── SIMULATIONS ──────────────────────────────────────────
export async function saveSimulation(token, payload) {
  const res = await fetch(`${API_BASE}/simulation/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Save failed');
  return data;
}

export async function getHistory(token) {
  const res = await fetch(`${API_BASE}/simulation/history`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Fetch history failed');
  return data;
}

export async function getSimulation(token, id) {
  const res = await fetch(`${API_BASE}/simulation/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Fetch simulation failed');
  return data;
}

export async function updateSimulation(token, id, payload) {
  const res = await fetch(`${API_BASE}/simulation/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Update failed');
  return data;
}

export async function deleteSimulation(token, id) {
  const res = await fetch(`${API_BASE}/simulation/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Delete failed');
  return data;
}

