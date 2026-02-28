/**
 * @swagger
 * tags:
 *   name: Notations
 *   description: Gestion des notations des salles
 */

import express from 'express';
import NotationController from '../controllers/notationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

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
router.post('/', authMiddleware, NotationController.createOrUpdate);

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
router.get('/salle/:id', NotationController.getBySalle);

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
router.get('/ma-notation/:id', authMiddleware, NotationController.getMaNotation);

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
router.get('/all', authMiddleware, NotationController.getAll);

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
router.get('/owner', authMiddleware, NotationController.getOwnerNotations);

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
router.delete('/:id', authMiddleware, NotationController.delete);

export default router;
