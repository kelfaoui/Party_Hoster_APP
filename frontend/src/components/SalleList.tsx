import React, { useState } from 'react';
import SalleCard from './SalleCard';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaUsers, FaEuroSign } from 'react-icons/fa';
import type { Salle } from '../types/salle';

const mockSalles: Salle[] = [
  {
    salle_id: 1,
    nom: 'Salle de conférence moderne',
    description: 'Salle spacieuse équipée pour vos réunions importantes',
    localisation: 'Paris',
    capacite: 50,
    prix_par_heure: 80,
    image: '/salle1.jpg',
  },
  {
    salle_id: 2,
    nom: 'Espace collaboratif',
    description: 'Parfait pour le travail en équipe',
    localisation: 'Lyon',
    capacite: 20,
    prix_par_heure: 50,
    image: '/salle2.jpg',
  },
  {
    salle_id: 3,
    nom: 'Salle événementielle',
    description: 'Idéale pour vos événements et célébrations',
    localisation: 'Marseille',
    capacite: 100,
    prix_par_heure: 120,
    image: '/salle3.jpg',
  },
  {
    salle_id: 4,
    nom: 'Bureau privé',
    description: 'Espace calme pour le travail individuel',
    localisation: 'Paris',
    capacite: 5,
    prix_par_heure: 30,
    image: '/salle4.jpg',
  },
  {
    salle_id: 5,
    nom: 'Salle de formation',
    description: 'Équipée pour vos sessions de formation',
    localisation: 'Toulouse',
    capacite: 30,
    prix_par_heure: 60,
    image: '/salle5.jpg',
  },
  {
    salle_id: 6,
    nom: 'Espace créatif',
    description: 'Inspirant pour vos brainstormings',
    localisation: 'Bordeaux',
    capacite: 15,
    prix_par_heure: 45,
    image: '/salle6.jpg',
  },
];

interface Filters {
  localisation: string;
  capacite_min: string;
  prix_max: string;
}

const SalleList = (): React.ReactElement => {
  const [salles] = useState<Salle[]>(mockSalles);
  const [loading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    localisation: '',
    capacite_min: '',
    prix_max: '',
  });

  const filteredSalles = salles.filter(
    (salle) =>
      salle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (salle.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (salle.localisation?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const resetFilters = (): void => {
    setFilters({ localisation: '', capacite_min: '', prix_max: '' });
    setSearchTerm('');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nos salles à louer</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Découvrez notre sélection de salles professionnelles équipées pour tous vos événements
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une salle..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Localisation..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.localisation}
                onChange={(e) => setFilters({ ...filters, localisation: e.target.value })}
              />
            </div>
            <div className="relative">
              <FaUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                placeholder="Capacité min..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.capacite_min}
                onChange={(e) => setFilters({ ...filters, capacite_min: e.target.value })}
              />
            </div>
            <div className="relative">
              <FaEuroSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                placeholder="Prix max..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.prix_max}
                onChange={(e) => setFilters({ ...filters, prix_max: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={resetFilters}
              className="text-gray-600 hover:text-primary flex items-center"
            >
              <FaFilter className="mr-2" />
              Réinitialiser les filtres
            </button>
            <span className="text-gray-700">{filteredSalles.length} salles trouvées</span>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : filteredSalles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Aucune salle trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSalles.map((salle) => (
              <SalleCard key={salle.salle_id} salle={salle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SalleList;
