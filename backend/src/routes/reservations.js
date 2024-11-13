import express from 'express';
import { ReservationsController } from '../controllers/reservations.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();
const reservationsController = new ReservationsController();

router.use(authenticateToken);

router.post('/', (req, res, next) => reservationsController.create(req, res, next));
router.get('/user', (req, res, next) => reservationsController.getUserReservations(req, res, next));
router.put('/:id/cancel', (req, res, next) => reservationsController.cancel(req, res, next));

export default router;