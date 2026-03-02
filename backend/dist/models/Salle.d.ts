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
declare class Salle {
    static create(salle: SalleData): Promise<number>;
    static findById(id: number | string): Promise<Record<string, unknown> | null>;
    static findAll(filters?: SalleFilters, limit?: number | string, offset?: number | string): Promise<Record<string, unknown>[]>;
    static update(id: number | string, salle: Partial<SalleData>): Promise<number>;
    static delete(id: number | string): Promise<number>;
    static getSallesDisponibles(debut: Date, fin: Date): Promise<Record<string, unknown>[]>;
    static findByUtilisateurId(utilisateurId: number | string): Promise<Record<string, unknown>[]>;
}
export default Salle;
