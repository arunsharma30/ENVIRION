const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Simulation'
  },
  location: {
    name: { type: String, default: '' },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  interventions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  sliderValues: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  markers: {
    type: Array,
    default: []
  },
  results: {
    AQI: { type: Number, default: 0 },
    PM25: { type: Number, default: 0 },
    PM10: { type: Number, default: 0 },
    CO: { type: Number, default: 0 },
    NO2: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Simulation', simulationSchema);
