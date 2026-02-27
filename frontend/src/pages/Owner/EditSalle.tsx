import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaSave, 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaEuroSign,
  FaUsers,
  FaWifi,
  FaCar,
  FaSnowflake,
  FaTv,
  FaDoorOpen,
  FaCamera,
  FaPlus,
  FaTrash,
  FaUpload
} from 'react-icons/fa';
import api from '../../api/axiosConfig';

const EditSalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [salle, setSalle] = useState({
    nom: '',
    description: '',
    localisation: '',
    capacite: '',
    prix_par_heure: '',
    longitude: '',
    latitude: '',
    equipements: [],
    image: '',
    disponibilite: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchSalle();
  }, [id]);

  const fetchSalle = async () => {
    try {
      const response = await api.get(`/salles/${id}`);
      const data = response.data;
      setSalle({
        nom: data.nom || '',
        description: data.description || '',
        localisation: data.localisation || '',
        capacite: data.capacite || '',
        prix_par_heure: data.prix_par_heure || '',
        longitude: data.longitude || '',
        latitude: data.latitude || '',
        equipements: data.equipements ? JSON.parse(data.equipements) : [],
        image: data.image || '',
        disponibilite: data.disponibilite !== undefined ? data.disponibilite : true
      });
      setImagePreview(data.image || '');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement de la salle');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide (JPEG, PNG, etc.)');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setSalle(prev => ({ ...prev, image: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSalle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEquipementChange = (index, value) => {
    const newEquipements = [...salle.equipements];
    newEquipements[index] = value;
    setSalle(prev => ({ ...prev, equipements: newEquipements }));
  };

  const addEquipement = () => {
    setSalle(prev => ({
      ...prev,
      equipements: [...prev.equipements, '']
    }));
  };

  const removeEquipement = (index) => {
    const newEquipements = salle.equipements.filter((_, i) => i !== index);
    setSalle(prev => ({ ...prev, equipements: newEquipements }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = salle.image; // Conserver l'image existante par défaut

      // Si un nouveau fichier image est sélectionné, l'uploader
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
          const uploadResponse = await api.post('/salles/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          imageUrl = uploadResponse.data.imagePath;
        } catch (uploadError) {
          console.error('Erreur upload image:', uploadError);
          alert('Erreur lors de l\'upload de l\'image');
          setSaving(false);
          return;
        }
      }

      const salleData = {
        nom: salle.nom,
        description: salle.description,
        localisation: salle.localisation,
        capacite: parseInt(salle.capacite),
        prix_par_heure: parseFloat(salle.prix_par_heure),
        longitude: salle.longitude || null,
        latitude: salle.latitude || null,
        equipements: JSON.stringify(salle.equipements.filter(eq => eq.trim() !== '')),
        image: imageUrl, // Utiliser la nouvelle image ou l'existante
        disponibilite: salle.disponibilite
      };

      await api.put(`/salles/${id}`, salleData);
      alert('Salle mise à jour avec succès');
      navigate('/owner/salles');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour de la salle: ' + (error as any).message);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/owner/salles')}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Modifier la salle</h1>
            <p className="text-gray-600">Mettre à jour les informations de la salle</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations générales</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la salle *</label>
                <input
                  type="text"
                  name="nom"
                  value={salle.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={salle.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="localisation"
                    value={salle.localisation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={salle.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={salle.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Caractéristiques</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUsers className="inline mr-1" />
                    Capacité *
                  </label>
                  <input
                    type="number"
                    name="capacite"
                    value={salle.capacite}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaEuroSign className="inline mr-1" />
                    Prix par heure *
                  </label>
                  <input
                    type="number"
                    name="prix_par_heure"
                    value={salle.prix_par_heure}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="disponibilite"
                    checked={salle.disponibilite}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Salle disponible
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Équipements</h3>
              <button
                type="button"
                onClick={addEquipement}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                <span>Ajouter un équipement</span>
              </button>
            </div>
            
            <div className="space-y-2">
              {salle.equipements.map((equipement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={equipement}
                    onChange={(e) => handleEquipementChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Wi-Fi, Climatisation, Projecteur..."
                  />
                  {salle.equipements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEquipement(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Image de la salle</h3>
            <div className="space-y-4">
              {/* Zone d'upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <FaUpload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Cliquez pour uploader une image
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF jusqu'à 5MB
                  </span>
                </label>
              </div>

              {/* Aperçu de l'image */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aperçu de la salle"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Supprimer l'image"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {imageFile ? 'Nouvelle image' : 'Image actuelle'}
                  </div>
                </div>
              )}

              {/* Informations sur le fichier */}
              {imageFile && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p><strong>Fichier:</strong> {imageFile.name}</p>
                  <p><strong>Taille:</strong> {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}

              {/* Option URL alternative */}
              <div className="border-t pt-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Ou entrez une URL d'image :
                </label>
                <input
                  type="url"
                  name="image"
                  value={salle.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/owner/salles')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
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

export default EditSalle;
