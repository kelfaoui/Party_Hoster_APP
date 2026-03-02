"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractId = extractId;
exports.extractIdAsNumber = extractIdAsNumber;
/**
 * Extrait l'ID des paramètres de la requête
 * Express peut retourner string | string[] pour req.params.id
 * Cette fonction normalise en string
 */
function extractId(reqParams) {
    const id = reqParams.id;
    return Array.isArray(id) ? id[0] : id;
}
/**
 * Extrait et convertit l'ID en nombre
 */
function extractIdAsNumber(reqParams) {
    const id = extractId(reqParams);
    return parseInt(id, 10);
}
//# sourceMappingURL=params.js.map