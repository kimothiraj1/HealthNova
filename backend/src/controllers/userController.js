const { validationResult } = require('express-validator');

const registerUser = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    console.log('Received registration data:', req.body);

    res.json({
      message: 'User data received successfully',
      receivedData: { name, email }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser };