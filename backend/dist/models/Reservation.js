"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
class Reservation {
    static async create(reservation) {
        const [result] = await database_js_1.pool.execute(`INSERT INTO reservations (utilisateur_id, salle_id, heure_debut, 
             heure_fin, prix_total, statut) 
             VALUES (?, ?, ?, ?, ?, ?)`, [
            reservation.utilisateur_id,
            reservation.salle_id,
            reservation.heure_debut,
            reservation.heure_fin,
            reservation.prix_total,
            reservation.statut || 'EnAttente'
        ]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await database_js_1.pool.execute('SELECT * FROM reservations WHERE reservation_id = ?', [id]);
        return rows[0] || null;
    }
    static async findByUtilisateurId(utilisateurId) {
        const [rows] = await database_js_1.pool.execute(`SELECT r.*, s.nom as salle_nom 
             FROM reservations r
             JOIN salles s ON r.salle_id = s.salle_id
             WHERE r.utilisateur_id = ?
             ORDER BY r.heure_debut DESC`, [utilisateurId]);
        return rows;
    }
    static async findByOwnerId(utilisateurId) {
        const [rows] = await database_js_1.pool.execute(`SELECT r.*, s.nom as salle_nom, s.utilisateur_id as proprietaire_id
             FROM reservations r
             JOIN salles s ON r.salle_id = s.salle_id
             WHERE s.utilisateur_id = ?
             ORDER BY r.heure_debut DESC`, [utilisateurId]);
        return rows;
    }
    static async findBySalleId(salleId) {
        const [rows] = await database_js_1.pool.execute(`SELECT r.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom
             FROM reservations r
             JOIN utilisateurs u ON r.utilisateur_id = u.utilisateur_id
             WHERE r.salle_id = ?
             ORDER BY r.heure_debut DESC`, [salleId]);
        return rows;
    }
    static async findAll(limit = 100, offset = 0) {
        const limitNum = parseInt(String(limit)) || 100;
        const offsetNum = parseInt(String(offset)) || 0;
        const [rows] = await database_js_1.pool.execute(`SELECT r.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom,
                    s.nom as salle_nom
             FROM reservations r
             JOIN utilisateurs u ON r.utilisateur_id = u.utilisateur_id
             JOIN salles s ON r.salle_id = s.salle_id
             LIMIT ${limitNum} OFFSET ${offsetNum}`);
        return rows;
    }
    static async updateStatus(id, statut) {
        const [result] = await database_js_1.pool.execute('UPDATE reservations SET statut = ? WHERE reservation_id = ?', [statut, id]);
        return result.affectedRows;
    }
    static async delete(id) {
        const [result] = await database_js_1.pool.execute('DELETE FROM reservations WHERE reservation_id = ?', [id]);
        return result.affectedRows;
    }
    static async checkDisponibilite(salleId, debut, fin) {
        const dateDebut = new Date(debut);
        let dateFin = new Date(fin);
        if (dateFin <= dateDebut) {
            dateFin.setDate(dateFin.getDate() + 1);
        }
        const [rows] = await database_js_1.pool.execute(`SELECT COUNT(*) as count FROM reservations 
             WHERE salle_id = ? 
             AND statut != 'Annule'
             AND (
                 (heure_debut < ? AND heure_fin > ?) OR
                 (heure_debut < ? AND heure_fin > ?) OR
                 (heure_debut >= ? AND heure_fin <= ?)
             )`, [salleId, fin, debut, fin, debut, debut, fin]);
        return rows[0].count === 0;
    }
}
exports.default = Reservation;
//# sourceMappingURL=Reservation.js.map