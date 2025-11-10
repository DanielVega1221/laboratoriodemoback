require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const orderRoutes = require('./routes/orders');
const protocolRoutes = require('./routes/protocols');
const resultRoutes = require('./routes/results');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://tu-frontend.vercel.app' // usa FRONTEND_URL en producción si está definida
    : '*'
}));
app.use(express.json());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✓ MongoDB conectado'))
  .catch(err => {
    console.error('✗ Error conectando MongoDB:', err.message);
    console.error('Verifica que la IP de Render esté en la whitelist de MongoDB Atlas');
    // En producción, podrías querer mantener el servidor corriendo
    // pero sin DB para health checks
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/protocols', protocolRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/reports', reportRoutes);

// Root route: evita 404 en GET / y ofrece un punto rápido de chequeo
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'laboratorio-backend',
    env: process.env.NODE_ENV || 'development',
    health: '/api/health'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en puerto ${PORT}`);
});
