const express = require('express');
const healthRoutes = require('./src/routes/healthRoutes');
const requestLogger = require('./src/middleware/logger');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(requestLogger);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});