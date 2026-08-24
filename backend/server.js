require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const requestLogger = require('./middleware/requestLogger');
const authGuard = require('./middleware/authGuard');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Global Request Logger Middleware
app.use(requestLogger);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', authGuard, orderRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'QuickBite Food Ordering API is running live' });
});

// Global Error Handler (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
