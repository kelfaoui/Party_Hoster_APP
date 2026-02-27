const express = require('express');
const cors = require('cors');
const path = require('path');

// Use pg for PostgreSQL (Supabase)
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
let pool;

async function initDB() {
  try {
    if (process.env.DATABASE_URL) {
      // Use Supabase PostgreSQL
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
    } else {
      // Fallback to local MySQL development
      console.log('No DATABASE_URL found, using local development');
      return;
    }
    
    // Test connection
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    if (!pool) await initDB();
    res.status(200).json({ status: 'OK', message: 'API is running' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Import routes (we'll create simplified versions)
app.post('/api/utilisateurs/register', async (req, res) => {
  try {
    if (!pool) await initDB();
    if (!pool) return res.status(500).json({ message: 'Database not available' });
    
    const { email, mot_de_passe, nom, prenom, numero_telephone, type } = req.body;
    
    // Check if user exists
    const existing = await pool.query('SELECT * FROM "Utilisateurs" WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hash password
    const bcrypt = require('bcryptjs');
    const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO "Utilisateurs" (email, mot_de_passe_hash, nom, prenom, numero_telephone, type, actif) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING utilisateur_id',
      [email, mot_de_passe_hash, nom, prenom, numero_telephone, type || 'Client', true]
    );
    
    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      utilisateur_id: result.rows[0].utilisateur_id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/utilisateurs/login', async (req, res) => {
  try {
    if (!pool) await initDB();
    if (!pool) return res.status(500).json({ message: 'Database not available' });
    
    const { email, mot_de_passe } = req.body;
    
    const users = await pool.query('SELECT * FROM "Utilisateurs" WHERE email = $1', [email]);
    const utilisateur = users.rows[0];
    
    if (!utilisateur) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    
    if (!utilisateur.actif) {
      return res.status(401).json({ message: 'Utilisateur bloqué' });
    }
    
    const bcrypt = require('bcryptjs');
    const passwordMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        utilisateur_id: utilisateur.utilisateur_id,
        email: utilisateur.email,
        type: utilisateur.type 
      },
      process.env.JWT_SECRET || 'votre_secret_jwt',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token,
      utilisateur: {
        utilisateur_id: utilisateur.utilisateur_id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        type: utilisateur.type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
