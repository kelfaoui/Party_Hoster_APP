import { pool } from '../config/database.js';

export interface NotationData {
    utilisateur_id: number;
    salle_id: number;
    note: number;
}

class Notation {
    static async create(notation: NotationData): Promise<number> {
        const [result] = await pool.execute(
            'INSERT INTO notations (utilisateur_id, salle_id, note) VALUES (?, ?, ?)',
            [notation.utilisateur_id, notation.salle_id, notation.note]
        ) as [ { insertId: number }, unknown ];
        return result.insertId;
    }

    static async findBySalleId(salleId: number | string): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT n.*, u.nom, u.prenom 
             FROM notations n
             JOIN utilisateurs u ON n.utilisateur_id = u.utilisateur_id
             WHERE n.salle_id = ?
             ORDER BY n.date_creation DESC`,
            [salleId]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findByUtilisateurAndSalle(utilisateurId: number | string, salleId: number | string): Promise<Record<string, unknown> | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM notations WHERE utilisateur_id = ? AND salle_id = ?',
            [utilisateurId, salleId]
        ) as [Record<string, unknown>[], unknown];
        return rows[0] || null;
    }

    static async getMoyenneSalle(salleId: number | string): Promise<{ moyenne: number | string; total_notes: number }> {
        const [rows] = await pool.execute(
            'SELECT AVG(note) as moyenne, COUNT(*) as total_notes FROM notations WHERE salle_id = ?',
            [salleId]
        ) as [ { moyenne: number | string; total_notes: number }[], unknown ];
        return rows[0];
    }

    static async update(notationId: number | string, note: number): Promise<number> {
        const [result] = await pool.execute(
            'UPDATE notations SET note = ? WHERE notation_id = ?',
            [note, notationId]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async delete(notationId: number | string): Promise<number> {
        const [result] = await pool.execute(
            'DELETE FROM notations WHERE notation_id = ?',
            [notationId]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async findAll(limit: number = 100, offset: number = 0): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT n.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                    s.nom as salle_nom, s.utilisateur_id as proprietaire_id
             FROM notations n
             JOIN utilisateurs u ON n.utilisateur_id = u.utilisateur_id
             JOIN salles s ON n.salle_id = s.salle_id
             ORDER BY n.date_creation DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findByOwnerId(proprietaireId: number | string, limit: number = 100, offset: number = 0): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT n.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                    s.nom as salle_nom
             FROM notations n
             JOIN utilisateurs u ON n.utilisateur_id = u.utilisateur_id
             JOIN salles s ON n.salle_id = s.salle_id
             WHERE s.utilisateur_id = ?
             ORDER BY n.date_creation DESC
             LIMIT ? OFFSET ?`,
            [proprietaireId, limit, offset]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findById(notationId: number | string): Promise<Record<string, unknown> | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM notations WHERE notation_id = ?',
            [notationId]
        ) as [Record<string, unknown>[], unknown];
        return rows[0] || null;
    }
}

export default Notation;
