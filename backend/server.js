const express = require('express');
const healthRoutes = require('./src/routes/healthRoutes');

const app = express();
const PORT = 5000;

app.use('/api/health', healthRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});