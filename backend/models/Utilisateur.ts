import { pool } from '../config/database.js';

export interface UtilisateurData {
    nom: string;
    image?: string;
    prenom?: string;
    email: string;
    mot_de_passe_hash?: string;
    numero_telephone?: string;
    type?: string;
    actif?: boolean;
}

class Utilisateur {
    static async create(utilisateur: UtilisateurData): Promise<number> {
        const [result] = await pool.execute(
            `INSERT INTO utilisateurs (nom, image, prenom, email, mot_de_passe_hash, numero_telephone, type) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                utilisateur.nom,
                utilisateur.image,
                utilisateur.prenom,
                utilisateur.email,
                utilisateur.mot_de_passe_hash,
                utilisateur.numero_telephone || null,
                utilisateur.type || 'Client'
            ]
        ) as [ { insertId: number }, unknown ];
        return result.insertId;
    }

    static async findById(id: number | string): Promise<Record<string, unknown> | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM utilisateurs WHERE utilisateur_id = ?',
            [id]
        ) as [Record<string, unknown>[], unknown];
        return rows[0] || null;
    }

    static async findByEmail(email: string): Promise<Record<string, unknown> | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM utilisateurs WHERE email = ?',
            [email]
        ) as [Record<string, unknown>[], unknown];
        return rows[0] || null;
    }

    static async findAll(limit: number | string = 100, offset: number | string = 0): Promise<Record<string, unknown>[]> {
        const limitNum = parseInt(String(limit)) || 100;
        const offsetNum = parseInt(String(offset)) || 0;
        
        const [rows] = await pool.execute(
            `SELECT * FROM utilisateurs LIMIT ${limitNum} OFFSET ${offsetNum}`
        ) as [Record<string, unknown>[], unknown];
        return rows;
    }
    
    static async update(id: number | string, utilisateur: Partial<UtilisateurData> & { actif?: boolean }): Promise<number> {
        const activite = (utilisateur.actif === false) ? 0 : 1;

        const [result] = await pool.execute(
            `UPDATE utilisateurs 
             SET nom = ?, image = ?, prenom = ?, email = ?, 
                 numero_telephone = ?, type = ?, actif = ? 
             WHERE utilisateur_id = ?`,
            [
                utilisateur.nom,
                utilisateur.image,
                utilisateur.prenom,
                utilisateur.email,
                utilisateur.numero_telephone || null,
                utilisateur.type || 'Client',
                activite,
                id
            ]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async updateStatus(id: number | string, utilisateur: { actif?: boolean }): Promise<number> {
        const activite = (utilisateur.actif === false) ? 0 : 1;

        const [result] = await pool.execute(
            `UPDATE utilisateurs 
             SET actif = ? 
             WHERE utilisateur_id = ?`,
            [
                activite,
                id
            ]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async delete(id: number | string): Promise<number> {
        const [result] = await pool.execute(
            'DELETE FROM utilisateurs WHERE utilisateur_id = ?',
            [id]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async toggleActivation(id: number | string): Promise<number> {
        const [result] = await pool.execute(
            `UPDATE utilisateurs 
             SET actif = NOT actif 
             WHERE utilisateur_id = ?`,
            [id]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async activate(id: number | string): Promise<number> {
        const [result] = await pool.execute(
            `UPDATE utilisateurs 
             SET actif = 1 
             WHERE utilisateur_id = ?`,
            [id]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }

    static async deactivate(id: number | string): Promise<number> {
        const [result] = await pool.execute(
            `UPDATE utilisateurs 
             SET actif = 0 
             WHERE utilisateur_id = ?`,
            [id]
        ) as [ { affectedRows: number }, unknown ];
        return result.affectedRows;
    }
}

export default Utilisateur;
