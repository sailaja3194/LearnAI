require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const learningRoutes = require('./routes/learning');
const aiRoutes = require('./routes/ai');
const performanceRoutes = require('./routes/performance');

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174'
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  message: 'AI Smart Learning API is running'
}));

app.use('/api/auth', authRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/performance', performanceRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`API server running at http://localhost:${PORT}`));

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err.message));
} else {
  console.warn('MONGO_URI is not configured. Add it to backend/.env');
}
