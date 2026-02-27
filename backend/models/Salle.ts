import { pool } from '../config/database.js';

export interface SalleFilters {
    utilisateur_id?: string | number;
    localisation?: string;
    capacite_min?: string | number;
    prix_max?: string | number;
}

export interface SalleData {
    nom: string;
    utilisateur_id?: number;
    image?: string;
    description?: string;
    capacite: number;
    prix_par_heure: number;
    localisation?: string;
    longitude?: string | number;
    latitude?: string | number;
    equipements?: string;
}

class Salle {
    static async create(salle: SalleData): Promise<number> {
        const [result] = await pool.execute(
            `INSERT INTO salles (nom, utilisateur_id, image, description, capacite, 
             prix_par_heure, localisation, longitude, latitude, equipements) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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
            ]
        ) as [ { insertId: number }, unknown ];
        return result.insertId;
    }

    static async findById(id: number | string): Promise<Record<string, unknown> | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM salles WHERE salle_id = ?',
            [id]
        ) as [Record<string, unknown>[], unknown];
        return rows[0] || null;
    }

    static async findAll(filters: SalleFilters = {}, limit: number | string = 100, offset: number | string = 0): Promise<Record<string, unknown>[]> {
        let query = 'SELECT * FROM salles WHERE 1=1';
        const params: (string | number)[] = [];
    
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
            const [rows] = await pool.execute(query, params) as [Record<string, unknown>[], unknown];
            return rows;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    static async update(id: number | string, salle: Partial<SalleData>): Promise<number> {
        const [result] = await pool.execute(
            `UPDATE salles 
             SET nom = ?, image = ?, description = ?, capacite = ?, 
                 prix_par_heure = ?, localisation = ?, longitude = ?, 
                 latitude = ?, equipements = ? 
             WHERE salle_id = ?`,
            [
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
            ]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async delete(id: number | string): Promise<number> {
        const [result] = await pool.execute(
            'DELETE FROM salles WHERE salle_id = ?',
            [id]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async getSallesDisponibles(debut: Date, fin: Date): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT s.* FROM salles s
             WHERE s.salle_id NOT IN (
                 SELECT r.salle_id FROM reservations r
                 WHERE r.statut != 'Annule'
                 AND (
                     (r.heure_debut < ? AND r.heure_fin > ?) OR
                     (r.heure_debut < ? AND r.heure_fin > ?) OR
                     (r.heure_debut >= ? AND r.heure_fin <= ?)
                 )
             )`,
            [fin, debut, fin, debut, debut, fin]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }

    static async findByUtilisateurId(utilisateurId: number | string): Promise<Record<string, unknown>[]> {
        const [rows] = await pool.execute(
            `SELECT s.* FROM salles s 
             WHERE s.utilisateur_id = ?`,
            [utilisateurId]
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }
}

export default Salle;
