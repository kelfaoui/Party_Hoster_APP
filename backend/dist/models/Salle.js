import { pool } from '../config/database.js';
class Salle {
    static async create(salle) {
        const [result] = await pool.execute(`INSERT INTO salles (nom, utilisateur_id, image, description, capacite, 
             prix_par_heure, localisation, longitude, latitude, equipements) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            salle.nom,
            salle.utilisateur_id,
            salle.image || '/uploads/default-salle.jpg',
            salle.description || null,
            salle.capacite,
            salle.prix_par_heure,
            salle.localisation || null,
            salle.longitude || null,
            salle.latitude || null,
            salle.equipements || null
        ]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM salles WHERE salle_id = ?', [id]);
        return rows[0] || null;
    }
    static async findAll(filters = {}, limit = 100, offset = 0) {
        let query = 'SELECT * FROM salles WHERE 1=1';
        const params = [];
        if (filters.utilisateur_id) {
            query += ' AND utilisateur_id = ?';
            params.push(parseInt(String(filters.utilisateur_id)));
        }
        if (filters.localisation) {
            query += ' AND localisation LIKE ?';
            params.push(`%${filters.localisation}%`);
        }
        if (filters.capacite_min) {
            query += ' AND capacite >= ?';
            params.push(parseInt(String(filters.capacite_min)));
        }
        if (filters.prix_max) {
            query += ' AND prix_par_heure <= ?';
            params.push(parseFloat(String(filters.prix_max)));
        }
        const limitNum = parseInt(String(limit)) || 100;
        const offsetNum = parseInt(String(offset)) || 0;
        query += ` LIMIT ${limitNum} OFFSET ${offsetNum}`;
        try {
            const [rows] = await pool.execute(query, params);
            return rows;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }
    static async update(id, salle) {
        const [result] = await pool.execute(`UPDATE salles 
             SET nom = ?, image = ?, description = ?, capacite = ?, 
                 prix_par_heure = ?, localisation = ?, longitude = ?, 
                 latitude = ?, equipements = ? 
             WHERE salle_id = ?`, [
            salle.nom,
            salle.image,
            salle.description || null,
            salle.capacite,
            salle.prix_par_heure,
            salle.localisation || null,
            salle.longitude || null,
            salle.latitude || null,
            salle.equipements || null,
            id
        ]);
        return result.affectedRows;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM salles WHERE salle_id = ?', [id]);
        return result.affectedRows;
    }
    static async getSallesDisponibles(debut, fin) {
        const [rows] = await pool.execute(`SELECT s.* FROM salles s
             WHERE s.salle_id NOT IN (
                 SELECT r.salle_id FROM reservations r
                 WHERE r.statut != 'Annule'
                 AND (
                     (r.heure_debut < ? AND r.heure_fin > ?) OR
                     (r.heure_debut < ? AND r.heure_fin > ?) OR
                     (r.heure_debut >= ? AND r.heure_fin <= ?)
                 )
             )`, [fin, debut, fin, debut, debut, fin]);
        return rows;
    }
    static async findByUtilisateurId(utilisateurId) {
        const [rows] = await pool.execute(`SELECT s.* FROM salles s 
             WHERE s.utilisateur_id = ?`, [utilisateurId]);
        return rows;
    }
}
export default Salle;
