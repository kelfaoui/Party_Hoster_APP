import { Request, Response } from 'express';
import Notation from '../models/Notation.js';

class NotationController {
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
            const notations = await Notation.findBySalleId(req.params.id);
            const stats = await Notation.getMoyenneSalle(req.params.id);
            
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
            const notation = await Notation.findByUtilisateurAndSalle(
                req.user!.utilisateur_id,
                req.params.id
            );
            
            res.json(notation || {});
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const notation = await Notation.findByUtilisateurAndSalle(
                req.user!.utilisateur_id,
                req.params.salleId
            ) as Record<string, unknown> | null;

            if (!notation) {
                res.status(404).json({ message: 'Notation non trouvée' });
                return;
            }

            if (notation.utilisateur_id !== req.user!.utilisateur_id && req.user!.type !== 'Administrateur') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Notation.delete(notation.notation_id as number);
            
            const stats = await Notation.getMoyenneSalle(req.params.salleId);
            
            res.json({
                message: 'Notation supprimée',
                nouvelle_moyenne: parseFloat(String(stats.moyenne)) || 0,
                total_notes: stats.total_notes
            });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default NotationController;
