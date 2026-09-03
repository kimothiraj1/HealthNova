const { validationResult } = require('express-validator');
const HealthLog = require('../models/HealthLog');

const createHealthLog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, weight, sleepHours, steps, waterIntake } = req.body;

    const newLog = await HealthLog.create({
      user: req.user.id,
      date,
      weight,
      sleepHours,
      steps,
      waterIntake
    });

    res.status(201).json({
      message: 'Health log created successfully',
      log: newLog
    });
  } catch (err) {
    next(err);
  }
};

const getMyHealthLogs = async (req, res, next) => {
  try {
    const logs = await HealthLog.find({ user: req.user.id }).sort({ date: -1 });

    res.json({
      count: logs.length,
      logs
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createHealthLog, getMyHealthLogs };