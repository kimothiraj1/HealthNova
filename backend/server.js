require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const healthRoutes = require('./src/routes/healthRoutes');
const userRoutes = require('./src/routes/userRoutes');
const healthLogRoutes = require('./src/routes/healthLogRoutes');
const predictionRoutes = require('./src/routes/predictionRoutes');
const requestLogger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://health-nova-liart.vercel.app'
  ],
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/logs', healthLogRoutes);
app.use('/api/predict', predictionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});