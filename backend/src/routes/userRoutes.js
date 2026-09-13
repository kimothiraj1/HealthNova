const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authLimiter = require('../middleware/rateLimiter');
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/register',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  registerUser
);

router.post('/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  loginUser
);

module.exports = router;