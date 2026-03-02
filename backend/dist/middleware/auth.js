"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proprietaireMiddleware = exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'Accès non autorisé' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: 'Token invalide' });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.type !== 'Administrateur') {
        res.status(403).json({ message: 'Accès réservé aux administrateurs' });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
const proprietaireMiddleware = (req, res, next) => {
    if (req.user && req.user.type !== 'Proprietaire' && req.user.type !== 'Administrateur') {
        res.status(403).json({ message: 'Accès réservé aux propriétaires' });
        return;
    }
    next();
};
exports.proprietaireMiddleware = proprietaireMiddleware;
//# sourceMappingURL=auth.js.map