/**
 * Extrait l'ID des paramètres de la requête
 * Express peut retourner string | string[] pour req.params.id
 * Cette fonction normalise en string
 */
export function extractId(reqParams: any): string {
  const id = reqParams.id;
  return Array.isArray(id) ? id[0] : id;
}

/**
 * Extrait et convertit l'ID en nombre
 */
export function extractIdAsNumber(reqParams: any): number {
  const id = extractId(reqParams);
  return parseInt(id, 10);
}
