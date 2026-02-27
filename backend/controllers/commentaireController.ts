import { Request, Response } from 'express';
import Commentaire from '../models/Commentaire.js';

class CommentaireController {
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
            const commentaires = await Commentaire.findBySalleId(req.params.id);
            res.json(commentaires);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const { commentaire } = req.body;
            const commentaireObj = await Commentaire.findById(req.params.id) as Record<string, unknown> | null;

            if (!commentaireObj) {
                res.status(404).json({ message: 'Commentaire non trouvé' });
                return;
            }

            if (commentaireObj.utilisateur_id !== req.user!.utilisateur_id && req.user!.type !== 'Administrateur') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Commentaire.update(req.params.id, commentaire);
            
            res.json({ message: 'Commentaire mis à jour avec succès' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const commentaire = await Commentaire.findById(req.params.id) as Record<string, unknown> | null;

            if (!commentaire) {
                res.status(404).json({ message: 'Commentaire non trouvé' });
                return;
            }

            if (commentaire.utilisateur_id !== req.user!.utilisateur_id && req.user!.type !== 'Administrateur') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Commentaire.delete(req.params.id);
            
            res.json({ message: 'Commentaire supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default CommentaireController;
