/**
 * @swagger
 * tags:
 *   name: Salles
 *   description: Gestion des salles et réservations
 */

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

/**
 * @swagger
 * /salles:
 *   get:
 *     summary: Récupérer toutes les salles
 *     tags: [Salles]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Nombre maximum de résultats
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Nombre de résultats à sauter
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         description: Filtrer par nom de salle
 *       - in: query
 *         name: localisation
 *         schema:
 *           type: string
 *         description: Filtrer par localisation
 *       - in: query
 *         name: capacite_min
 *         schema:
 *           type: integer
 *         description: Capacité minimale
 *       - in: query
 *         name: prix_max
 *         schema:
 *           type: number
 *         description: Prix maximum par heure
 *     responses:
 *       200:
 *         description: Liste des salles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salle'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', SalleController.getAll);

/**
 * @swagger
 * /salles/disponibilites:
 *   get:
 *     summary: Récupérer les salles disponibles pour une période donnée
 *     tags: [Salles]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de la réservation (YYYY-MM-DD)
 *       - in: query
 *         name: heure_debut
 *         required: true
 *         schema:
 *           type: string
 *           format: time
 *         description: Heure de début (HH:mm)
 *       - in: query
 *         name: heure_fin
 *         required: true
 *         schema:
 *           type: string
 *           format: time
 *         description: Heure de fin (HH:mm)
 *     responses:
 *       200:
 *         description: Salles disponibles récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salle'
 *       400:
 *         description: Paramètres manquants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/disponibilites', SalleController.getDisponibilites);

/**
 * @swagger
 * /salles/mes-salles:
 *   get:
 *     summary: Récupérer les salles du propriétaire connecté
 *     tags: [Salles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Salles du propriétaire récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salle'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/mes-salles', authMiddleware, SalleController.getMesSalles);

/**
 * @swagger
 * /salles/{id}:
 *   get:
 *     summary: Récupérer une salle par ID
 *     tags: [Salles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la salle
 *     responses:
 *       200:
 *         description: Salle récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salle'
 *       404:
 *         description: Salle non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', SalleController.getById);

/**
 * @swagger
 * /salles/{id}/reservations:
 *   get:
 *     summary: Récupérer les réservations d'une salle
 *     tags: [Salles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la salle
 *     responses:
 *       200:
 *         description: Réservations de la salle récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/reservations', authMiddleware, SalleController.getReservations);

/**
 * @swagger
 * /salles:
 *   post:
 *     summary: Créer une nouvelle salle (Propriétaire/Admin seulement)
 *     tags: [Salles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - description
 *               - localisation
 *               - capacite
 *               - prix_par_heure
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de la salle
 *               description:
 *                 type: string
 *                 description: Description de la salle
 *               localisation:
 *                 type: string
 *                 description: Adresse de la salle
 *               capacite:
 *                 type: integer
 *                 description: Capacité d'accueil
 *               prix_par_heure:
 *                 type: number
 *                 description: Prix par heure
 *               longitude:
 *                 type: number
 *                 description: Longitude
 *               latitude:
 *                 type: number
 *                 description: Latitude
 *               equipements:
 *                 type: string
 *                 description: Équipements disponibles
 *               disponibilite:
 *                 type: boolean
 *                 description: Disponibilité de la salle
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image de la salle
 *     responses:
 *       201:
 *         description: Salle créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 salle_id:
 *                   type: integer
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', upload.single('image'), authMiddleware, proprietaireMiddleware, SalleController.create);

/**
 * @swagger
 * /salles/{id}:
 *   put:
 *     summary: Mettre à jour une salle
 *     tags: [Salles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la salle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               localisation:
 *                 type: string
 *               capacite:
 *                 type: integer
 *               prix_par_heure:
 *                 type: number
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               equipements:
 *                 type: string
 *               image:
 *                 type: string
 *               disponibilite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Salle mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 salle:
 *                   $ref: '#/components/schemas/Salle'
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Salle non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authMiddleware, SalleController.update);

/**
 * @swagger
 * /salles/upload-image:
 *   post:
 *     summary: Uploader une image pour une salle
 *     tags: [Salles]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image de la salle
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imagePath:
 *                   type: string
 *       400:
 *         description: Aucun fichier fourni
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/upload-image', upload.single('image'), SalleController.uploadImage);

/**
 * @swagger
 * /salles/{id}:
 *   delete:
 *     summary: Supprimer une salle
 *     tags: [Salles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la salle
 *     responses:
 *       200:
 *         description: Salle supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Salle non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authMiddleware, SalleController.delete);

export default router;
