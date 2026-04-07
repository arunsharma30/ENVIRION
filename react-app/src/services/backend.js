/* ============================================================
   ENVIRION – Backend API Service (services/backend.js)
   Handles auth + simulation persistence calls via Supabase
   NOTE: Does NOT touch services/api.js (Open-Meteo/OpenWeatherMap)
   ============================================================ */

import supabase from '../lib/supabaseClient';

// ─── AUTH ─────────────────────────────────────────────────
export async function signupAPI(name, email, password, region) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, region: region || '' }
    }
  });
  if (error) throw new Error(error.message);

  // Insert profile into profiles table
  const user = data.user;
  if (user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      name,
      email,
      region: region || ''
    });
    if (profileError && !profileError.message.includes('duplicate')) {
      console.warn('Profile insert warning:', profileError.message);
    }
  }

  return {
    token: data.session?.access_token || '',
    user: {
      id: user.id,
      name,
      email,
      region: region || ''
    }
  };
}

export async function loginAPI(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw new Error(error.message);

  const user = data.user;
  const meta = user.user_metadata || {};

  return {
    token: data.session?.access_token || '',
    user: {
      id: user.id,
      name: meta.name || '',
      email: user.email,
      region: meta.region || ''
    }
  };
}

export async function getMe(token) {
  // token param kept for API compatibility but Supabase manages session internally
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  const user = data.user;
  if (!user) throw new Error('Not authenticated');

  const meta = user.user_metadata || {};
  return {
    user: {
      id: user.id,
      name: meta.name || '',
      email: user.email,
      region: meta.region || ''
    }
  };
}

export async function logoutAPI() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// ─── SIMULATIONS ──────────────────────────────────────────
export async function saveSimulation(token, payload) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const row = {
    user_id: user.id,
    title: payload.title || 'Untitled Simulation',
    location: payload.location || {},
    interventions: payload.interventions || {},
    slider_values: payload.sliderValues || {},
    markers: payload.markers || [],
    results: payload.results || {}
  };

  const { data, error } = await supabase
    .from('simulations')
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Map to match existing frontend expectations (_id field)
  return {
    message: 'Simulation saved successfully.',
    simulation: {
      ...data,
      _id: data.id,
      sliderValues: data.slider_values,
      createdAt: data.created_at
    }
  };
}

export async function getHistory(token) {
  const { data, error } = await supabase
    .from('simulations')
    .select('id, title, location, results, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  // Map to match existing frontend expectations
  const simulations = (data || []).map(s => ({
    _id: s.id,
    title: s.title,
    location: s.location,
    results: s.results,
    createdAt: s.created_at
  }));

  return { simulations };
}

export async function getSimulation(token, id) {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return {
    simulation: {
      ...data,
      _id: data.id,
      sliderValues: data.slider_values,
      createdAt: data.created_at
    }
  };
}

export async function updateSimulation(token, id, payload) {
  const updates = {};
  if (payload.title !== undefined) updates.title = payload.title;
  if (payload.location !== undefined) updates.location = payload.location;
  if (payload.interventions !== undefined) updates.interventions = payload.interventions;
  if (payload.sliderValues !== undefined) updates.slider_values = payload.sliderValues;
  if (payload.markers !== undefined) updates.markers = payload.markers;
  if (payload.results !== undefined) updates.results = payload.results;

  const { data, error } = await supabase
    .from('simulations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    message: 'Simulation updated successfully.',
    simulation: {
      ...data,
      _id: data.id,
      sliderValues: data.slider_values,
      createdAt: data.created_at
    }
  };
}

export async function deleteSimulation(token, id) {
  const { error } = await supabase
    .from('simulations')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  return { message: 'Simulation deleted successfully.' };
}
