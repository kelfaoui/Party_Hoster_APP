import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import SalleController from '../controllers/salleController.js';
import { authMiddleware, proprietaireMiddleware } from '../middleware/auth.js';

const uploadDir = 'uploads/salles/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'salle-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

const router = express.Router();

router.get('/', SalleController.getAll);
router.get('/disponibilites', SalleController.getDisponibilites);
router.get('/mes-salles', authMiddleware, SalleController.getMesSalles);
router.get('/:id', SalleController.getById);
router.get('/:id/reservations', authMiddleware, SalleController.getReservations);
router.post('/', upload.single('image'), authMiddleware, proprietaireMiddleware, SalleController.create);
router.put('/:id', authMiddleware, SalleController.update);
router.post('/upload-image', upload.single('image'), SalleController.uploadImage);
router.delete('/:id', authMiddleware, SalleController.delete);

export default router;
