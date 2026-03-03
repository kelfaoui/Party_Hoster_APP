import { Request, Response } from 'express';
import Notation from '../models/Notation.js';
import Salle from '../models/Salle.js';

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
            
            console.log('=== NOTATIONS GETALL DEBUG ===');
            console.log('User type:', req.user!.type);
            console.log('Limit:', limit, 'Offset:', offset);
            
            if (req.user!.type !== 'Administrateur' && req.user!.type !== 'Proprietaire') {
                console.log('❌ User not authorized');
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            console.log('✅ User authorized, fetching notations...');
            const notations = await Notation.findAll(Number(limit), Number(offset));
            console.log('📊 Notations found:', notations.length);
            console.log('📋 First notation sample:', notations[0] || 'No notations');
            
            res.json(notations);
        } catch (error) {
            console.error('❌ Error in getAll notations:', error);
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

            // Debug: Afficher le type d'utilisateur
            console.log('=== DEBUG NOTATION DELETE ===');
            console.log('User type:', req.user!.type);
            console.log('User ID:', req.user!.utilisateur_id);
            console.log('Notation user ID:', notation.utilisateur_id);
            console.log('Notation salle ID:', notation.salle_id);
            console.log('Type includes Proprietaire:', req.user!.type.includes('Proprietaire'));
            console.log('Type includes proprietaire:', req.user!.type.toLowerCase().includes('proprietaire'));
            console.log('Type === Proprietaire:', req.user!.type === 'Proprietaire');
            console.log('Type === proprietaire:', req.user!.type === 'proprietaire');

            // Admin peut tout supprimer
            if (req.user!.type === 'Administrateur') {
                console.log('Admin deletion allowed');
                await Notation.delete(notationId);
                res.json({ message: 'Notation supprimée avec succès' });
                return;
            }

            // Utilisateur peut supprimer sa propre notation
            if (notation.utilisateur_id === req.user!.utilisateur_id) {
                console.log('User deletion allowed (own notation)');
                await Notation.delete(notationId);
                res.json({ message: 'Notation supprimée avec succès' });
                return;
            }

            // Owner peut supprimer les notations de ses salles (vérification large)
            if (req.user!.type.includes('Proprietaire') || req.user!.type.toLowerCase().includes('proprietaire')) {
                console.log('Owner type detected, checking salle ownership...');
                const salle = await Salle.findById(notation.salle_id as string) as Record<string, unknown> | null;
                console.log('Salle found:', salle);
                console.log('Salle owner ID:', salle?.utilisateur_id);
                
                if (salle && salle.utilisateur_id === req.user!.utilisateur_id) {
                    console.log('Owner deletion allowed (owns salle)');
                    await Notation.delete(notationId);
                    res.json({ message: 'Notation supprimée avec succès' });
                    return;
                }
            }

            // Si aucune des conditions ci-dessus n'est remplie
            console.log('Deletion not allowed - 403');
            res.status(403).json({ message: 'Non autorisé' });
        } catch (error) {
            console.error('Error in delete notation:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default NotationController;
