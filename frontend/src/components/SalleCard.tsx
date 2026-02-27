import React, { useState, useEffect } from 'react';
import { FaUsers, FaMapMarkerAlt, FaStar, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ReservationModal from './ReservationModal'; // Importez le composant modal

const SalleCard = ({ salle }) => {
  const [moyenne, setMoyenne] = useState(0);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchMoyenne = async () => {
      try {
        const response = await api.get(`/notations/salle/${salle.salle_id}`);
        setMoyenne(response.data.moyenne);
      } catch (error) {
        console.error('Erreur lors de la récupération de la moyenne:', error);
      }
    };

    fetchMoyenne();
  }, [salle.salle_id]);

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(moyenne);
    const hasHalfStar = moyenne % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleReservationSubmit = async (reservationData) => {
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Veuillez vous connecter pour effectuer une réservation');
        setLoading(false);
        return;
      }
  
      // Convertir les dates au format MySQL (YYYY-MM-DD HH:MM:SS)
      const dateDebut = new Date(`${reservationData.date}T${reservationData.heure_debut}`);
      const dateFin = new Date(`${reservationData.date}T${reservationData.heure_fin}`);
  
      // Vérifier que l'heure de fin est après l'heure de début
      if (dateFin <= dateDebut) {
        setError('L\'heure de fin doit être après l\'heure de début');
        setLoading(false);
        return;
      }
  
      // Formater pour MySQL (sans le Z et sans le T)
      const heure_debut_mysql = `${reservationData.date} ${reservationData.heure_debut}:00`;
      const heure_fin_mysql = `${reservationData.date} ${reservationData.heure_fin}:00`;
  
      // Calculer le prix total
      const dureeHeures = (dateFin - dateDebut) / (1000 * 60 * 60);
      const prixTotal = (dureeHeures * parseFloat(salle.prix_par_heure)).toFixed(2);
  
      const reservationPayload = {
        salle_id: salle.salle_id,
        heure_debut: heure_debut_mysql,
        heure_fin: heure_fin_mysql,
        prix_total: prixTotal
      };
  
      console.log('Payload envoyé:', reservationPayload);
  
      const response = await api.post('/reservations', reservationPayload);
      
      setSuccess('Réservation effectuée avec succès!');
      
      setTimeout(() => {
        setShowReservationModal(false);
        setSuccess('');
      }, 2000);
  
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={'http://localhost:5000' + salle.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={salle.nom}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-xl">
          {salle.prix_par_heure} €/h
        </div>
      </div>
  
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{salle.nom}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {salle.description || 'Salle professionnelle équipée pour vos réunions et événements'}
        </p>
  
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <FaUsers className="mr-2" />
              <span>{salle.capacite} personnes</span>
            </div>
            {salle.localisation && (
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span className="truncate max-w-[150px]">{salle.localisation}</span>
              </div>
            )}
          </div>
        </div>
  
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {renderStars()}
            <span className="ml-2 text-gray-700 font-medium">
              {moyenne.toFixed(1)}/5
            </span>
          </div>
        </div>
  
        <div className="mt-auto flex gap-3">
          <Link
            to={`/salles/${salle.salle_id}`}
            className="inline-block text-center w-1/2 px-4 py-2 border border-red-600 text-red-600 rounded-xl hover:bg-blue-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Voir détails
          </Link>
          
          <button
            onClick={() => setShowReservationModal(true)}
            className="w-1/2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  
    {/* Utilisez le composant modal réutilisable */}
    <ReservationModal
      salle={salle}
      isOpen={showReservationModal}
      onClose={() => {
        setShowReservationModal(false);
        setError('');
        setSuccess('');
      }}
      onSubmit={handleReservationSubmit}
      loading={loading}
      error={error}
      success={success}
    />
  </>
  );
};

export default SalleCard;