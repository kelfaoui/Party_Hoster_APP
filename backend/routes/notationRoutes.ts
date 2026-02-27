import express from 'express';
import NotationController from '../controllers/notationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, NotationController.createOrUpdate);
router.get('/salle/:id', NotationController.getBySalle);
router.get('/ma-notation/:id', authMiddleware, NotationController.getMaNotation);
router.delete('/salle/:salleId', authMiddleware, NotationController.delete);

export default router;
