import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'Accès non autorisé' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt') as { utilisateur_id: number; email: string; type: string };
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Token invalide' });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && req.user.type !== 'Administrateur') {
        res.status(403).json({ message: 'Accès réservé aux administrateurs' });
        return;
    }
    next();
};

export const proprietaireMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && req.user.type !== 'Proprietaire' && req.user.type !== 'Administrateur') {
        res.status(403).json({ message: 'Accès réservé aux propriétaires' });
        return;
    }
    next();
};
