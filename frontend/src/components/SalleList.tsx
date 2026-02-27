import React, { useState, useEffect } from 'react';
import SalleCard from './SalleCard';
import api from '../api/axiosConfig';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaUsers, FaEuroSign } from 'react-icons/fa';

const SalleList = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    localisation: '',
    capacite_min: '',
    prix_max: '',
  });

  useEffect(() => {
    fetchSalles();
  }, [filters]);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.localisation) params.localisation = filters.localisation;
      if (filters.capacite_min) params.capacite_min = filters.capacite_min;
      if (filters.prix_max) params.prix_max = filters.prix_max;
      
      const response = await api.get('/salles', { params });
      setSalles(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des salles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSalles = salles.filter(salle =>
    salle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (salle.description && salle.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (salle.localisation && salle.localisation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetFilters = () => {
    setFilters({
      localisation: '',
      capacite_min: '',
      prix_max: '',
    });
    setSearchTerm('');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nos salles à louer
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Découvrez notre sélection de salles professionnelles équipées pour tous vos événements
          </p>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Barre de recherche */}
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

            {/* Localisation */}
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

            {/* Capacité minimum */}
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

            {/* Prix maximum */}
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
              onClick={resetFilters}
              className="text-gray-600 hover:text-primary flex items-center"
            >
              <FaFilter className="mr-2" />
              Réinitialiser les filtres
            </button>
            <span className="text-gray-700">
              {filteredSalles.length} salles trouvées
            </span>
          </div>
        </div>

        {/* Liste des salles */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredSalles.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Aucune salle trouvée
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSalles.map((salle) => (
                  <SalleCard key={salle.salle_id} salle={salle} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Bouton Voir plus pour voir toutes les salles*/}
        {filteredSalles.length > 6 && (
          <div className="text-center mt-12">
            <a
              href="/salles"
              className="btn-outline px-8 py-3 text-lg border-1 border-red-600 text-red-600 rounded-xl"
            > 
              Voir toutes nos salles
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default SalleList;