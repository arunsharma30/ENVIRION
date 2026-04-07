const express = require('express');
const Simulation = require('../models/Simulation');
const auth = require('../middleware/auth');

const router = express.Router();

// ─── SAVE SIMULATION ──────────────────────────────────────
router.post('/save', auth, async (req, res) => {
  try {
    const { title, location, interventions, sliderValues, markers, results } = req.body;

    if (!location || typeof location.lat !== 'number' || typeof location.lon !== 'number') {
      return res.status(400).json({ error: 'Valid location (lat, lon) is required.' });
    }

    const simulation = new Simulation({
      userId: req.user.id,
      title: title || 'Untitled Simulation',
      location: {
        name: location.name || location.label || '',
        lat: location.lat,
        lon: location.lon
      },
      interventions: interventions || {},
      sliderValues: sliderValues || {},
      markers: markers || [],
      results: results || {}
    });

    await simulation.save();
    res.status(201).json({ message: 'Simulation saved successfully.', simulation });
  } catch (err) {
    console.error('Save simulation error:', err);
    res.status(500).json({ error: 'Server error while saving simulation.' });
  }
});

// ─── GET SIMULATION HISTORY ───────────────────────────────
router.get('/history', auth, async (req, res) => {
  try {
    const simulations = await Simulation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('title location results createdAt');

    res.json({ simulations });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Server error while fetching history.' });
  }
});

// ─── GET SINGLE SIMULATION ───────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const simulation = await Simulation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found.' });
    }

    res.json({ simulation });
  } catch (err) {
    console.error('Get simulation error:', err);
    res.status(500).json({ error: 'Server error while fetching simulation.' });
  }
});

// ─── UPDATE SIMULATION (session-based editing) ───────────
router.put('/update/:id', auth, async (req, res) => {
  try {
    const { title, location, interventions, sliderValues, markers, results } = req.body;

    const simulation = await Simulation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found.' });
    }

    if (title !== undefined) simulation.title = title;
    if (location !== undefined) simulation.location = {
      name: location.name || location.label || '',
      lat: location.lat,
      lon: location.lon
    };
    if (interventions !== undefined) simulation.interventions = interventions;
    if (sliderValues !== undefined) simulation.sliderValues = sliderValues;
    if (markers !== undefined) simulation.markers = markers;
    if (results !== undefined) simulation.results = results;

    await simulation.save();
    res.json({ message: 'Simulation updated successfully.', simulation });
  } catch (err) {
    console.error('Update simulation error:', err);
    res.status(500).json({ error: 'Server error while updating simulation.' });
  }
});

// ─── DELETE SIMULATION ────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const simulation = await Simulation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found.' });
    }

    res.json({ message: 'Simulation deleted successfully.' });
  } catch (err) {
    console.error('Delete simulation error:', err);
    res.status(500).json({ error: 'Server error while deleting simulation.' });
  }
});

module.exports = router;
