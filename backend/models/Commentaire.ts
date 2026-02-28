import { pool } from '../config/database.js';

export interface CommentaireData {
    utilisateur_id: number;
    salle_id: number;
    commentaire: string;
}

class Commentaire {
    static async create(commentaire: CommentaireData): Promise<number> {
        const [result] = await pool.execute(
            'INSERT INTO commentaires (utilisateur_id, salle_id, commentaire) VALUES (?, ?, ?)',
            [commentaire.utilisateur_id, commentaire.salle_id, commentaire.commentaire]
        ) as [ { insertId: number }, unknown ];
        return result.insertId;
    }

    static async findBySalleId(salleId: number | string): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT c.*, u.nom, u.prenom 
             FROM commentaires c
             JOIN utilisateurs u ON c.utilisateur_id = u.utilisateur_id
             WHERE c.salle_id = ?
             ORDER BY c.date_creation DESC`,
            [salleId]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findById(commentaireId: number | string): Promise<Record<string, unknown> | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM commentaires WHERE commentaire_id = ?',
            [commentaireId]
        ) as [Record<string, unknown>[], unknown];
        return rows[0] || null;
    }

    static async update(commentaireId: number | string, commentaire: string): Promise<number> {
        const [result] = await pool.execute(
            'UPDATE commentaires SET commentaire = ? WHERE commentaire_id = ?',
            [commentaire, commentaireId]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async delete(commentaireId: number | string): Promise<number> {
        const [result] = await pool.execute(
            'DELETE FROM commentaires WHERE commentaire_id = ?',
            [commentaireId]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async findAll(limit: number = 100, offset: number = 0): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT c.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                    s.nom as salle_nom, s.utilisateur_id as proprietaire_id
             FROM commentaires c
             JOIN utilisateurs u ON c.utilisateur_id = u.utilisateur_id
             JOIN salles s ON c.salle_id = s.salle_id
             ORDER BY c.date_creation DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findByOwnerId(proprietaireId: number | string, limit: number = 100, offset: number = 0): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT c.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                    s.nom as salle_nom
             FROM commentaires c
             JOIN utilisateurs u ON c.utilisateur_id = u.utilisateur_id
             JOIN salles s ON c.salle_id = s.salle_id
             WHERE s.utilisateur_id = ?
             ORDER BY c.date_creation DESC
             LIMIT ? OFFSET ?`,
            [proprietaireId, limit, offset]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }
}

export default Commentaire;
