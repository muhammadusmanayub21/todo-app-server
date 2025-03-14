const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./src/middleware/error');
const authRoutes = require('./src/routes/auth');
const todoRoutes = require('./src/routes/todo');

// Initialize Express app
const app = express();



app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,  // Very important for cookies!
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Error handling middleware
app.use(errorHandler);

module.exports = app;