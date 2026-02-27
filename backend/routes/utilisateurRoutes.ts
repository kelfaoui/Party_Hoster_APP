import express from 'express';
import UtilisateurController from '../controllers/utilisateurController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', UtilisateurController.register);
router.post('/login', UtilisateurController.login);
router.get('/profile', authMiddleware, UtilisateurController.getProfile);
router.put('/profile', authMiddleware, UtilisateurController.updateProfile);
router.get('/', authMiddleware, UtilisateurController.getAll);
router.get('/:id', authMiddleware, adminMiddleware, UtilisateurController.getById);
router.put('/:id', authMiddleware, adminMiddleware, UtilisateurController.update);
router.patch('/:id/activate', authMiddleware, adminMiddleware, UtilisateurController.activate);
router.patch('/:id/deactivate', authMiddleware, adminMiddleware, UtilisateurController.deactivate);
router.patch('/:id/status', authMiddleware, adminMiddleware, UtilisateurController.updateStatus);

export default router;
