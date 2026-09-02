const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const protect = require('../middleware/authMiddleware');
const { createHealthLog, getMyHealthLogs } = require('../controllers/healthLogController');

router.post('/',
  protect,
  [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('weight').isNumeric().withMessage('Weight must be a number'),
    body('sleepHours').isNumeric().withMessage('Sleep hours must be a number'),
    body('steps').isNumeric().withMessage('Steps must be a number'),
    body('waterIntake').isNumeric().withMessage('Water intake must be a number')
  ],
  createHealthLog
);

router.get('/', protect, getMyHealthLogs);

module.exports = router;