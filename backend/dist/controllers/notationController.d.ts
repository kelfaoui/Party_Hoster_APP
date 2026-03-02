import { Request, Response } from 'express';
declare class NotationController {
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
    static getAll(req: Request, res: Response): Promise<void>;
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
    static getOwnerNotations(req: Request, res: Response): Promise<void>;
    static createOrUpdate(req: Request, res: Response): Promise<void>;
    static getBySalle(req: Request, res: Response): Promise<void>;
    static getMaNotation(req: Request, res: Response): Promise<void>;
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
    static delete(req: Request, res: Response): Promise<void>;
}
export default NotationController;
