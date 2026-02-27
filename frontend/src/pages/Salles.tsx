import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SalleCard from '../components/SalleCard';
import api from '../api/axiosConfig';
import { FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const Salles = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    prix_min: '',
    prix_max: '',
    capacite_min: '',
    localisation: '',
  });

  useEffect(() => {
    fetchSalles();
  }, [filters]);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/salles');
      setSalles(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedSalles = [...salles].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (sortBy === 'prix_par_heure') {
      valueA = parseFloat(valueA);
      valueB = parseFloat(valueB);
    }

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const filteredSalles = sortedSalles.filter(salle => {
    if (filters.prix_min && parseFloat(salle.prix_par_heure) < parseFloat(filters.prix_min)) return false;
    if (filters.prix_max && parseFloat(salle.prix_par_heure) > parseFloat(filters.prix_max)) return false;
    if (filters.capacite_min && salle.capacite < parseInt(filters.capacite_min)) return false;
    if (filters.localisation && !salle.localisation?.toLowerCase().includes(filters.localisation.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Nos Salles</h1>
            <p className="text-gray-600">Découvrez toutes nos salles disponibles</p>
          </div>

          {/* Filtres et tri */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium flex items-center">
                  <FaFilter className="mr-2" />
                  Filtres :
                </span>
                <input
                  type="text"
                  placeholder="Localisation"
                  className="px-4 py-2 border rounded-lg"
                  value={filters.localisation}
                  onChange={(e) => setFilters({...filters, localisation: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Prix min"
                  className="px-4 py-2 border rounded-lg w-24"
                  value={filters.prix_min}
                  onChange={(e) => setFilters({...filters, prix_min: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Prix max"
                  className="px-4 py-2 border rounded-lg w-24"
                  value={filters.prix_max}
                  onChange={(e) => setFilters({...filters, prix_max: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Capacité min"
                  className="px-4 py-2 border rounded-lg w-32"
                  value={filters.capacite_min}
                  onChange={(e) => setFilters({...filters, capacite_min: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Trier par :</span>
                <button
                  onClick={() => handleSort('prix_par_heure')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${sortBy === 'prix_par_heure' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <span>Prix</span>
                  {sortBy === 'prix_par_heure' && (
                    sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />
                  )}
                </button>
                <button
                  onClick={() => handleSort('capacite')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${sortBy === 'capacite' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <span>Capacité</span>
                  {sortBy === 'capacite' && (
                    sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Liste des salles */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSalles.map((salle) => (
                  <SalleCard key={salle.salle_id} salle={salle} />
                ))}
              </div>

              {filteredSalles.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Aucune salle ne correspond à vos critères
                  </h3>
                  <button
                    onClick={() => setFilters({
                      prix_min: '',
                      prix_max: '',
                      capacite_min: '',
                      localisation: '',
                    })}
                    className="btn-primary"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Salles;