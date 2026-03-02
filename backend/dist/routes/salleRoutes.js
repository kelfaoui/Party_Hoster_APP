"use strict";
/**
 * @swagger
 * tags:
 *   name: Salles
 *   description: Gestion des salles et réservations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const salleController_js_1 = __importDefault(require("../controllers/salleController.js"));
const auth_js_1 = require("../middleware/auth.js");
const uploadDir = 'uploads/salles/';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, 'salle-' + uniqueSuffix + ext);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        }
        else {
            cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
        }
    }
});
const router = express_1.default.Router();
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
router.get('/', salleController_js_1.default.getAll);
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
router.get('/disponibilites', salleController_js_1.default.getDisponibilites);
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
router.get('/mes-salles', auth_js_1.authMiddleware, salleController_js_1.default.getMesSalles);
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
router.get('/:id', salleController_js_1.default.getById);
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
router.get('/:id/reservations', auth_js_1.authMiddleware, salleController_js_1.default.getReservations);
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
router.post('/', upload.single('image'), auth_js_1.authMiddleware, auth_js_1.proprietaireMiddleware, salleController_js_1.default.create);
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
router.put('/:id', auth_js_1.authMiddleware, salleController_js_1.default.update);
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
router.post('/upload-image', upload.single('image'), salleController_js_1.default.uploadImage);
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
router.delete('/:id', auth_js_1.authMiddleware, salleController_js_1.default.delete);
exports.default = router;
//# sourceMappingURL=salleRoutes.js.map