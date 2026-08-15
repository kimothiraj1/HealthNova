const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser } = require('../controllers/userController');

router.post('/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  registerUser
);

module.exports = router;