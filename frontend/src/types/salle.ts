export interface Salle {
  salle_id: number;
  nom: string;
  description?: string;
  localisation?: string;
  capacite: number;
  prix_par_heure: number;
  image?: string;
}
