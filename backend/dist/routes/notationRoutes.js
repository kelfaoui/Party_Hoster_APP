"use strict";
/**
 * @swagger
 * tags:
 *   name: Notations
 *   description: Gestion des notations des salles
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notationController_js_1 = __importDefault(require("../controllers/notationController.js"));
const auth_js_1 = require("../middleware/auth.js");
const router = express_1.default.Router();
/**
 * @swagger
 * /notations:
 *   post:
 *     summary: Créer ou mettre à jour une notation
 *     tags: [Notations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salle_id
 *               - note
 *             properties:
 *               salle_id:
 *                 type: integer
 *                 description: ID de la salle à noter
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Note de 1 à 5
 *     responses:
 *       200:
 *         description: Notation enregistrée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 notation_id:
 *                   type: integer
 *                 moyenne:
 *                   type: number
 *                 total_notes:
 *                   type: integer
 *       400:
 *         description: Données invalides
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
router.post('/', auth_js_1.authMiddleware, notationController_js_1.default.createOrUpdate);
/**
 * @swagger
 * /notations/salle/{id}:
 *   get:
 *     summary: Récupérer les notations d'une salle
 *     tags: [Notations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la salle
 *     responses:
 *       200:
 *         description: Notations de la salle récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notation'
 *                 moyenne:
 *                   type: number
 *                 total_notes:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/salle/:id', notationController_js_1.default.getBySalle);
/**
 * @swagger
 * /notations/ma-notation/{id}:
 *   get:
 *     summary: Récupérer ma notation pour une salle
 *     tags: [Notations]
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
 *         description: Notation de l'utilisateur récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notation'
 *       404:
 *         description: Notation non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: {}
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/ma-notation/:id', auth_js_1.authMiddleware, notationController_js_1.default.getMaNotation);
/**
 * @swagger
 * /notations/all:
 *   get:
 *     summary: Récupérer toutes les notations (Admin/Propriétaire)
 *     tags: [Notations]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Liste des notations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notation'
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
router.get('/all', auth_js_1.authMiddleware, notationController_js_1.default.getAll);
/**
 * @swagger
 * /notations/owner:
 *   get:
 *     summary: Récupérer les notations des salles du propriétaire
 *     tags: [Notations]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Notations des salles du propriétaire récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notation'
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
router.get('/owner', auth_js_1.authMiddleware, notationController_js_1.default.getOwnerNotations);
/**
 * @swagger
 * /notations/{id}:
 *   delete:
 *     summary: Supprimer une notation
 *     tags: [Notations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notation à supprimer
 *     responses:
 *       200:
 *         description: Notation supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notation supprimée avec succès"
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Notation non trouvée
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
router.delete('/:id', auth_js_1.authMiddleware, notationController_js_1.default.delete);
exports.default = router;
//# sourceMappingURL=notationRoutes.js.map