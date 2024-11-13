import { getConnection } from '../config/database.js';

export class UserRepository {
  async findByEmail(email) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', email)
      .query(`
        SELECT DISTINCT
          u.id,
          u.email,
          u.password,
          u.first_name,
          u.last_name,
          u.role_id,
          r.name as role
        FROM Users u
        JOIN Roles r ON u.role_id = r.id 
        WHERE u.email = @email
      `);
    return result.recordset[0];
  }

  async create(userData) {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('firstName', userData.firstName)
      .input('lastName', userData.lastName)
      .input('email', userData.email)
      .input('password', userData.password)
      .input('roleId', 2) // Usuario regular
      .query(`
        INSERT INTO Users (first_name, last_name, email, password, role_id)
        OUTPUT 
          INSERTED.id,
          INSERTED.first_name,
          INSERTED.last_name,
          INSERTED.email,
          INSERTED.role_id
        VALUES (@firstName, @lastName, @email, @password, @roleId)
      `);
    
    return result.recordset[0];
  }
}