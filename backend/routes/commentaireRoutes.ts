import express from 'express';
import CommentaireController from '../controllers/commentaireController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/salle/:id', CommentaireController.getBySalle);
router.post('/', authMiddleware, CommentaireController.create);
router.put('/:id', authMiddleware, CommentaireController.update);
router.delete('/:id', authMiddleware, CommentaireController.delete);

export default router;
