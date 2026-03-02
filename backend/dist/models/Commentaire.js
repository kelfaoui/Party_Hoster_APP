import { pool } from '../config/database.js';
class Commentaire {
    static async create(commentaire) {
        const [result] = await pool.execute('INSERT INTO commentaires (utilisateur_id, salle_id, commentaire) VALUES (?, ?, ?)', [commentaire.utilisateur_id, commentaire.salle_id, commentaire.commentaire]);
        return result.insertId;
    }
    static async findBySalleId(salleId) {
        const [rows] = await pool.execute(`SELECT c.*, u.nom, u.prenom 
             FROM commentaires c
             JOIN utilisateurs u ON c.utilisateur_id = u.utilisateur_id
             WHERE c.salle_id = ?
             ORDER BY c.date_creation DESC`, [salleId]);
        return rows;
    }
    static async findById(commentaireId) {
        const [rows] = await pool.execute('SELECT * FROM commentaires WHERE commentaire_id = ?', [commentaireId]);
        return rows[0] || null;
    }
    static async update(commentaireId, commentaire) {
        const [result] = await pool.execute('UPDATE commentaires SET commentaire = ? WHERE commentaire_id = ?', [commentaire, commentaireId]);
        return result.affectedRows;
    }
    static async delete(commentaireId) {
        const [result] = await pool.execute('DELETE FROM commentaires WHERE commentaire_id = ?', [commentaireId]);
        return result.affectedRows;
    }
    static async findAll(limit = 100, offset = 0) {
        const [rows] = await pool.execute(`SELECT c.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                    s.nom as salle_nom, s.utilisateur_id as proprietaire_id
             FROM commentaires c
             JOIN utilisateurs u ON c.utilisateur_id = u.utilisateur_id
             JOIN salles s ON c.salle_id = s.salle_id
             ORDER BY c.date_creation DESC
             LIMIT ? OFFSET ?`, [limit, offset]);
        return rows;
    }
    static async findByOwnerId(proprietaireId, limit = 100, offset = 0) {
        const [rows] = await pool.execute(`SELECT c.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                    s.nom as salle_nom
             FROM commentaires c
             JOIN utilisateurs u ON c.utilisateur_id = u.utilisateur_id
             JOIN salles s ON c.salle_id = s.salle_id
             WHERE s.utilisateur_id = ?
             ORDER BY c.date_creation DESC
             LIMIT ? OFFSET ?`, [proprietaireId, limit, offset]);
        return rows;
    }
}
export default Commentaire;
