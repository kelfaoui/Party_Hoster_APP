import { pool } from '../config/database.js';
class Utilisateur {
    static async create(utilisateur) {
        const [result] = await pool.execute(`INSERT INTO utilisateurs (nom, image, prenom, email, mot_de_passe_hash, numero_telephone, type) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            utilisateur.nom,
            utilisateur.image,
            utilisateur.prenom,
            utilisateur.email,
            utilisateur.mot_de_passe_hash,
            utilisateur.numero_telephone || null,
            utilisateur.type || 'Client'
        ]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM utilisateurs WHERE utilisateur_id = ?', [id]);
        return rows[0] || null;
    }
    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        return rows[0] || null;
    }
    static async findAll(limit = 100, offset = 0) {
        const limitNum = parseInt(String(limit)) || 100;
        const offsetNum = parseInt(String(offset)) || 0;
        const [rows] = await pool.execute(`SELECT * FROM utilisateurs LIMIT ${limitNum} OFFSET ${offsetNum}`);
        return rows;
    }
    static async update(id, utilisateur) {
        const activite = (utilisateur.actif === false) ? 0 : 1;
        const [result] = await pool.execute(`UPDATE utilisateurs 
             SET nom = ?, image = ?, prenom = ?, email = ?, 
                 numero_telephone = ?, type = ?, actif = ? 
             WHERE utilisateur_id = ?`, [
            utilisateur.nom,
            utilisateur.image,
            utilisateur.prenom,
            utilisateur.email,
            utilisateur.numero_telephone || null,
            utilisateur.type || 'Client',
            activite,
            id
        ]);
        return result.affectedRows;
    }
    static async updateStatus(id, utilisateur) {
        const activite = (utilisateur.actif === false) ? 0 : 1;
        const [result] = await pool.execute(`UPDATE utilisateurs 
             SET actif = ? 
             WHERE utilisateur_id = ?`, [
            activite,
            id
        ]);
        return result.affectedRows;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM utilisateurs WHERE utilisateur_id = ?', [id]);
        return result.affectedRows;
    }
    static async toggleActivation(id) {
        const [result] = await pool.execute(`UPDATE utilisateurs 
             SET actif = NOT actif 
             WHERE utilisateur_id = ?`, [id]);
        return result.affectedRows;
    }
    static async activate(id) {
        const [result] = await pool.execute(`UPDATE utilisateurs 
             SET actif = 1 
             WHERE utilisateur_id = ?`, [id]);
        return result.affectedRows;
    }
    static async deactivate(id) {
        const [result] = await pool.execute(`UPDATE utilisateurs 
             SET actif = 0 
             WHERE utilisateur_id = ?`, [id]);
        return result.affectedRows;
    }
}
export default Utilisateur;
