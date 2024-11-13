import express from 'express';
import { EventsController } from '../controllers/events.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/admin.js';

const router = express.Router();
const eventsController = new EventsController();

router.use(authenticateToken);

// Rutas públicas (requieren autenticación)
router.get('/', (req, res, next) => eventsController.getAll(req, res, next));
router.get('/:id', (req, res, next) => eventsController.getById(req, res, next));

// Rutas administrativas
router.post('/', isAdmin, (req, res, next) => eventsController.create(req, res, next));
router.put('/:id', isAdmin, (req, res, next) => eventsController.update(req, res, next));
router.delete('/:id', isAdmin, (req, res, next) => eventsController.delete(req, res, next));

export default router;