/**
 * Configuration de connexion à la base de données (Node.js/Express)
 * 
 * IMPORTANT: Utilisez des variables d'environnement pour la production
 * Créez un fichier .env avec vos identifiants
 */

module.exports = {
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tbc_groupe',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};

// Exemple d'utilisation avec mysql2
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tbc_groupe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

module.exports.pool = pool;

