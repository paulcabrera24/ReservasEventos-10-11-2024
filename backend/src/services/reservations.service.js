import { getConnection } from '../config/database.js';

export class ReservationsService {
  async create(userId, reservationData) {
    const pool = await getConnection();
    const { eventDate, participants } = reservationData;
    
    const transaction = await pool.transaction();
    
    try {
      await transaction.begin();

      // Crear la reserva
      const result = await transaction.request()
        .input('userId', userId)
        .input('eventDate', eventDate)
        .input('participantCount', participants.length)
        .query(`
          INSERT INTO Reservations (user_id, event_date, participant_count, status)
          OUTPUT 
            INSERTED.id,
            INSERTED.user_id,
            INSERTED.event_date,
            INSERTED.participant_count,
            INSERTED.status,
            INSERTED.created_at
          VALUES (@userId, @eventDate, @participantCount, 'pending')
        `);

      const reservation = result.recordset[0];

      // Insertar participantes
      for (const participant of participants) {
        await transaction.request()
          .input('reservationId', reservation.id)
          .input('dni', participant.dni)
          .input('instagram', participant.instagram)
          .query(`
            INSERT INTO Participants (reservation_id, dni, instagram_account)
            VALUES (@reservationId, @dni, @instagram)
          `);
      }

      await transaction.commit();
      return reservation;
    } catch (error) {
      await transaction.rollback();
      console.error('Error al crear reserva:', error);
      throw error;
    }
  }

  async getUserReservations(userId) {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT 
          r.id,
          r.event_date,
          r.participant_count,
          r.status,
          r.created_at,
          p.dni,
          p.instagram_account
        FROM Reservations r
        LEFT JOIN Participants p ON r.id = p.reservation_id
        WHERE r.user_id = @userId
        ORDER BY r.created_at DESC
      `);

    // Agrupar participantes por reserva
    const reservations = new Map();
    result.recordset.forEach(row => {
      if (!reservations.has(row.id)) {
        reservations.set(row.id, {
          id: row.id,
          eventDate: row.event_date,
          participantCount: row.participant_count,
          status: row.status,
          createdAt: row.created_at,
          participants: []
        });
      }

      if (row.dni) {
        reservations.get(row.id).participants.push({
          dni: row.dni,
          instagram: row.instagram_account
        });
      }
    });

    return Array.from(reservations.values());
  }

  async cancel(userId, reservationId) {
    const pool = await getConnection();
    
    try {
      // Verificar que la reserva existe y pertenece al usuario
      const reservationResult = await pool.request()
        .input('reservationId', reservationId)
        .input('userId', userId)
        .query(`
          SELECT id, status
          FROM Reservations
          WHERE id = @reservationId AND user_id = @userId AND status != 'cancelled'
        `);

      if (reservationResult.recordset.length === 0) {
        throw new Error('Reserva no encontrada o ya cancelada');
      }

      // Cancelar la reserva
      await pool.request()
        .input('reservationId', reservationId)
        .query(`
          UPDATE Reservations
          SET status = 'cancelled', updated_at = GETDATE()
          WHERE id = @reservationId
        `);

      return { message: 'Reserva cancelada exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}