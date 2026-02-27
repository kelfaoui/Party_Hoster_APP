const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const utilisateurRoutes = require('../backend/routes/utilisateurRoutes');
const salleRoutes = require('../backend/routes/salleRoutes');
const reservationRoutes = require('../backend/routes/reservationRoutes');

// Use routes
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/reservations', reservationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
