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
declare class Utilisateur {
    static create(utilisateur: UtilisateurData): Promise<number>;
    static findById(id: number | string): Promise<Record<string, unknown> | null>;
    static findByEmail(email: string): Promise<Record<string, unknown> | null>;
    static findAll(limit?: number | string, offset?: number | string): Promise<Record<string, unknown>[]>;
    static update(id: number | string, utilisateur: Partial<UtilisateurData> & {
        actif?: boolean;
    }): Promise<number>;
    static updateStatus(id: number | string, utilisateur: {
        actif?: boolean;
    }): Promise<number>;
    static delete(id: number | string): Promise<number>;
    static toggleActivation(id: number | string): Promise<number>;
    static activate(id: number | string): Promise<number>;
    static deactivate(id: number | string): Promise<number>;
}
export default Utilisateur;
