require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const analyticsRoutes = require('./routes/analyticsRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
// CORS: allow local dev + future Vercel frontend (add CLIENT_URL in Render env later)
const allowedOrigins = ['http://localhost:5173', 'https://ccl-internship-siras.vercel.app',  'https://ccl-internship-siras-36blt6wgw-raunak-kumar-singh-s-projects.vercel.app'];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// ==========================================
// ROUTES
// ==========================================

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SIRAS-CCL API is running',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/reports', reportRoutes);
// ==========================================
// TEMPORARY SEED ROUTE (remove after use)
// ==========================================
app.get('/seed-users', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    
    await User.deleteMany({});
    
    const h1 = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@ccl.co.in', password: h1, role: 'admin' });
    
    const h2 = await bcrypt.hash('safety123', 10);
    await User.create({ name: 'Safety Officer', email: 'safety@ccl.co.in', password: h2, role: 'safety-officer' });
    
    const h3 = await bcrypt.hash('manager123', 10);
    await User.create({ name: 'Mine Manager', email: 'manager@ccl.co.in', password: h3, role: 'mine-manager' });
    
    const h4 = await bcrypt.hash('reporter123', 10);
    await User.create({ name: 'Reporter', email: 'reporter@ccl.co.in', password: h4, role: 'reporter' });
    
    res.json({ success: true, message: '4 users seeded successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 404 Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ==========================================
// Global Error Handler
// ==========================================
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});