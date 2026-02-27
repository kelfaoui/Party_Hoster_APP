import { pool } from '../config/database.js';

export interface ReservationData {
    utilisateur_id: number;
    salle_id: number;
    heure_debut: string;
    heure_fin: string;
    prix_total: number;
    statut?: string;
}

class Reservation {
    static async create(reservation: ReservationData): Promise<number> {
        const [result] = await pool.execute(
            `INSERT INTO reservations (utilisateur_id, salle_id, heure_debut, 
             heure_fin, prix_total, statut) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                reservation.utilisateur_id,
                reservation.salle_id,
                reservation.heure_debut,
                reservation.heure_fin,
                reservation.prix_total,
                reservation.statut || 'EnAttente'
            ]
        ) as [ { insertId: number }, unknown ];
        return result.insertId;
    }

    static async findById(id: number | string): Promise<Record<string, unknown> | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM reservations WHERE reservation_id = ?',
            [id]
        ) as [Record<string, unknown>[], unknown];
        return rows[0] || null;
    }

    static async findByUtilisateurId(utilisateurId: number | string): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT r.*, s.nom as salle_nom 
             FROM reservations r
             JOIN salles s ON r.salle_id = s.salle_id
             WHERE r.utilisateur_id = ?
             ORDER BY r.heure_debut DESC`,
            [utilisateurId]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findByOwnerId(utilisateurId: number | string): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT r.*, s.nom as salle_nom, s.utilisateur_id as proprietaire_id
             FROM reservations r
             JOIN salles s ON r.salle_id = s.salle_id
             WHERE s.utilisateur_id = ?
             ORDER BY r.heure_debut DESC`,
            [utilisateurId]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findBySalleId(salleId: number | string): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT r.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom
             FROM reservations r
             JOIN utilisateurs u ON r.utilisateur_id = u.utilisateur_id
             WHERE r.salle_id = ?
             ORDER BY r.heure_debut DESC`,
            [salleId]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findAll(limit: number | string = 100, offset: number | string = 0): Promise<Record<string, unknown>[]> {
        const limitNum = parseInt(String(limit)) || 100;
        const offsetNum = parseInt(String(offset)) || 0;
        
        const [rows] = await pool.execute(
            `SELECT r.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom,
                    s.nom as salle_nom
             FROM reservations r
             JOIN utilisateurs u ON r.utilisateur_id = u.utilisateur_id
             JOIN salles s ON r.salle_id = s.salle_id
             LIMIT ${limitNum} OFFSET ${offsetNum}`
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async updateStatus(id: number | string, statut: string): Promise<number> {
        const [result] = await pool.execute(
            'UPDATE reservations SET statut = ? WHERE reservation_id = ?',
            [statut, id]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async delete(id: number | string): Promise<number> {
        const [result] = await pool.execute(
            'DELETE FROM reservations WHERE reservation_id = ?',
            [id]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async checkDisponibilite(salleId: number | string, debut: string | Date, fin: string | Date): Promise<boolean> {
        const dateDebut = new Date(debut);
        let dateFin = new Date(fin);
        
        if (dateFin <= dateDebut) {
            dateFin.setDate(dateFin.getDate() + 1);
        }
        
        const [rows] = await pool.execute(
            `SELECT COUNT(*) as count FROM reservations 
             WHERE salle_id = ? 
             AND statut != 'Annule'
             AND (
                 (heure_debut < ? AND heure_fin > ?) OR
                 (heure_debut < ? AND heure_fin > ?) OR
                 (heure_debut >= ? AND heure_fin <= ?)
             )`,
            [salleId, fin, debut, fin, debut, debut, fin]
        ) as [ { count: number }[], unknown ];
        return rows[0].count === 0;
    }
}

export default Reservation;
