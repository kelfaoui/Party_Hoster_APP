import React, { useState } from 'react';
import { FaCalendar, FaClock, FaUsers, FaTimes } from 'react-icons/fa';

const ReservationModal = ({ 
  salle, 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  error, 
  success 
}) => {
  const [reservationData, setReservationData] = useState({
    date: '',
    heure_debut: '',
    heure_fin: '',
    nombre_personnes: salle?.capacite || 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reservationData);
  };

  // Calculer la date minimale (aujourd'hui)
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calculer la date maximale (6 mois)
  const getMaxDate = () => {
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    return sixMonthsLater.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête de la modale */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Réserver cette salle</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          {/* Informations sur la salle */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src={'/' + salle?.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
                alt={salle?.nom}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{salle?.nom}</h4>
              <p className="text-gray-600 text-sm mb-2">
                {salle?.localisation || 'Localisation non spécifiée'}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center text-gray-600">
                  <FaUsers className="mr-1" />
                  {salle?.capacite} pers.
                </span>
                <span className="text-primary font-bold">
                  {salle?.prix_par_heure} €/h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corps de la modale */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Date */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <FaCalendar className="mr-2" />
                Date de réservation
              </label>
              <input
                type="date"
                name="date"
                value={reservationData.date}
                onChange={handleInputChange}
                min={getTodayDate()}
                max={getMaxDate()}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Heures */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <FaClock className="mr-2" />
                  Heure de début
                </label>
                <input
                  type="time"
                  name="heure_debut"
                  value={reservationData.heure_debut}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <FaClock className="mr-2" />
                  Heure de fin
                </label>
                <input
                  type="time"
                  name="heure_fin"
                  value={reservationData.heure_fin}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Nombre de personnes */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">
                Nombre de personnes
              </label>
              <input
                type="range"
                name="nombre_personnes"
                min="1"
                max={salle?.capacite}
                value={reservationData.nombre_personnes}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-2"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">1 personne</span>
                <span className="text-lg font-bold text-primary">
                  {reservationData.nombre_personnes} personnes
                </span>
                <span className="text-sm text-gray-600">{salle?.capacite} personnes max</span>
              </div>
            </div>

            {/* Calcul du prix */}
            {reservationData.date && reservationData.heure_debut && reservationData.heure_fin && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Récapitulatif</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée estimée:</span>
                    <span className="font-medium">
                      {(() => {
                        const dateDebut = new Date(`${reservationData.date}T${reservationData.heure_debut}`);
                        let dateFin = new Date(`${reservationData.date}T${reservationData.heure_fin}`);
                        
                        // Si l'heure de fin est antérieure à l'heure de début, ajouter 24h à l'heure de fin
                        if (dateFin <= dateDebut) {
                          dateFin.setDate(dateFin.getDate() + 1);
                        }
                        
                        const dureeHeures = (dateFin - dateDebut) / (1000 * 60 * 60);
                        return `${dureeHeures} heure${dureeHeures > 1 ? 's' : ''}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarif horaire:</span>
                    <span className="font-medium">{salle?.prix_par_heure} €/h</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2">
                    <span className="text-gray-800 font-bold">Prix total estimé:</span>
                    <span className="text-primary font-bold text-xl">
                      {(() => {
                        const dateDebut = new Date(`${reservationData.date}T${reservationData.heure_debut}`);
                        let dateFin = new Date(`${reservationData.date}T${reservationData.heure_fin}`);
                        
                        // Si l'heure de fin est antérieure à l'heure de début, ajouter 24h à l'heure de fin
                        if (dateFin <= dateDebut) {
                          dateFin.setDate(dateFin.getDate() + 1);
                        }
                        
                        const dureeHeures = (dateFin - dateDebut) / (1000 * 60 * 60);
                        const prixTotal = dureeHeures * parseFloat(salle?.prix_par_heure || 0);
                        return `${prixTotal.toLocaleString()} €`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-xl h-5 w-5 border-b-2 border-white mr-2"></div>
                    Traitement...
                  </span>
                ) : (
                  'Confirmer la réservation'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Pied de la modale */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Après confirmation, vous recevrez un email avec les détails de votre réservation.
            Vous pourrez annuler votre réservation jusqu'à 24h avant la date prévue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;