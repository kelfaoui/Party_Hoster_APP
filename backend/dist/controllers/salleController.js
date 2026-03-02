"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Salle_js_1 = __importDefault(require("../models/Salle.js"));
const Reservation_js_1 = __importDefault(require("../models/Reservation.js"));
const params_js_1 = require("../utils/params.js");
class SalleController {
    static async create(req, res) {
        try {
            let imagePath = null;
            if (req.file) {
                imagePath = `/uploads/salles/${req.file.filename}`;
            }
            const salleData = {
                ...req.body,
                utilisateur_id: req.user.utilisateur_id,
                image: imagePath
            };
            if (req.body.equipements && typeof req.body.equipements === 'string') {
                salleData.equipements = req.body.equipements;
            }
            const salleId = await Salle_js_1.default.create(salleData);
            res.status(201).json({
                message: 'Salle créée avec succès',
                salle_id: salleId
            });
        }
        catch (error) {
            console.error('Error lors de la create de la salle salle ', error);
            if (req.file && 'path' in req.file && req.file.path) {
                fs_1.default.unlink(req.file.path, (err) => {
                    if (err)
                        console.error('Erreur lors de la suppression du fichier uploadé', err);
                });
            }
            res.status(500).json({ message: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const { limit = 100, offset = 0, ...filters } = req.query;
            const salles = await Salle_js_1.default.findAll(filters, Number(limit), Number(offset));
            res.json(salles);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getMesSalles(req, res) {
        try {
            const salles = await Salle_js_1.default.findByUtilisateurId(req.user.utilisateur_id);
            res.json(salles);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const salle = await Salle_js_1.default.findById((0, params_js_1.extractId)(req.params));
            if (!salle) {
                res.status(404).json({ message: 'Salle non trouvée' });
                return;
            }
            res.json(salle);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async update(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const salle = await Salle_js_1.default.findById(id);
            if (!salle) {
                res.status(404).json({ message: 'Salle non trouvée' });
                return;
            }
            if (salle.utilisateur_id !== req.user.utilisateur_id && req.user.type !== 'Administrateur' && req.user.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }
            const salleData = {
                nom: req.body.nom,
                description: req.body.description,
                localisation: req.body.localisation,
                capacite: parseInt(req.body.capacite),
                prix_par_heure: parseFloat(req.body.prix_par_heure),
                longitude: req.body.longitude || null,
                latitude: req.body.latitude || null,
                equipements: req.body.equipements || null,
                image: req.body.image || salle.image, // Utiliser la nouvelle image ou conserver l'existante
                disponibilite: req.body.disponibilite === 'true'
            };
            await Salle_js_1.default.update(id, salleData);
            res.json({
                message: 'Salle mise à jour avec succès',
                salle: await Salle_js_1.default.findById(id)
            });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de la salle:', error);
            res.status(500).json({ message: error.message });
        }
    }
    static async uploadImage(req, res) {
        try {
            console.log('Upload image request received');
            console.log('File:', req.file);
            console.log('Body:', req.body);
            if (!req.file) {
                console.log('No file provided');
                res.status(400).json({ message: 'Aucun fichier image fourni' });
                return;
            }
            const imagePath = `/uploads/salles/${req.file.filename}`;
            console.log('Image path:', imagePath);
            res.json({
                message: 'Image uploadée avec succès',
                imagePath: imagePath
            });
        }
        catch (error) {
            console.error('Erreur lors de l\'upload de l\'image:', error);
            res.status(500).json({ message: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const salle = await Salle_js_1.default.findById(id);
            if (!salle) {
                res.status(404).json({ message: 'Salle non trouvée' });
                return;
            }
            if (salle.utilisateur_id !== req.user.utilisateur_id && req.user.type !== 'Administrateur' && req.user.type !== 'Proprietaire') {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }
            await Salle_js_1.default.delete(id);
            res.json({ message: 'Salle supprimée avec succès' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getDisponibilites(req, res) {
        try {
            const { date, heure_debut, heure_fin } = req.query;
            if (!date || !heure_debut || !heure_fin) {
                res.status(400).json({ message: 'Date, heure_debut et heure_fin sont requis' });
                return;
            }
            const debut = new Date(`${date}T${heure_debut}`);
            const fin = new Date(`${date}T${heure_fin}`);
            const sallesDisponibles = await Salle_js_1.default.getSallesDisponibles(debut, fin);
            res.json(sallesDisponibles);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getReservations(req, res) {
        try {
            const reservations = await Reservation_js_1.default.findBySalleId((0, params_js_1.extractId)(req.params));
            res.json(reservations);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.default = SalleController;
//# sourceMappingURL=salleController.js.map