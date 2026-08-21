const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.post('/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  registerUser
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  loginUser
);
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

module.exports = router;