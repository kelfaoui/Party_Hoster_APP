import React, { useState, useEffect } from 'react';
import { FaStar, FaSearch, FaFilter, FaTrash } from 'react-icons/fa';
import api from '../../api/axiosConfig';

const Notations = () => {
  const [notations, setNotations] = useState([]);
  const [filteredNotations, setFilteredNotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteFilter, setNoteFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotations();
  }, []);

  useEffect(() => {
    filterNotations();
  }, [searchTerm, noteFilter, notations]);

  const fetchNotations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notations/all?limit=1000');
      setNotations(response.data);
      setFilteredNotations(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotations = () => {
    let filtered = [...notations];

    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((not: any) => 
        not.notation_id.toString().includes(term) ||
        (not.utilisateur_nom && not.utilisateur_nom.toLowerCase().includes(term)) ||
        (not.utilisateur_prenom && not.utilisateur_prenom.toLowerCase().includes(term)) ||
        (not.salle_nom && not.salle_nom.toLowerCase().includes(term))
      );
    }

    // Filtrer par note
    if (noteFilter !== 'all') {
      filtered = filtered.filter((not: any) => not.note === parseInt(noteFilter));
    }

    setFilteredNotations(filtered);
    setCurrentPage(1);
  };

  const handleDeleteNotation = async (id: any) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette notation ?')) {
      return;
    }

    try {
      await api.delete(`/notations/${id}`);
      setNotations(notations.filter((not: any) => not.notation_id !== id));
      alert('Notation supprimée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const renderStars = (note: any) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-4 h-4 ${
              star <= note ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{note}/5</span>
      </div>
    );
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotations = filteredNotations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotations.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-xl h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Notations</h1>
          <p className="text-gray-600">{filteredNotations.length} notations trouvées</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par ID, utilisateur, salle..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtre par note */}
          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              value={noteFilter}
              onChange={(e) => setNoteFilter(e.target.value)}
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>

          {/* Bouton de réinitialisation */}
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setNoteFilter('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFilter className="inline mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des notations */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentNotations.map((notation) => (
                <tr key={notation.notation_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{notation.notation_id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {notation.utilisateur_prenom} {notation.utilisateur_nom}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{notation.salle_nom}</div>
                  </td>
                  <td className="px-6 py-4">
                    {renderStars(notation.note)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {new Date(notation.date_creation).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteNotation(notation.notation_id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages} • {filteredNotations.length} notations
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notations;
