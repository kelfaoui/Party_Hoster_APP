import express from 'express';
import ReservationController from '../controllers/reservationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, ReservationController.create);
router.get('/mes-reservations', authMiddleware, ReservationController.getMesReservations);
router.get('/owner-reservations', authMiddleware, ReservationController.getOwnerReservations);
router.get('/', authMiddleware, ReservationController.getAll);
router.get('/:id', authMiddleware, ReservationController.getById);
router.put('/:id/statut', authMiddleware, ReservationController.updateStatus);
router.put('/:id/annuler', authMiddleware, ReservationController.annuler);
router.delete('/:id', authMiddleware, ReservationController.delete);

export default router;
