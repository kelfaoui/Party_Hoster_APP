import React, { useState, useEffect } from 'react';
import { FaComment, FaSearch, FaFilter, FaTrash, FaEdit } from 'react-icons/fa';
import api from '../../api/axiosConfig';

const Commentaires = () => {
  const [commentaires, setCommentaires] = useState([]);
  const [filteredCommentaires, setFilteredCommentaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCommentaires();
  }, []);

  useEffect(() => {
    filterCommentaires();
  }, [searchTerm, commentaires]);

  const fetchCommentaires = async () => {
    try {
      setLoading(true);
      const response = await api.get('/commentaires/owner?limit=1000');
      setCommentaires(response.data);
      setFilteredCommentaires(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCommentaires = () => {
    let filtered = [...commentaires];

    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((comment: any) => 
        comment.commentaire_id.toString().includes(term) ||
        (comment.utilisateur_nom && comment.utilisateur_nom.toLowerCase().includes(term)) ||
        (comment.utilisateur_prenom && comment.utilisateur_prenom.toLowerCase().includes(term)) ||
        (comment.salle_nom && comment.salle_nom.toLowerCase().includes(term)) ||
        (comment.commentaire && comment.commentaire.toLowerCase().includes(term))
      );
    }

    setFilteredCommentaires(filtered);
    setCurrentPage(1);
  };

  const handleDeleteCommentaire = async (id: any) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await api.delete(`/commentaires/${id}`);
      setCommentaires(commentaires.filter((comment: any) => comment.commentaire_id !== id));
      alert('Commentaire supprimé avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const truncateText = (text: any, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommentaires = filteredCommentaires.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCommentaires.length / itemsPerPage);

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
          <h1 className="text-2xl font-bold text-gray-800">Commentaires de mes Salles</h1>
          <p className="text-gray-600">{filteredCommentaires.length} commentaires trouvés</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {commentaires.length}
          </div>
          <div className="text-gray-600">Total commentaires</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-green-500 mb-2">
            {new Set(commentaires.map(c => c.salle_nom)).size}
          </div>
          <div className="text-gray-600">Salles concernées</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-purple-500 mb-2">
            {new Set(commentaires.map(c => c.utilisateur_nom + ' ' + c.utilisateur_prenom)).size}
          </div>
          <div className="text-gray-600">Commentateurs</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche */}
          <div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par ID, utilisateur, salle, contenu..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Bouton de réinitialisation */}
          <div>
            <button
              onClick={() => setSearchTerm('')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFilter className="inline mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des commentaires */}
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
                  Commentaire
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
              {currentCommentaires.map((commentaire) => (
                <tr key={commentaire.commentaire_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{commentaire.commentaire_id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {commentaire.utilisateur_prenom} {commentaire.utilisateur_nom}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{commentaire.salle_nom}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900" title={commentaire.commentaire}>
                        {truncateText(commentaire.commentaire)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {new Date(commentaire.date_creation).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCommentaire(commentaire.commentaire_id)}
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
                Page {currentPage} sur {totalPages} • {filteredCommentaires.length} commentaires
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

export default Commentaires;
