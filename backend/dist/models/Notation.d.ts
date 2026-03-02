export interface NotationData {
    utilisateur_id: number;
    salle_id: number;
    note: number;
}
declare class Notation {
    static create(notation: NotationData): Promise<number>;
    static findBySalleId(salleId: number | string): Promise<Record<string, unknown>[]>;
    static findByUtilisateurAndSalle(utilisateurId: number | string, salleId: number | string): Promise<Record<string, unknown> | null>;
    static getMoyenneSalle(salleId: number | string): Promise<{
        moyenne: number | string;
        total_notes: number;
    }>;
    static update(notationId: number | string, note: number): Promise<number>;
    static delete(notationId: number | string): Promise<number>;
    static findAll(limit?: number, offset?: number): Promise<Record<string, unknown>[]>;
    static findByOwnerId(proprietaireId: number | string, limit?: number, offset?: number): Promise<Record<string, unknown>[]>;
    static findById(notationId: number | string): Promise<Record<string, unknown> | null>;
}
export default Notation;
