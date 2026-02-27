import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Utilisateur from '../models/Utilisateur.js';

class UtilisateurController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, mot_de_passe, nom, prenom, numero_telephone, type } = req.body;

            const existingUser = await Utilisateur.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ message: 'Cet email est déjà utilisé' });
                return;
            }

            const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);

            const utilisateur = {
                email,
                mot_de_passe_hash,
                nom,
                prenom,
                image: req.body.image || 'default.jpg',
                numero_telephone,
                type: type || 'Client'
            };

            const userId = await Utilisateur.create(utilisateur);
            
            res.status(201).json({ 
                message: 'Utilisateur créé avec succès',
                utilisateur_id: userId 
            });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, mot_de_passe } = req.body;

            const utilisateur = await Utilisateur.findByEmail(email) as Record<string, unknown> | null;
            if (!utilisateur) {
                res.status(401).json({ message: 'Identifiants incorrects' });
                return;
            }

            if (utilisateur.actif == 0) {
                res.status(401).json({ message: 'Utilisateur bloqué' });
                return;
            }

            const passwordMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe_hash as string);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Identifiants incorrects' });
                return;
            }

            const token = jwt.sign(
                { 
                    utilisateur_id: utilisateur.utilisateur_id,
                    email: utilisateur.email,
                    type: utilisateur.type 
                },
                process.env.JWT_SECRET || 'votre_secret_jwt',
                { expiresIn: '24h' }
            );

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
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getProfile(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            const utilisateur = await Utilisateur.findById(req.user.utilisateur_id) as Record<string, unknown> | null;
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }

            delete utilisateur.mot_de_passe_hash;
            
            res.json(utilisateur);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            const { nom, prenom, email, numero_telephone } = req.body;
            const utilisateurData: Record<string, unknown> = { nom, prenom, email, numero_telephone };

            if (req.body.image) {
                utilisateurData.image = req.body.image;
            }

            await Utilisateur.update(req.user.utilisateur_id, utilisateurData);
            
            res.json({ message: 'Profil mis à jour avec succès' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { limit = 100, offset = 0 } = req.query;
            const utilisateurs = await Utilisateur.findAll(Number(limit), Number(offset));
            
            const utilisateursSansPassword = utilisateurs.map((user: Record<string, unknown>) => {
                const { mot_de_passe_hash, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            
            res.json(utilisateursSansPassword);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const utilisateur = await Utilisateur.findById(req.params.id) as Record<string, unknown> | null;
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }

            delete utilisateur.mot_de_passe_hash;
            res.json(utilisateur);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { actif } = req.body;
            
            if (actif === undefined) {
                res.status(400).json({ message: 'Le champ "actif" est requis' });
                return;
            }
            
            const utilisateur = await Utilisateur.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            
            const affectedRows = await Utilisateur.updateStatus(id, { actif });
            
            if (affectedRows > 0) {
                res.json({ 
                    message: `Utilisateur ${actif ? 'activé' : 'désactivé'} avec succès`,
                    actif
                });
            } else {
                res.status(400).json({ message: 'Échec de la mise à jour' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async toggleActivation(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const utilisateur = await Utilisateur.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            
            const affectedRows = await Utilisateur.toggleActivation(id);
            
            if (affectedRows > 0) {
                const updatedUser = await Utilisateur.findById(id) as Record<string, unknown>;
                const action = updatedUser.actif ? 'activé' : 'désactivé';
                
                res.json({ 
                    message: `Utilisateur ${action} avec succès`,
                    actif: updatedUser.actif
                });
            } else {
                res.status(400).json({ message: 'Échec de la modification' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async activate(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const utilisateur = await Utilisateur.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            
            const affectedRows = await Utilisateur.activate(id);
            
            if (affectedRows > 0) {
                res.json({ 
                    message: 'Utilisateur activé avec succès',
                    actif: true
                });
            } else {
                res.status(400).json({ message: 'Échec de l\'activation' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async deactivate(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const utilisateur = await Utilisateur.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            
            const affectedRows = await Utilisateur.deactivate(id);
            
            if (affectedRows > 0) {
                res.json({ 
                    message: 'Utilisateur désactivé avec succès',
                    actif: false
                });
            } else {
                res.status(400).json({ message: 'Échec de la désactivation' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { nom, prenom, email, telephone, adresse, type, actif } = req.body;
            
            const utilisateur = await Utilisateur.findById(id);
            if (!utilisateur) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            
            const updateData = {
                nom,
                prenom,
                email,
                numero_telephone: telephone,
                image: 'default.jpg',
                type,
                actif
            };
            
            const affectedRows = await Utilisateur.update(id, updateData);
            
            if (affectedRows > 0) {
                const updatedUser = await Utilisateur.findById(id);
                res.json({ 
                    message: 'Utilisateur mis à jour avec succès',
                    utilisateur: updatedUser
                });
            } else {
                res.status(400).json({ message: 'Échec de la mise à jour' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default UtilisateurController;
