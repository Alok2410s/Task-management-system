const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Start server only after DB is ready (or mock is set up)
(async () => {
  await connectDB();

  // Routes – loaded AFTER connectDB so the mock can patch models
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/tasks', require('./routes/taskRoutes'));

  // Health check
  app.get('/', (req, res) =>
    res.json({ message: 'Task Manager API running' })
  );

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: err.message || 'Internal Server Error'
    });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})();