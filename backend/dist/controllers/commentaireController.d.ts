import { Request, Response } from 'express';
declare class CommentaireController {
    /**
     * @swagger
     * /commentaires/all:
     *   get:
     *     summary: Récupérer tous les commentaires (Admin/Propriétaire)
     *     tags: [Commentaires]
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
     *         description: Liste des commentaires récupérée avec succès
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Commentaire'
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
     * /commentaires/owner:
     *   get:
     *     summary: Récupérer les commentaires des salles du propriétaire
     *     tags: [Commentaires]
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
     *         description: Commentaires des salles du propriétaire récupérés avec succès
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Commentaire'
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
    static getOwnerCommentaires(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<void>;
    static getBySalle(req: Request, res: Response): Promise<void>;
    /**
     * @swagger
     * /commentaires/{id}:
     *   put:
     *     summary: Mettre à jour un commentaire
     *     tags: [Commentaires]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID du commentaire à modifier
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - commentaire
     *             properties:
     *               commentaire:
     *                 type: string
     *                 description: Nouveau contenu du commentaire
     *     responses:
     *       200:
     *         description: Commentaire mis à jour avec succès
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Commentaire mis à jour avec succès"
     *       403:
     *         description: Non autorisé
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Commentaire non trouvé
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
    static update(req: Request, res: Response): Promise<void>;
    /**
     * @swagger
     * /commentaires/{id}:
     *   delete:
     *     summary: Supprimer un commentaire
     *     tags: [Commentaires]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID du commentaire à supprimer
     *     responses:
     *       200:
     *         description: Commentaire supprimé avec succès
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Commentaire supprimé avec succès"
     *       403:
     *         description: Non autorisé
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Commentaire non trouvé
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
export default CommentaireController;
