import { Request, Response } from 'express';
import Notation from '../models/Notation.js';

class NotationController {
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
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { limit = 100, offset = 0 } = req.query;
            
            if (req.user!.type !== 'Administrateur' && req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            const notations = await Notation.findAll(Number(limit), Number(offset));
            res.json(notations);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

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
    static async getOwnerNotations(req: Request, res: Response): Promise<void> {
        try {
            const { limit = 100, offset = 0 } = req.query;
            
            if (req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            const notations = await Notation.findByOwnerId(req.user!.utilisateur_id, Number(limit), Number(offset));
            res.json(notations);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async createOrUpdate(req: Request, res: Response): Promise<void> {
        try {
            const { salle_id, note } = req.body;

            if (note < 1 || note > 5) {
                res.status(400).json({ message: 'La note doit être entre 1 et 5' });
                return;
            }

            const existingNotation = await Notation.findByUtilisateurAndSalle(
                req.user!.utilisateur_id,
                salle_id
            ) as Record<string, unknown> | null;

            let notationId: number;
            if (existingNotation) {
                await Notation.update(existingNotation.notation_id as number, note);
                notationId = existingNotation.notation_id as number;
            } else {
                const notationData = {
                    utilisateur_id: req.user!.utilisateur_id,
                    salle_id,
                    note
                };
                notationId = await Notation.create(notationData);
            }

            const stats = await Notation.getMoyenneSalle(salle_id);
            
            res.json({
                message: 'Note enregistrée avec succès',
                notation_id: notationId,
                moyenne: parseFloat(String(stats.moyenne)) || 0,
                total_notes: stats.total_notes
            });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getBySalle(req: Request, res: Response): Promise<void> {
        try {
            const salleId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const notations = await Notation.findBySalleId(salleId);
            const stats = await Notation.getMoyenneSalle(salleId);
            
            res.json({
                notations,
                moyenne: parseFloat(String(stats.moyenne)) || 0,
                total_notes: stats.total_notes
            });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getMaNotation(req: Request, res: Response): Promise<void> {
        try {
            const salleId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const notation = await Notation.findByUtilisateurAndSalle(
                req.user!.utilisateur_id,
                salleId
            );
            
            res.json(notation || {});
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

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
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const notationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const notation = await Notation.findById(notationId) as Record<string, unknown> | null;

            if (!notation) {
                res.status(404).json({ message: 'Notation non trouvée' });
                return;
            }

            if (notation.utilisateur_id !== req.user!.utilisateur_id && req.user!.type !== 'Administrateur') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Notation.delete(notationId);
            
            res.json({ message: 'Notation supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default NotationController;
