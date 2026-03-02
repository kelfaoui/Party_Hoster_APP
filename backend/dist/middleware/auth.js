import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'Accès non autorisé' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: 'Token invalide' });
    }
};
export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.type !== 'Administrateur') {
        res.status(403).json({ message: 'Accès réservé aux administrateurs' });
        return;
    }
    next();
};
export const proprietaireMiddleware = (req, res, next) => {
    if (req.user && req.user.type !== 'Proprietaire' && req.user.type !== 'Administrateur') {
        res.status(403).json({ message: 'Accès réservé aux propriétaires' });
        return;
    }
    next();
};
