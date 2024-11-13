import { getConnection } from '../config/database.js';

export class EventsService {
  async create(data) {
    const pool = await getConnection();
    
    try {
      const result = await pool.request()
        .input('date', data.date)
        .input('capacity', data.capacity)
        .input('availableSpots', data.capacity)
        .query(`
          INSERT INTO Events (date, capacity, available_spots)
          OUTPUT 
            INSERTED.id,
            INSERTED.date,
            INSERTED.capacity,
            INSERTED.available_spots,
            INSERTED.is_full,
            INSERTED.created_at,
            INSERTED.updated_at
          VALUES (@date, @capacity, @availableSpots)
        `);

      return result.recordset[0];
    } catch (error) {
      if (error.number === 2627) { // Violación de clave única
        throw new Error('Ya existe un evento para esta fecha');
      }
      throw error;
    }
  }

  async getAll() {
    const pool = await getConnection();
    
    const result = await pool.request()
      .query(`
        SELECT 
          id,
          date,
          capacity,
          available_spots,
          is_full,
          created_at,
          updated_at
        FROM Events
        ORDER BY date ASC
      `);

    return result.recordset;
  }

  async getById(id) {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT 
          id,
          date,
          capacity,
          available_spots,
          is_full,
          created_at,
          updated_at
        FROM Events
        WHERE id = @id
      `);

    return result.recordset[0];
  }

  async update(id, data) {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('id', id)
      .input('date', data.date)
      .input('capacity', data.capacity)
      .query(`
        UPDATE Events
        SET 
          date = @date,
          capacity = @capacity,
          updated_at = GETDATE()
        OUTPUT 
          INSERTED.id,
          INSERTED.date,
          INSERTED.capacity,
          INSERTED.available_spots,
          INSERTED.is_full,
          INSERTED.created_at,
          INSERTED.updated_at
        WHERE id = @id
      `);

    return result.recordset[0];
  }

  async delete(id) {
    const pool = await getConnection();
    
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Events WHERE id = @id');
  }
}