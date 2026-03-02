export interface ReservationData {
    utilisateur_id: number;
    salle_id: number;
    heure_debut: string;
    heure_fin: string;
    prix_total: number;
    statut?: string;
}
declare class Reservation {
    static create(reservation: ReservationData): Promise<number>;
    static findById(id: number | string): Promise<Record<string, unknown> | null>;
    static findByUtilisateurId(utilisateurId: number | string): Promise<Record<string, unknown>[]>;
    static findByOwnerId(utilisateurId: number | string): Promise<Record<string, unknown>[]>;
    static findBySalleId(salleId: number | string): Promise<Record<string, unknown>[]>;
    static findAll(limit?: number | string, offset?: number | string): Promise<Record<string, unknown>[]>;
    static updateStatus(id: number | string, statut: string): Promise<number>;
    static delete(id: number | string): Promise<number>;
    static checkDisponibilite(salleId: number | string, debut: string | Date, fin: string | Date): Promise<boolean>;
}
export default Reservation;
