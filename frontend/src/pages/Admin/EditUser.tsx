import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaIdCard,
  FaUserShield,
  FaUserTag
} from 'react-icons/fa';
import api from '../../api/axiosConfig';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    type: 'Client',
    actif: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.put(`/utilisateurs/${id}`, user);
      alert('Utilisateur mis à jour avec succès');
      navigate(`/admin/utilisateurs/${id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-xl h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
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
            to={`/admin/utilisateurs/${id}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <FaArrowLeft />
            <span>Retour aux détails</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'utilisateur</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations Personnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={user.prenom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={user.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="email@exemple.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={user.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Adresse
                </label>
                <textarea
                  name="adresse"
                  value={user.adresse}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="123 rue de la République, 75001 Paris"
                />
              </div>
            </div>
          </div>

          {/* Informations du compte */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Informations du compte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserShield className="inline mr-2" />
                  Type de compte
                </label>
                <select
                  name="type"
                  value={user.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Client">Client</option>
                  <option value="Proprietaire">Propriétaire</option>
                  <option value="Administrateur">Administrateur</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="actif"
                    checked={user.actif}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Compte actif
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              to={`/admin/utilisateurs/${id}`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="group relative flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative flex items-center space-x-2">
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Enregistrer</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
