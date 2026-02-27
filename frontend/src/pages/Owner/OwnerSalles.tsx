import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTrash, 
  FaEdit,
  FaMapMarkerAlt,
  FaUsers,
  FaEuroSign,
  FaPlus,
  FaCalendarAlt,
  FaDoorOpen
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import SalleModal from './SalleModal'; // Import the modal

const OwnerSalles = () => {
  const [salles, setSalles] = useState<any[]>([]);
  const [filteredSalles, setFilteredSalles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSalles();
  }, []);

  useEffect(() => {
    filterSalles();
  }, [searchTerm, salles]);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      // Récupérer toutes les salles comme l'admin
      const response = await api.get('/salles?limit=1000');
      const data = response.data.data || response.data;
      setSalles(data);
      setFilteredSalles(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to refresh salles after creation
  const handleSalleCreated = () => {
    fetchSalles();
  };

  const filterSalles = () => {
    let filtered = [...salles];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(salle =>
        salle.nom.toLowerCase().includes(term) ||
        (salle.localisation && salle.localisation.toLowerCase().includes(term)) ||
        (salle.description && salle.description.toLowerCase().includes(term))
      );
    }

    setFilteredSalles(filtered);
    setCurrentPage(1);
  };

  const handleDeleteSalle = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      return;
    }

    try {
      await api.delete(`/salles/${id}`);
      setSalles(salles.filter(salle => salle.salle_id !== id));
      alert('Salle supprimée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Update the "Ajouter une salle" button in the header:
  const headerButtons = (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Remove the Link button and replace with button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-primary text-gray-800 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
      >
        <FaPlus className="w-4 h-4" />
        Ajouter une salle
      </button>
      
      {/* Keep the existing Link for the detailed form page if needed */}
      <Link
        to="/salles/ajouter"
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <FaEdit className="w-4 h-4" />
        Formulaire détaillé
      </Link>
    </div>
  );



  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSalles = filteredSalles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSalles.length / itemsPerPage);

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
        <h1 className="text-2xl font-semibold text-gray-800">Gestion des Salles</h1>
        <p className="text-gray-600">
          {filteredSalles.length} salle{filteredSalles.length !== 1 ? 's' : ''} trouvée{filteredSalles.length !== 1 ? 's' : ''}
        </p>
      </div>
      {headerButtons}
    </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une salle par nom, localisation ou description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FaFilter className="w-4 h-4" />
            Filtres
          </button>
        </div>
      </div>

      {/* Salles Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSalles.length > 0 ? (
                currentSalles.map((salle) => (
                  <tr key={salle.salle_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{salle.nom}</div>
                        {salle.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {salle.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {salle.image ? (
                          <img
                            src={salle.image.startsWith('http') ? salle.image : `http://localhost:5000${salle.image}`}
                            alt={salle.nom}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Image';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FaDoorOpen className="text-gray-400 w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-gray-700">{salle.localisation || 'Non spécifié'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-gray-400" />
                        <span className="text-gray-700">{salle.capacite || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaEuroSign className="text-gray-400" />
                        <span className="text-gray-700">{salle.prix_par_heure ? `${salle.prix_par_heure} €/heure` : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400 w-4 h-4" />
                        <span className="text-gray-700">
                          {salle.date_creation ? new Date(salle.date_creation).toLocaleDateString('fr-FR') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/salles/${salle.salle_id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Voir détails"
                        >
                          <FaEye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/owner/salles/modifier/${salle.salle_id}`}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Modifier"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteSalle(salle.salle_id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Supprimer"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? 'Aucune salle ne correspond à votre recherche.' : 'Aucune salle disponible.'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredSalles.length)}
                </span>{' '}
                sur <span className="font-medium">{filteredSalles.length}</span> salles
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and pages around current
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                    return false;
                  })
                  .map((page, index, array) => {
                    // Add ellipsis for gaps
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                      ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Add the modal at the end of your component */}
      <SalleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSalleCreated={handleSalleCreated}
      />
      </div>
    </div>
  );
};

export default OwnerSalles;