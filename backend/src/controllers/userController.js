const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  console.log('Received registration data:', req.body);

  res.json({
    message: 'User data received successfully',
    receivedData: { name, email }
  });
};

module.exports = { registerUser };