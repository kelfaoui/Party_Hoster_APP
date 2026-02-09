import express from 'express';
import UtilisateurController from '../controllers/utilisateurController.js';

const router = express.Router();

router.post('/register', UtilisateurController.register);
router.post('/login', UtilisateurController.login);

export default router;
