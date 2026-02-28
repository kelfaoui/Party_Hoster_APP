import { Request, Response } from 'express';
import Commentaire from '../models/Commentaire.js';

class CommentaireController {
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
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { limit = 100, offset = 0 } = req.query;
            
            if (req.user!.type !== 'Administrateur' && req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            const commentaires = await Commentaire.findAll(Number(limit), Number(offset));
            res.json(commentaires);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

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
    static async getOwnerCommentaires(req: Request, res: Response): Promise<void> {
        try {
            const { limit = 100, offset = 0 } = req.query;
            
            if (req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            const commentaires = await Commentaire.findByOwnerId(req.user!.utilisateur_id, Number(limit), Number(offset));
            res.json(commentaires);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { salle_id, commentaire } = req.body;

            if (!commentaire || String(commentaire).trim().length === 0) {
                res.status(400).json({ message: 'Le commentaire ne peut pas être vide' });
                return;
            }

            const commentaireData = {
                utilisateur_id: req.user!.utilisateur_id,
                salle_id,
                commentaire: String(commentaire).trim()
            };

            const commentaireId = await Commentaire.create(commentaireData);
            
            res.status(201).json({ 
                message: 'Commentaire ajouté avec succès',
                commentaire_id: commentaireId 
            });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getBySalle(req: Request, res: Response): Promise<void> {
        try {
            const salleId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const commentaires = await Commentaire.findBySalleId(salleId);
            res.json(commentaires);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

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
    static async update(req: Request, res: Response): Promise<void> {
        try {
            const { commentaire } = req.body;
            const commentaireId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const commentaireObj = await Commentaire.findById(commentaireId) as Record<string, unknown> | null;

            if (!commentaireObj) {
                res.status(404).json({ message: 'Commentaire non trouvé' });
                return;
            }

            if (commentaireObj.utilisateur_id !== req.user!.utilisateur_id && req.user!.type !== 'Administrateur') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Commentaire.update(commentaireId, commentaire);
            
            res.json({ message: 'Commentaire mis à jour avec succès' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

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
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const commentaireId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const commentaire = await Commentaire.findById(commentaireId) as Record<string, unknown> | null;

            if (!commentaire) {
                res.status(404).json({ message: 'Commentaire non trouvé' });
                return;
            }

            if (commentaire.utilisateur_id !== req.user!.utilisateur_id && req.user!.type !== 'Administrateur') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Commentaire.delete(commentaireId);
            
            res.json({ message: 'Commentaire supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default CommentaireController;
