/**
 * Extrait l'ID des paramètres de la requête
 * Express peut retourner string | string[] pour req.params.id
 * Cette fonction normalise en string
 */
export declare function extractId(reqParams: any): string;
/**
 * Extrait et convertit l'ID en nombre
 */
export declare function extractIdAsNumber(reqParams: any): number;
