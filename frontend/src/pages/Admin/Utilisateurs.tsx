import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTrash, 
  FaEdit, 
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserShield,
  FaUserTag
} from 'react-icons/fa';
import api from '../../api/axiosConfig';

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    role: 'all',
    statut: 'all'
  });

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/utilisateurs?limit=1000');
      setUtilisateurs(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUtilisateur = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      await api.delete(`/utilisateurs/${id}`);
      setUtilisateurs(utilisateurs.filter(user => user.utilisateur_id !== id));
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/utilisateurs/${id}/status`, { actif: !currentStatus });
      setUtilisateurs(utilisateurs.map(user => 
        user.utilisateur_id === id ? { ...user, actif: !currentStatus } : user
      ));
      alert(`Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du statut');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Administrateur':
        return 'bg-purple-100 text-purple-800';
      case 'Proprietaire':
        return 'bg-blue-100 text-blue-800';
      case 'Client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Administrateur':
        return <FaUserShield className="w-4 h-4" />;
      case 'Proprietaire':
        return <FaUserTag className="w-4 h-4" />;
      default:
        return <FaUser className="w-4 h-4" />;
    }
  };

  // Filtrage
  const filteredUtilisateurs = utilisateurs.filter(user => {
    const matchesSearch = 
      (user.nom && user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.prenom && user.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.numero_telephone && user.numero_telephone.includes(searchTerm));
    
    const matchesRole = filters.role === 'all' || user.type === filters.role;
    const matchesStatut = filters.statut === 'all' || 
      (filters.statut === 'actif' && user.actif) ||
      (filters.statut === 'inactif' && !user.actif);
    
    return matchesSearch && matchesRole && matchesStatut;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUtilisateurs = filteredUtilisateurs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUtilisateurs.length / itemsPerPage);

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
          <h1 className="text-2xl font-semibold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">
            {filteredUtilisateurs.length} utilisateur{filteredUtilisateurs.length !== 1 ? 's' : ''} trouvé{filteredUtilisateurs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/admin/utilisateurs/ajouter"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <FaUser className="w-4 h-4" />
          Ajouter un utilisateur
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, email ou téléphone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
            >
              <option value="all">Tous les rôles</option>
              <option value="Administrateur">Administrateur</option>
              <option value="Proprietaire">Propriétaire</option>
              <option value="Client">Client</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filters.statut}
              onChange={(e) => setFilters({...filters, statut: e.target.value})}
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          <button
            onClick={() => {
              setFilters({ role: 'all', statut: 'all' });
              setSearchTerm('');
            }}
            className="self-end px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Utilisateurs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
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
              {currentUtilisateurs.length > 0 ? (
                currentUtilisateurs.map((user) => (
                  <tr key={user.utilisateur_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.utilisateur_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 w-4 h-4" />
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                        {user.numero_telephone && (
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700">{user.numero_telephone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.type)}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-xl ${getRoleBadgeColor(user.type)}`}>
                          {user.type || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400 w-4 h-4" />
                        <span className="text-gray-700">{formatDate(user.date_creation)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStatus(user.utilisateur_id, user.actif)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-semibold ${
                            user.actif
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {user.actif ? (
                            <>
                              <FaCheckCircle className="w-4 h-4" />
                              Actif
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="w-4 h-4" />
                              Inactif
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/utilisateurs/${user.utilisateur_id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Voir détails"
                        >
                          <FaEye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/admin/utilisateurs/modifier/${user.utilisateur_id}`}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors p-1 rounded hover:bg-yellow-50"
                          title="Modifier"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteUtilisateur(user.utilisateur_id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
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
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FaUser className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      {searchTerm || filters.role !== 'all' || filters.statut !== 'all' 
                        ? 'Aucun utilisateur ne correspond à vos critères.'
                        : 'Aucun utilisateur enregistré.'}
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
                  {Math.min(indexOfLastItem, filteredUtilisateurs.length)}
                </span>{' '}
                sur <span className="font-medium">{filteredUtilisateurs.length}</span> utilisateurs
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
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                    return false;
                  })
                  .map((page, index, array) => {
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
      </div>
    </div>
  );
};

export default Utilisateurs;
