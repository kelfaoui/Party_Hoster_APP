import { pool } from '../config/database.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UtilisateurRow extends RowDataPacket {
  utilisateur_id: number;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe_hash: string;
  image: string;
  numero_telephone: string | null;
  type: string;
  actif: number;
}

export interface UtilisateurCreate {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe_hash: string;
  image?: string;
  numero_telephone?: string | null;
  type?: string;
}

export interface UtilisateurUpdate {
  nom?: string;
  prenom?: string;
  email?: string;
  image?: string;
  numero_telephone?: string | null;
  type?: string;
  actif?: boolean;
}

class Utilisateur {
  static async create(utilisateur: UtilisateurCreate): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO utilisateurs (nom, image, prenom, email, mot_de_passe_hash, numero_telephone, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        utilisateur.nom,
        utilisateur.image ?? 'default.jpg',
        utilisateur.prenom,
        utilisateur.email,
        utilisateur.mot_de_passe_hash,
        utilisateur.numero_telephone ?? null,
        utilisateur.type ?? 'Client',
      ]
    );
    return result.insertId;
  }

  static async findById(id: number | string): Promise<UtilisateurRow | null> {
    const [rows] = await pool.execute<UtilisateurRow[]>(
      'SELECT * FROM utilisateurs WHERE utilisateur_id = ?',
      [id]
    );
    return rows[0] ?? null;
  }

  static async findByEmail(email: string): Promise<UtilisateurRow | null> {
    const [rows] = await pool.execute<UtilisateurRow[]>(
      'SELECT * FROM utilisateurs WHERE email = ?',
      [email]
    );
    return rows[0] ?? null;
  }

  static async findAll(limit: number = 100, offset: number = 0): Promise<UtilisateurRow[]> {
    const limitNum = parseInt(String(limit), 10) || 100;
    const offsetNum = parseInt(String(offset), 10) || 0;
    const [rows] = await pool.execute<UtilisateurRow[]>(
      `SELECT * FROM utilisateurs LIMIT ${limitNum} OFFSET ${offsetNum}`
    );
    return rows;
  }

  static async update(id: number | string, utilisateur: UtilisateurUpdate): Promise<number> {
    const activite = utilisateur.actif === false ? 0 : 1;
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE utilisateurs 
       SET nom = ?, image = ?, prenom = ?, email = ?, 
           numero_telephone = ?, type = ?, actif = ? 
       WHERE utilisateur_id = ?`,
      [
        utilisateur.nom ?? '',
        utilisateur.image ?? 'default.jpg',
        utilisateur.prenom ?? '',
        utilisateur.email ?? '',
        utilisateur.numero_telephone ?? null,
        utilisateur.type ?? 'Client',
        activite,
        id,
      ]
    );
    return result.affectedRows;
  }

  static async updateStatus(id: number | string, data: { actif: boolean }): Promise<number> {
    const activite = data.actif === false ? 0 : 1;
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE utilisateurs SET actif = ? WHERE utilisateur_id = ?`,
      [activite, id]
    );
    return result.affectedRows;
  }

  static async delete(id: number | string): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM utilisateurs WHERE utilisateur_id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async toggleActivation(id: number | string): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE utilisateurs SET actif = NOT actif WHERE utilisateur_id = ?`,
      [id]
    );
    return result.affectedRows;
  }

  static async activate(id: number | string): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE utilisateurs SET actif = 1 WHERE utilisateur_id = ?`,
      [id]
    );
    return result.affectedRows;
  }

  static async deactivate(id: number | string): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE utilisateurs SET actif = 0 WHERE utilisateur_id = ?`,
      [id]
    );
    return result.affectedRows;
  }
}

export default Utilisateur;
