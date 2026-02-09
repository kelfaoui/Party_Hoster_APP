import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Utilisateur from '../models/Utilisateur.js';

interface RegisterBody {
  email?: string;
  mot_de_passe?: string;
  nom?: string;
  prenom?: string;
  numero_telephone?: string;
  type?: string;
  image?: string;
}

interface LoginBody {
  email?: string;
  mot_de_passe?: string;
}

class UtilisateurController {
  static async register(req: Request<object, object, RegisterBody>, res: Response): Promise<void> {
    try {
      const { email, mot_de_passe, nom, prenom, numero_telephone, type } = req.body;

      if (!email || !mot_de_passe) {
        res.status(400).json({ message: 'Email et mot de passe requis' });
        return;
      }

      const existingUser = await Utilisateur.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'Cet email est déjà utilisé' });
        return;
      }

      const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);

      const utilisateur = {
        email,
        mot_de_passe_hash,
        nom: nom ?? '',
        prenom: prenom ?? '',
        image: req.body.image ?? 'default.jpg',
        numero_telephone: numero_telephone ?? null,
        type: type ?? 'Client',
      };

      const userId = await Utilisateur.create(utilisateur);

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        utilisateur_id: userId,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  static async login(req: Request<object, object, LoginBody>, res: Response): Promise<void> {
    try {
      const { email, mot_de_passe } = req.body;

      if (!email || !mot_de_passe) {
        res.status(400).json({ message: 'Email et mot de passe requis' });
        return;
      }

      const utilisateur = await Utilisateur.findByEmail(email);
      if (!utilisateur) {
        res.status(401).json({ message: 'Identifiants incorrects' });
        return;
      }

      if (utilisateur.actif === 0) {
        res.status(401).json({ message: 'Utilisateur bloqué' });
        return;
      }

      const passwordMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe_hash);
      if (!passwordMatch) {
        res.status(401).json({ message: 'Identifiants incorrects' });
        return;
      }

      const token = jwt.sign(
        {
          utilisateur_id: utilisateur.utilisateur_id,
          email: utilisateur.email,
          type: utilisateur.type,
        },
        process.env.JWT_SECRET ?? 'votre_secret_jwt',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        utilisateur: {
          utilisateur_id: utilisateur.utilisateur_id,
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          email: utilisateur.email,
          type: utilisateur.type,
        },
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }
}

export default UtilisateurController;
