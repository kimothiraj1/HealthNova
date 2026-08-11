const getHealthStatus = (req, res) => {
  res.json({ status: 'OK', message: 'HealthNova API is healthy' });
};

module.exports = { getHealthStatus };