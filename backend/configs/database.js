import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (isProduction && databaseUrl) {
  // Production: Use PostgreSQL
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // For Render's SSL
      }
    },
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Development: Use SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'chatbot.db'),
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export { sequelize, testConnection };