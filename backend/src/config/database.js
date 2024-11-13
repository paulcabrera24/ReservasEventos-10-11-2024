import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '456',
  server: process.env.DB_SERVER || 'localhost',
  database: 'EventBookingDB',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool;

export async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(dbConfig);
    }
    return pool;
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    throw error;
  }
}