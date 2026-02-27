export interface User {
  utilisateur_id: number;
  nom: string;
  prenom?: string;
  email: string;
  type: string;
}

export interface Salle {
  salle_id: number;
  nom: string;
  description?: string;
  capacite: number;
  prix_par_heure: number;
  image?: string;
  localisation?: string;
  equipements?: string | string[];
}

export interface ReservationData {
  date: string;
  heure_debut: string;
  heure_fin: string;
  nombre_personnes: number;
}
