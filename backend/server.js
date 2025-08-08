const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const generationRoutes = require('./routes/generationRoutes');
const imageRoutes = require('./routes/imageRoutes');
const productRoutes = require('./routes/productRoutes');
const testRoutes = require('./routes/testRoutes');
const placeholderRoutes = require('./routes/placeholderRoutes');
const fashnRoutes = require('./routes/fashnRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://31.220.81.177', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/drampa')
.then(async () => {
  console.log('MongoDB connected successfully');
  
  // Ensure indexes are created
  const User = require('./models/User');
  try {
    await User.ensureIndexes();
    console.log('Database indexes ensured');
  } catch (error) {
    console.error('Error ensuring indexes:', error);
  }
})
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/generation', generationRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/products', productRoutes);
app.use('/api/test', testRoutes);
app.use('/api', fashnRoutes);
app.use('/api', placeholderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});