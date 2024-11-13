import { EventsService } from '../services/events.service.js';
import { z } from 'zod';

const eventsService = new EventsService();

// Schema de validación para crear evento
const createEventSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  capacity: z.number().int().min(1, 'La capacidad debe ser mayor a 0').max(100, 'La capacidad máxima es 100')
});

export class EventsController {
  async create(req, res, next) {
    try {
      const validatedData = createEventSchema.parse(req.body);
      
      // Validar que la fecha sea futura
      const eventDate = new Date(validatedData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate <= today) {
        return res.status(400).json({ message: 'La fecha debe ser posterior a hoy' });
      }

      const event = await eventsService.create(validatedData);
      res.status(201).json(event);
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

  async getAll(req, res, next) {
    try {
      const events = await eventsService.getAll();
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const event = await eventsService.getById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const event = await eventsService.update(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await eventsService.delete(req.params.id);
      res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}