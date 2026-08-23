require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const healthRoutes = require('./src/routes/healthRoutes');
const userRoutes = require('./src/routes/userRoutes');
const requestLogger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

connectDB();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(requestLogger);

app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});