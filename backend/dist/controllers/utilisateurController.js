"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Utilisateur_js_1 = __importDefault(require("../models/Utilisateur.js"));
const params_js_1 = require("../utils/params.js");
class UtilisateurController {
    static async register(req, res) {
        try {
            const { email, mot_de_passe, nom, prenom, numero_telephone, type } = req.body;
            const existingUser = await Utilisateur_js_1.default.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ message: 'Cet email est déjà utilisé' });
                return;
            }
            const mot_de_passe_hash = await bcryptjs_1.default.hash(mot_de_passe, 10);
            const utilisateur = {
                email,
                mot_de_passe_hash,
                nom,
                prenom,
                image: req.body.image || 'default.jpg',
                numero_telephone,
                type: type || 'Client'
            };
            const userId = await Utilisateur_js_1.default.create(utilisateur);
            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                utilisateur_id: userId
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, mot_de_passe } = req.body;
            const utilisateur = await Utilisateur_js_1.default.findByEmail(email);
            if (!utilisateur) {
                res.status(401).json({ message: 'Identifiants incorrects' });
                return;
            }
            if (utilisateur.actif == 0) {
                res.status(401).json({ message: 'Utilisateur bloqué' });
                return;
            }
            const passwordMatch = await bcryptjs_1.default.compare(mot_de_passe, utilisateur.mot_de_passe_hash);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Identifiants incorrects' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({
                utilisateur_id: utilisateur.utilisateur_id,
                email: utilisateur.email,
                type: utilisateur.type
            }, process.env.JWT_SECRET || 'votre_secret_jwt', { expiresIn: '24h' });
            res.json({
                token,
                utilisateur: {
                    utilisateur_id: utilisateur.utilisateur_id,
                    nom: utilisateur.nom,
                    prenom: utilisateur.prenom,
                    email: utilisateur.email,
                    type: utilisateur.type
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            const utilisateur = await Utilisateur_js_1.default.findById(req.user.utilisateur_id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            delete utilisateur.mot_de_passe_hash;
            res.json(utilisateur);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updateProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            const { nom, prenom, email, numero_telephone } = req.body;
            const utilisateurData = { nom, prenom, email, numero_telephone };
            if (req.body.image) {
                utilisateurData.image = req.body.image;
            }
            await Utilisateur_js_1.default.update(req.user.utilisateur_id, utilisateurData);
            res.json({ message: 'Profil mis à jour avec succès' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const { limit = 100, offset = 0 } = req.query;
            const utilisateurs = await Utilisateur_js_1.default.findAll(Number(limit), Number(offset));
            const utilisateursSansPassword = utilisateurs.map((user) => {
                const { mot_de_passe_hash, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            res.json(utilisateursSansPassword);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const utilisateur = await Utilisateur_js_1.default.findById((0, params_js_1.extractId)(req.params));
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            delete utilisateur.mot_de_passe_hash;
            res.json(utilisateur);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updateStatus(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const { actif } = req.body;
            if (actif === undefined) {
                res.status(400).json({ message: 'Le champ "actif" est requis' });
                return;
            }
            const utilisateur = await Utilisateur_js_1.default.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            const affectedRows = await Utilisateur_js_1.default.updateStatus(id, { actif });
            if (affectedRows > 0) {
                res.json({
                    message: `Utilisateur ${actif ? 'activé' : 'désactivé'} avec succès`,
                    actif
                });
            }
            else {
                res.status(400).json({ message: 'Échec de la mise à jour' });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async toggleActivation(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const utilisateur = await Utilisateur_js_1.default.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            const affectedRows = await Utilisateur_js_1.default.toggleActivation(id);
            if (affectedRows > 0) {
                const updatedUser = await Utilisateur_js_1.default.findById(id);
                const action = updatedUser.actif ? 'activé' : 'désactivé';
                res.json({
                    message: `Utilisateur ${action} avec succès`,
                    actif: updatedUser.actif
                });
            }
            else {
                res.status(400).json({ message: 'Échec de la modification' });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async activate(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const utilisateur = await Utilisateur_js_1.default.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            const affectedRows = await Utilisateur_js_1.default.activate(id);
            if (affectedRows > 0) {
                res.json({
                    message: 'Utilisateur activé avec succès',
                    actif: true
                });
            }
            else {
                res.status(400).json({ message: 'Échec de l\'activation' });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async deactivate(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const utilisateur = await Utilisateur_js_1.default.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            const affectedRows = await Utilisateur_js_1.default.deactivate(id);
            if (affectedRows > 0) {
                res.json({
                    message: 'Utilisateur désactivé avec succès',
                    actif: false
                });
            }
            else {
                res.status(400).json({ message: 'Échec de la désactivation' });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async update(req, res) {
        try {
            const id = (0, params_js_1.extractId)(req.params);
            const { nom, prenom, email, numero_telephone: telephone, type, actif } = req.body;
            const updateData = {
                nom,
                prenom,
                email,
                numero_telephone: telephone,
                image: 'default.jpg',
                type,
                actif
            };
            const affectedRows = await Utilisateur_js_1.default.update(id, updateData);
            if (affectedRows > 0) {
                const updatedUser = await Utilisateur_js_1.default.findById(id);
                res.json({
                    message: 'Utilisateur mis à jour avec succès',
                    utilisateur: updatedUser
                });
            }
            else {
                res.status(400).json({ message: 'Échec de la mise à jour' });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.default = UtilisateurController;
//# sourceMappingURL=utilisateurController.js.map