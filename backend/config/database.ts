import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la base de données avec logs pour debug
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'reservations_salles',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Ajout de options pour Railway
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    timeout: 10000
};

console.log('=== DATABASE CONFIG ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('SSL enabled:', dbConfig.ssl);
console.log('========================');

const pool = mysql.createPool(dbConfig);

// Test de connexion au démarrage
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connection successful');
        console.log('Connected to database:', connection.config.database);
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        console.error('Error details:', {
            code: (error as any).code,
            errno: (error as any).errno,
            sqlMessage: (error as any).sqlMessage,
            sqlState: (error as any).sqlState
        });
    }
};

// Tester la connexion au démarrage
testConnection();

export { pool };
