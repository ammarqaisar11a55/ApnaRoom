require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');


const app = express();

const stripTrailingSlash = (value) => value.replace(/\/+$/, '');
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
  .map(stripTrailingSlash);

// ===== SECURITY + CORE MIDDLEWARE =====
app.set('trust proxy', 1);
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    const normalizedOrigin = stripTrailingSlash(origin);
    if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use((req, _res, next) => {
  const clean = (value) => {
    if (typeof value === 'string') return value.replace(/[<>]/g, '');
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === 'object') {
      Object.keys(value).forEach((key) => {
        if (key.startsWith('$') || key.includes('.')) {
          delete value[key];
          return;
        }
        value[key] = clean(value[key]);
      });
    }
    return value;
  };
  clean(req.body);
  clean(req.query);
  clean(req.params);
  next();
});

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 250,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again.' },
}));
app.use('/api', async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({ message: 'ApnaRoom API is running', status: 'ok' });
});

// ===== API ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);


app.use(notFound);
app.use(errorHandler);

// ===== START SERVER (only when running directly) =====
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`\nApnaRoom API running at http://localhost:${PORT}`);
        console.log('Database: MongoDB\n');
      });
    })
    .catch((error) => {
      console.error(`❌ Failed to start server: ${error.message}`);
      process.exit(1);
    });
}

// Export for Vercel serverless
module.exports = app;
