"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reservation_js_1 = __importDefault(require("../models/Reservation.js"));
const Salle_js_1 = __importDefault(require("../models/Salle.js"));
const params_js_1 = require("../utils/params.js");
class ReservationController {
    static async create(req, res) {
        try {
            const { salle_id, heure_debut, heure_fin } = req.body;
            const disponible = await Reservation_js_1.default.checkDisponibilite(salle_id, heure_debut, heure_fin);
            if (!disponible) {
                res.status(400).json({ message: 'Salle non disponible pour ces horaires' });
                return;
            }
            const salle = await Salle_js_1.default.findById(salle_id);
            if (!salle) {
                res.status(404).json({ message: 'Salle non trouvée' });
                return;
            }
            const dateDebut = new Date(heure_debut);
            let dateFin = new Date(heure_fin);
            let dureeHeures;
            if (dateFin <= dateDebut) {
                dateFin.setDate(dateFin.getDate() + 1);
                dureeHeures = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60);
            }
            else {
                dureeHeures = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60);
            }
            const prix_total = dureeHeures * parseFloat(String(salle.prix_par_heure));
            const reservationData = {
                utilisateur_id: req.user.utilisateur_id,
                salle_id,
                heure_debut,
                heure_fin,
                prix_total,
                statut: 'EnAttente'
            };
            const reservationId = await Reservation_js_1.default.create(reservationData);
            res.status(201).json({
                message: 'Réservation créée avec succès',
                reservation_id: reservationId,
                prix_total
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getMesReservations(req, res) {
        try {
            const reservations = await Reservation_js_1.default.findByUtilisateurId(req.user.utilisateur_id);
            res.json(reservations);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getOwnerReservations(req, res) {
        try {
            const reservations = await Reservation_js_1.default.findByOwnerId(req.user.utilisateur_id);
            res.json(reservations);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const { limit = 100, offset = 0 } = req.query;
            if (req.user.type !== 'Administrateur' && req.user.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }
            const reservations = await Reservation_js_1.default.findAll(Number(limit), Number(offset));
            res.json(reservations);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const reservation = await Reservation_js_1.default.findById((0, params_js_1.extractId)(req.params));
            if (!reservation) {
                res.status(404).json({ message: 'Réservation non trouvée' });
                return;
            }
            if (reservation.utilisateur_id !== req.user.utilisateur_id &&
                req.user.type !== 'Administrateur' &&
                req.user.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }
            res.json(reservation);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updateStatus(req, res) {
        try {
            const { statut } = req.body;
            const id = (0, params_js_1.extractId)(req.params);
            const reservation = await Reservation_js_1.default.findById(id);
            if (!reservation) {
                res.status(404).json({ message: 'Réservation non trouvée' });
                return;
            }
            const salle = await Salle_js_1.default.findById(reservation.salle_id);
            if (reservation.utilisateur_id !== req.user.utilisateur_id &&
                req.user.type !== 'Administrateur' &&
                req.user.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }
            await Reservation_js_1.default.updateStatus(id, statut);
            res.json({ message: 'Statut de réservation mis à jour avec succès' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async annuler(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const reservation = await Reservation_js_1.default.findById(id);
            if (!reservation) {
                res.status(404).json({ message: 'Réservation non trouvée' });
                return;
            }
            if (reservation.utilisateur_id !== req.user.utilisateur_id && req.user.type !== 'Administrateur' && req.user.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }
            await Reservation_js_1.default.updateStatus(id, 'Annule');
            res.json({ message: 'Réservation annulée' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const reservation = await Reservation_js_1.default.findById(id);
            if (!reservation) {
                res.status(404).json({ message: 'Réservation non trouvée' });
                return;
            }
            if (reservation.utilisateur_id !== req.user.utilisateur_id && req.user.type !== 'Administrateur' && req.user.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }
            await Reservation_js_1.default.delete(id);
            res.json({ message: 'Réservation supprimée' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.default = ReservationController;
//# sourceMappingURL=reservationController.js.map