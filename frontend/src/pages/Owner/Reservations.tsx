import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTrash,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaDoorOpen 
} from 'react-icons/fa';
import api from '../../api/axiosConfig';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, reservations]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      // Récupérer toutes les réservations comme l'admin
      const response = await api.get('/reservations?limit=1000');
      const data = response.data.data || response.data;
      setReservations(data);
      setFilteredReservations(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(res => 
        res.reservation_id.toString().includes(term) ||
        (res.utilisateur_nom && res.utilisateur_nom.toLowerCase().includes(term)) ||
        (res.utilisateur_prenom && res.utilisateur_prenom.toLowerCase().includes(term)) ||
        (res.salle_nom && res.salle_nom.toLowerCase().includes(term))
      );
    }

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(res => res.statut === statusFilter);
    }

    setFilteredReservations(filtered);
    setCurrentPage(1);
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      await api.delete(`/reservations/${id}`);
      setReservations(reservations.filter(res => res.reservation_id !== id));
      alert('Réservation supprimée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/reservations/${id}/statut`, { statut: newStatus });
      
      setReservations(reservations.map(res => 
        res.reservation_id === id ? { ...res, statut: newStatus } : res
      ));
      
      alert('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirme': return 'bg-green-100 text-green-800';
      case 'EnAttente': return 'bg-yellow-100 text-yellow-800';
      case 'Annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

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
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
          <p className="text-gray-600">{filteredReservations.length} réservations trouvées</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par ID, nom, salle..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300  focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtre par statut */}
          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:ring-2 focus:ring-primary focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="EnAttente">En attente</option>
              <option value="Confirme">Confirmé</option>
              <option value="Annule">Annulé</option>
            </select>
          </div>

          {/* Bouton de réinitialisation */}
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFilter className="inline mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReservations.map((reservation) => (
                <tr key={reservation.reservation_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{reservation.reservation_id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center mr-3">
                        <FaUser className="text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.utilisateur_prenom} {reservation.utilisateur_nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.utilisateur_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaDoorOpen className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{reservation.salle_nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {new Date(reservation.heure_debut).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(reservation.heure_debut).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(reservation.heure_fin).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">
                      {parseFloat(reservation.prix_total).toLocaleString()} €
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-xl text-xs font-medium ${getStatusColor(reservation.statut)}`}>
                      {reservation.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {reservation.statut === 'EnAttente' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(reservation.reservation_id, 'Confirme')}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                            title="Confirmer"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(reservation.reservation_id, 'Annule')}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Annuler"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDeleteReservation(reservation.reservation_id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
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
                Page {currentPage} sur {totalPages} • {filteredReservations.length} réservations
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

export default Reservations;
