import { pool } from '../config/database.js';
class Notation {
    static async create(notation) {
        const [result] = await pool.execute('INSERT INTO notations (utilisateur_id, salle_id, note) VALUES (?, ?, ?)', [notation.utilisateur_id, notation.salle_id, notation.note]);
        return result.insertId;
    }
    static async findBySalleId(salleId) {
        const [rows] = await pool.execute(`SELECT n.*, u.nom, u.prenom 
             FROM notations n
             JOIN utilisateurs u ON n.utilisateur_id = u.utilisateur_id
             WHERE n.salle_id = ?
             ORDER BY n.date_creation DESC`, [salleId]);
        return rows;
    }
    static async findByUtilisateurAndSalle(utilisateurId, salleId) {
        const [rows] = await pool.execute('SELECT * FROM notations WHERE utilisateur_id = ? AND salle_id = ?', [utilisateurId, salleId]);
        return rows[0] || null;
    }
    static async getMoyenneSalle(salleId) {
        const [rows] = await pool.execute('SELECT AVG(note) as moyenne, COUNT(*) as total_notes FROM notations WHERE salle_id = ?', [salleId]);
        return rows[0];
    }
    static async update(notationId, note) {
        const [result] = await pool.execute('UPDATE notations SET note = ? WHERE notation_id = ?', [note, notationId]);
        return result.affectedRows;
    }
    static async delete(notationId) {
        const [result] = await pool.execute('DELETE FROM notations WHERE notation_id = ?', [notationId]);
        return result.affectedRows;
    }
    static async findAll(limit = 100, offset = 0) {
        const [rows] = await pool.execute(`SELECT n.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                    s.nom as salle_nom, s.utilisateur_id as proprietaire_id
             FROM notations n
             JOIN utilisateurs u ON n.utilisateur_id = u.utilisateur_id
             JOIN salles s ON n.salle_id = s.salle_id
             ORDER BY n.date_creation DESC
             LIMIT ? OFFSET ?`, [limit, offset]);
        return rows;
    }
    static async findByOwnerId(proprietaireId, limit = 100, offset = 0) {
        const [rows] = await pool.execute(`SELECT n.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                    s.nom as salle_nom
             FROM notations n
             JOIN utilisateurs u ON n.utilisateur_id = u.utilisateur_id
             JOIN salles s ON n.salle_id = s.salle_id
             WHERE s.utilisateur_id = ?
             ORDER BY n.date_creation DESC
             LIMIT ? OFFSET ?`, [proprietaireId, limit, offset]);
        return rows;
    }
    static async findById(notationId) {
        const [rows] = await pool.execute('SELECT * FROM notations WHERE notation_id = ?', [notationId]);
        return rows[0] || null;
    }
}
export default Notation;
