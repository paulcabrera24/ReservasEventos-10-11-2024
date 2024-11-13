import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { getConnection } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here_123');
    
    // Obtener información completa del usuario
    const pool = await getConnection();
    const result = await pool.request()
      .input('userId', decoded.userId)
      .query(`
        SELECT 
          u.id,
          u.email,
          u.first_name as firstName,
          u.last_name as lastName,
          r.name as role,
          r.description as roleDescription
        FROM Users u
        JOIN Roles r ON u.role_id = r.id
        WHERE u.id = @userId
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = result.recordset[0];
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(403).json({ message: 'Token inválido' });
  }
};