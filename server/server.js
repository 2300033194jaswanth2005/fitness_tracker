require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes    = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow known origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://fitness-tracker-virid-seven.vercel.app',
    'https://fitness-tracker-oaxn.onrender.com',
  ],
  credentials: true,
}));

app.use(express.json());

// Rate limit auth routes — max 20 requests per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later.' },
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/workouts', workoutRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));
