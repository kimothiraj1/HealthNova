const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required']
  },
  sleepHours: {
    type: Number,
    required: [true, 'Sleep hours is required']
  },
  steps: {
    type: Number,
    required: [true, 'Steps is required']
  },
  waterIntake: {
    type: Number,
    required: [true, 'Water intake is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthLog', healthLogSchema);