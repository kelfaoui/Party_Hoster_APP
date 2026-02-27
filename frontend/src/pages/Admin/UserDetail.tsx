import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaEdit,
  FaUserShield,
  FaUserTag,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaIdCard
} from 'react-icons/fa';
import api from '../../api/axiosConfig';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/utilisateurs/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Utilisateur non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await api.put(`/utilisateurs/${id}/statut`, { actif: !user.actif });
      setUser({ ...user, actif: !user.actif });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Administrateur': return 'bg-purple-100 text-purple-800';
      case 'Proprietaire': return 'bg-blue-100 text-blue-800';
      case 'Client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Administrateur': return <FaUserShield className="w-4 h-4" />;
      case 'Proprietaire': return <FaUserTag className="w-4 h-4" />;
      case 'Client': return <FaUser className="w-4 h-4" />;
      default: return <FaUser className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-xl h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/utilisateurs"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <FaArrowLeft />
            <span>Retour aux utilisateurs</span>
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FaUser className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Utilisateur non trouvé'}</h2>
          <p className="text-gray-600 mb-4">L'utilisateur que vous recherchez n'existe pas.</p>
          <Link
            to="/admin/utilisateurs"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/utilisateurs"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <FaArrowLeft />
            <span>Retour aux utilisateurs</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Détails de l'utilisateur</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              user.actif
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {user.actif ? (
              <>
                <FaTimesCircle className="w-4 h-4" />
                Désactiver
              </>
            ) : (
              <>
                <FaCheckCircle className="w-4 h-4" />
                Activer
              </>
            )}
          </button>
          <Link
            to={`/admin/utilisateurs/modifier/${user.utilisateur_id}`}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <FaEdit className="w-4 h-4" />
            Modifier
          </Link>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
              {user.photo_url ? (
                <img
                  className="w-20 h-20 rounded-xl"
                  src={user.photo_url}
                  alt={`${user.prenom} ${user.nom}`}
                />
              ) : (
                <FaUser className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{user.prenom} {user.nom}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.type)}`}>
                  {getRoleIcon(user.type)}
                  <span className="ml-1">{user.type}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations Personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations personnelles</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaIdCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">ID Utilisateur</p>
                    <p className="font-medium text-gray-900">#{user.utilisateur_id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaEnvelope className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                {user.telephone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{user.telephone}</p>
                    </div>
                  </div>
                )}

                {user.adresse && (
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium text-gray-900">{user.adresse}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informations du compte */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations du compte</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date d'inscription</p>
                    <p className="font-medium text-gray-900">
                      {new Date(user.date_creation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaUserShield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Type de compte</p>
                    <p className="font-medium text-gray-900">{user.type}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Statut du compte</p>
                    <p className="font-medium text-gray-900">
                      {user.actif ? 'Actif' : 'Inactif'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
