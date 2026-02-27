import React, { useState } from 'react';
import { FaTimes, FaUpload, FaMapMarkerAlt, FaUsers, FaEuroSign, FaPlus } from 'react-icons/fa';
import api from '../../api/axiosConfig';

const SalleModal = ({ isOpen, onClose, onSalleCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    localisation: '',
    capacite: '',
    prix_par_heure: '',
    equipements: '',
    latitude: '',
    longitude: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.localisation.trim()) newErrors.localisation = 'La localisation est requise';
    if (!formData.capacite || formData.capacite <= 0) newErrors.capacite = 'La capacité doit être un nombre positif';
    if (!formData.prix_par_heure || formData.prix_par_heure <= 0) newErrors.prix_par_heure = 'Le prix doit être un nombre positif';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData for file upload
      const dataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          dataToSend.append(key, formData[key]);
        }
      });
      
      // Add image file if exists
      if (imageFile) {
        dataToSend.append('image', imageFile);
      }

      // Send request
      const response = await api.post('/salles', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form and close modal
      resetForm();
      onClose();
      
      // Notify parent component
      if (onSalleCreated) {
        onSalleCreated();
      }
      
      alert(response.data.message || 'Salle créée avec succès!');
      
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la création de la salle';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      localisation: '',
      capacite: '',
      prix_par_heure: '',
      equipements: '',
      latitude: '',
      longitude: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-opacity-50 ">
      {/* Backdrop */}
      <div 
        className="fixed inset-0  bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Ajouter une nouvelle salle
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de la salle
              </label>
              <div className="mt-1 flex flex-col items-center">
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative hover:border-primary transition-colors">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-xl hover:bg-red-600 transition-colors"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <FaUpload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 mb-2">
                        Cliquez pour télécharger une image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF jusqu'à 5MB
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la salle *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Salle de conférence principale"
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Décrivez votre salle (équipements, ambiance, etc.)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="inline mr-1" />
                  Localisation *
                </label>
                <input
                  type="text"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.localisation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Adresse complète"
                />
                {errors.localisation && (
                  <p className="mt-1 text-sm text-red-600">{errors.localisation}</p>
                )}
              </div>

              {/* Capacité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUsers className="inline mr-1" />
                  Capacité (personnes) *
                </label>
                <input
                  type="number"
                  name="capacite"
                  min="1"
                  value={formData.capacite}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.capacite ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 50"
                />
                {errors.capacite && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacite}</p>
                )}
              </div>

              {/* Prix par heure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaEuroSign className="inline mr-1" />
                  Prix par heure (€) *
                </label>
                <input
                  type="number"
                  name="prix_par_heure"
                  min="0"
                  step="0.01"
                  value={formData.prix_par_heure}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.prix_par_heure ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 150.00"
                />
                {errors.prix_par_heure && (
                  <p className="mt-1 text-sm text-red-600">{errors.prix_par_heure}</p>
                )}
              </div>

              {/* Équipements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Équipements
                </label>
                <input
                  type="text"
                  name="equipements"
                  value={formData.equipements}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Projecteur, WiFi, Tableau blanc"
                />
              </div>
            </div>

            {/* Coordonnées GPS (optionnel) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude (optionnel)
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: 48.8566"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude (optionnel)
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: 2.3522"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center space-x-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Création...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                      <span>Créer la salle</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalleModal;