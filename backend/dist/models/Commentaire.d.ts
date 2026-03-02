export interface CommentaireData {
    utilisateur_id: number;
    salle_id: number;
    commentaire: string;
}
declare class Commentaire {
    static create(commentaire: CommentaireData): Promise<number>;
    static findBySalleId(salleId: number | string): Promise<Record<string, unknown>[]>;
    static findById(commentaireId: number | string): Promise<Record<string, unknown> | null>;
    static update(commentaireId: number | string, commentaire: string): Promise<number>;
    static delete(commentaireId: number | string): Promise<number>;
    static findAll(limit?: number, offset?: number): Promise<Record<string, unknown>[]>;
    static findByOwnerId(proprietaireId: number | string, limit?: number, offset?: number): Promise<Record<string, unknown>[]>;
}
export default Commentaire;
