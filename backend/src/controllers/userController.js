const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Hashed password:', hashedPassword);

    const fakeUserId = 'temp-user-id-123';

    const token = jwt.sign(
      { id: fakeUserId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'User registered successfully',
      token: token,
      user: { name, email }
    });
  } catch (err) {
    next(err);
  }
};

// TEMPORARY fake "database" - a pre-hashed password for testing login
// This simulates a user who registered with password "test1234"
const FAKE_USER = {
  id: 'temp-user-id-123',
  name: 'Ankit Kimothi',
  email: 'ankit@example.com',
  hashedPassword: '$2b$10$XlG1cKxlnugKZ1PVJoGhm.BEroscBuOrZD4n42GYL2oXKLgK8laBO'
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email !== FAKE_USER.email) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, FAKE_USER.hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: FAKE_USER.id, email: FAKE_USER.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: { name: FAKE_USER.name, email: FAKE_USER.email }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };