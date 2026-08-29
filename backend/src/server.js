const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { sequelize, testConnection } = require('./config/database');
// Import models to ensure associations are registered
require('./models');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// Start server and connect to database
const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: false });
    console.log('✅ Database schema synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Store Rating Platform Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
