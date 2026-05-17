require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({ message: '🏠 ApnaRoom API is running', status: 'ok' });
});

// ===== API ROUTES =====
app.use('/api', authRoutes);

// ===== CONNECT TO DB =====
connectDB();

// ===== START SERVER (only when running directly, not via Vercel) =====
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🏠 ApnaRoom API running at http://localhost:${PORT}`);
    console.log(`📦 Database: MongoDB Atlas\n`);
  });
}

// Export for Vercel serverless
module.exports = app;
