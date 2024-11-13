import { ReservationsService } from '../services/reservations.service.js';
import { sendReservationConfirmationEmail } from '../services/email.service.js';
import { z } from 'zod';

const reservationsService = new ReservationsService();

// Schema de validación para participantes
const participantSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, 'DNI debe tener 8 dígitos'),
  instagram: z.string().regex(/^(?:@[\w.]{1,30}|https?:\/\/(?:www\.)?instagram\.com\/[\w.]{1,30}\/?$)/, 'Formato de Instagram inválido')
});

// Schema de validación para la reserva
const createReservationSchema = z.object({
  eventDate: z.number(),
  participants: z.array(participantSchema).min(1, 'Debe haber al menos un participante')
});

export class ReservationsController {
  async create(req, res, next) {
    try {
      const validatedData = createReservationSchema.parse(req.body);
      const userId = req.user.id;

      const reservation = await reservationsService.create(userId, {
        eventDate: new Date(validatedData.eventDate),
        participants: validatedData.participants
      });
      
      // Enviar email de confirmación (no bloqueante)
      sendReservationConfirmationEmail({
        email: req.user.email,
        firstName: req.user.firstName,
        eventDate: new Date(validatedData.eventDate),
        reservationId: reservation.id
      }).catch(error => {
        console.error('Error al enviar email de confirmación:', error);
      });

      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Error de validación', 
          errors: error.errors.map(e => e.message)
        });
      }
      next(error);
    }
  }

  async getUserReservations(req, res, next) {
    try {
      const userId = req.user.id;
      const reservations = await reservationsService.getUserReservations(userId);
      res.json(reservations);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const userId = req.user.id;
      const reservationId = req.params.id;
      
      const result = await reservationsService.cancel(userId, reservationId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}