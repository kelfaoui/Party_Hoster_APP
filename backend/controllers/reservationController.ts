import { Request, Response } from 'express';
import Reservation from '../models/Reservation.js';
import Salle from '../models/Salle.js';

class ReservationController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { salle_id, heure_debut, heure_fin } = req.body;

            const disponible = await Reservation.checkDisponibilite(salle_id, heure_debut, heure_fin);
            if (!disponible) {
                res.status(400).json({ message: 'Salle non disponible pour ces horaires' });
                return;
            }

            const salle = await Salle.findById(salle_id) as Record<string, unknown> | null;
            if (!salle) {
                res.status(404).json({ message: 'Salle non trouvée' });
                return;
            }

            const dateDebut = new Date(heure_debut);
            let dateFin = new Date(heure_fin);
            
            let dureeHeures: number;
            if (dateFin <= dateDebut) {
                dateFin.setDate(dateFin.getDate() + 1);
                dureeHeures = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60);
            } else {
                dureeHeures = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60);
            }
            
            const prix_total = dureeHeures * parseFloat(String(salle.prix_par_heure));

            const reservationData = {
                utilisateur_id: req.user!.utilisateur_id,
                salle_id,
                heure_debut,
                heure_fin,
                prix_total,
                statut: 'EnAttente'
            };

            const reservationId = await Reservation.create(reservationData);
            
            res.status(201).json({ 
                message: 'Réservation créée avec succès',
                reservation_id: reservationId,
                prix_total
            });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getMesReservations(req: Request, res: Response): Promise<void> {
        try {
            const reservations = await Reservation.findByUtilisateurId(req.user!.utilisateur_id);
            res.json(reservations);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getOwnerReservations(req: Request, res: Response): Promise<void> {
        try {
            const reservations = await Reservation.findByOwnerId(req.user!.utilisateur_id);
            res.json(reservations);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { limit = 100, offset = 0 } = req.query;
            
            if (req.user!.type !== 'Administrateur' && req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            const reservations = await Reservation.findAll(Number(limit), Number(offset));
            res.json(reservations);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const reservation = await Reservation.findById(req.params.id) as Record<string, unknown> | null;
            if (!reservation) {
                res.status(404).json({ message: 'Réservation non trouvée' });
                return;
            }

            if (reservation.utilisateur_id !== req.user!.utilisateur_id && 
                req.user!.type !== 'Administrateur' && 
                req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            res.json(reservation);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const { statut } = req.body;
            const reservation = await Reservation.findById(req.params.id) as Record<string, unknown> | null;

            if (!reservation) {
                res.status(404).json({ message: 'Réservation non trouvée' });
                return;
            }

            const salle = await Salle.findById(reservation.salle_id) as Record<string, unknown> | null;
            if (reservation.utilisateur_id !== req.user!.utilisateur_id && 
                req.user!.type !== 'Administrateur' && 
                req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Reservation.updateStatus(req.params.id, statut);
            
            res.json({ message: 'Statut de la réservation mis à jour' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async annuler(req: Request, res: Response): Promise<void> {
        try {
            const reservation = await Reservation.findById(req.params.id) as Record<string, unknown> | null;

            if (!reservation) {
                res.status(404).json({ message: 'Réservation non trouvée' });
                return;
            }

            if (reservation.utilisateur_id !== req.user!.utilisateur_id && req.user!.type !== 'Administrateur' && req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Reservation.updateStatus(req.params.id, 'Annule');
            
            res.json({ message: 'Réservation annulée' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const reservation = await Reservation.findById(req.params.id);

            if (!reservation) {
                res.status(404).json({ message: 'Réservation non trouvée' });
                return;
            }

            if (reservation.utilisateur_id !== req.user!.utilisateur_id && req.user!.type !== 'Administrateur' && req.user!.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            await Reservation.delete(req.params.id);
            
            res.json({ message: 'Réservation supprimée' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default ReservationController;
