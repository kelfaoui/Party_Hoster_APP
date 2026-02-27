import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaMapMarkerAlt, 
  FaStar, 
  FaRegStar, 
  FaArrowLeft,
  FaCheck,
  FaCalendar,
  FaShareAlt,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/axiosConfig';
import ReservationModal from '../components/ReservationModal';

const SalleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [salle, setSalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moyenne, setMoyenne] = useState(0);
  const [commentaires, setCommentaires] = useState([]);
  const [notations, setNotations] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationError, setReservationError] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState('');
  const [reservationLoading, setReservationLoading] = useState(false);

  // États pour l'ajout de commentaire et notation
  const [showAddComment, setShowAddComment] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [userNotation, setUserNotation] = useState(null);
  const [userComment, setUserComment] = useState(null);

  useEffect(() => {
    const fetchSalleData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails de la salle
        const [salleResponse, commentairesResponse, notationsResponse] = await Promise.all([
          api.get(`/salles/${id}`),
          api.get(`/commentaires/salle/${id}`),
          api.get(`/notations/salle/${id}`)
        ]);
  
        setSalle(salleResponse.data);
        
        // Gestion des différents formats de réponse
        const commentairesData = commentairesResponse.data.commentaires || 
                                commentairesResponse.data || 
                                [];
        const notationsData = notationsResponse.data.notations || 
                             notationsResponse.data || 
                             [];
        
        setCommentaires(commentairesData);
        setNotations(notationsData);
        setMoyenne(notationsResponse.data.moyenne || 0);
  
        // Vérifier si l'utilisateur a déjà noté ou commenté
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (token && user) {
          try {
            // Vérifier la notation de l'utilisateur
            const userNotationResponse = await api.get(`/notations/ma-notation/${id}`);
            setUserNotation(userNotationResponse.data);
            
            // Vérifier si l'utilisateur a un commentaire
            // Corrigez ici : vérifiez correctement le format
            const userComment = Array.isArray(commentairesData) 
              ? commentairesData.find(comment => 
                  comment.utilisateur_id === user.utilisateur_id
                )
              : null;
            
            console.log('Commentaires trouvés:', commentairesData);
            console.log('Utilisateur actuel:', user.utilisateur_id);
            console.log('Commentaire utilisateur trouvé:', userComment);
            
            setUserComment(userComment || null);
            
          } catch (error) {
            // L'utilisateur n'a pas encore noté ou commenté
            console.log('Utilisateur pas encore noté ou commenté:', error.message);
            setUserNotation(null);
            setUserComment(null);
          }
        } else {
          setUserNotation(null);
          setUserComment(null);
        }
  
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les détails de la salle');
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchSalleData();
    }
  }, [id]);

  // Fonction pour rendre les étoiles
  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
          onClick={() => interactive && onStarClick && onStarClick(i)}
          disabled={!interactive}
        >
          {i <= rating ? <FaStar /> : <FaRegStar />}
        </button>
      );
    }
    return stars;
  };

  // Fonction pour formater les équipements
  const parseEquipements = () => {
    if (!salle?.equipements) return [];
    try {
      if (typeof salle.equipements === 'string') {
        return salle.equipements.split(',').map(e => e.trim());
      }
      return salle.equipements;
    } catch {
      return [];
    }
  };

  // Calculer les statistiques
  const calculateStatistics = () => {
    if (notations.length === 0) return null;
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    notations.forEach(notation => {
      if (notation.note >= 1 && notation.note <= 5) {
        distribution[notation.note]++;
      }
    });

    return {
      total: notations.length,
      distribution,
      percentage: (rating) => (distribution[rating] / notations.length) * 100
    };
  };

  const stats = calculateStatistics();

  // Gérer la soumission d'un commentaire
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setCommentError('Le commentaire ne peut pas être vide');
      return;
    }

    if (rating === 0) {
      setCommentError('Veuillez donner une note');
      return;
    }

    setCommentLoading(true);
    setCommentError('');

    try {
      // Soumettre d'abord la notation
      await api.post('/notations', {
        salle_id: id,
        note: rating
      });

      // Puis le commentaire
      const response = await api.post('/commentaires', {
        salle_id: id,
        commentaire: newComment.trim()
      });

      // Mettre à jour les données
      const [updatedCommentaires, updatedNotations] = await Promise.all([
        api.get(`/commentaires/salle/${id}`),
        api.get(`/notations/salle/${id}`)
      ]);

      setCommentaires(updatedCommentaires.data.commentaires || updatedCommentaires.data);
      setNotations(updatedNotations.data.notations || updatedNotations.data);
      setMoyenne(updatedNotations.data.moyenne || 0);
      setUserNotation({ note: rating });
      setUserComment(response.data);

      // Réinitialiser le formulaire
      setNewComment('');
      setRating(0);
      setShowAddComment(false);

    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      setCommentError(error.response?.data?.message || 'Erreur lors de l\'ajout du commentaire');
    } finally {
      setCommentLoading(false);
    }
  };

  // Gérer la suppression d'un commentaire
  const handleDeleteComment = async (commentaireId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await api.delete(`/commentaires/${commentaireId}`);
      
      // Mettre à jour la liste des commentaires
      const response = await api.get(`/commentaires/salle/${id}`);
      setCommentaires(response.data.commentaires || response.data);
      setUserComment(null);

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du commentaire');
    }
  };

  // Gérer la mise à jour d'une notation
  const handleUpdateRating = async (newRating) => {
    try {
      await api.post('/notations', {
        salle_id: id,
        note: newRating
      });

      // Mettre à jour les données
      const [updatedCommentaires, updatedNotations] = await Promise.all([
        api.get(`/commentaires/salle/${id}`),
        api.get(`/notations/salle/${id}`)
      ]);

      setCommentaires(updatedCommentaires.data.commentaires || updatedCommentaires.data);
      setNotations(updatedNotations.data.notations || updatedNotations.data);
      setMoyenne(updatedNotations.data.moyenne || 0);
      setUserNotation({ note: newRating });

    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
    }
  };

  // Gérer la réservation
  const handleReservationSubmit = async (reservationData) => {
    setReservationLoading(true);
    setReservationError('');
    setReservationSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReservationError('Veuillez vous connecter pour effectuer une réservation');
        setReservationLoading(false);
        return;
      }

      // Formater les dates pour MySQL
      const heure_debut_mysql = `${reservationData.date} ${reservationData.heure_debut}:00`;
      const heure_fin_mysql = `${reservationData.date} ${reservationData.heure_fin}:00`;

      // Calculer le prix
      const dateDebut = new Date(`${reservationData.date}T${reservationData.heure_debut}`);
      const dateFin = new Date(`${reservationData.date}T${reservationData.heure_fin}`);
      const dureeHeures = (dateFin - dateDebut) / (1000 * 60 * 60);
      const prixTotal = (dureeHeures * parseFloat(salle.prix_par_heure)).toFixed(2);

      const reservationPayload = {
        salle_id: id,
        heure_debut: heure_debut_mysql,
        heure_fin: heure_fin_mysql,
        prix_total: prixTotal
      };

      await api.post('/reservations', reservationPayload);
      
      setReservationSuccess('Réservation effectuée avec succès!');
      
      setTimeout(() => {
        setShowReservationModal(false);
        setReservationSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Erreur de réservation:', error);
      setReservationError(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setReservationLoading(false);
    }
  };

  // Vérifier si l'utilisateur est connecté
  const isUserLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  // Si en chargement
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si erreur
  if (error || !salle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container-custom py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Salle non trouvée'}</h2>
            <button
              onClick={() => navigate('/salles')}
              className="btn-primary inline-flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Retour aux salles
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const equipements = parseEquipements();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Bouton retour */}
      <div className="container-custom py-4">
        <button
          onClick={() => navigate('/salles')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Retour aux salles
        </button>
      </div>

      <main className="flex-grow">
        {/* Section principale */}
        <div className="container-custom">
          {/* Galerie d'images */}
          <div className="mb-8">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={"http://localhost:5000" + salle.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}
                alt={salle.nom}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne gauche - Informations principales */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                {/* Titre et prix */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{salle.nom}</h1>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{salle.localisation}</span>
                      </div>
                      <div className="flex items-center">
                        {renderStars(Math.round(moyenne))}
                        <span className="ml-2 text-gray-700 font-medium">
                          {moyenne.toFixed(1)} ({notations.length || 0} avis)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {parseFloat(salle.prix_par_heure).toLocaleString()} €
                    </div>
                    <div className="text-gray-600">par heure</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {salle.description || 'Aucune description disponible.'}
                  </p>
                </div>

                {/* Caractéristiques */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Caractéristiques</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaUsers className="text-primary text-xl" />
                      <div>
                        <div className="font-medium text-gray-800">Capacité</div>
                        <div className="text-gray-600">{salle.capacite} personnes</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaMapMarkerAlt className="text-primary text-xl" />
                      <div>
                        <div className="font-medium text-gray-800">Surface</div>
                        <div className="text-gray-600">À préciser</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaCalendar className="text-primary text-xl" />
                      <div>
                        <div className="font-medium text-gray-800">Type</div>
                        <div className="text-gray-600">Salle de réunion</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Équipements */}
                {equipements.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Équipements inclus</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {equipements.map((equipement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <FaCheck className="text-green-500" />
                          <span className="text-gray-700">{equipement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avis et notes */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Avis des clients</h2>
                    {isUserLoggedIn() && !userComment && (
                      <button
                        onClick={() => setShowAddComment(true)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        <FaEdit className="mr-2 inline" />
                        Ajouter un avis
                      </button>
                    )}
                  </div>
                  
                  {/* Votre notation */}
                  {isUserLoggedIn() && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-3">Votre évaluation</h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="mr-3 text-gray-700">Votre note:</span>
                          <div className="flex space-x-1">
                            {renderStars(userNotation?.note || 0, true, handleUpdateRating)}
                          </div>
                          <span className="ml-2 text-gray-700">
                            {userNotation?.note ? `${userNotation.note}/5` : 'Pas encore noté'}
                          </span>
                        </div>
                        {userComment && (
                          <button
                            onClick={() => handleDeleteComment(userComment.commentaire_id)}
                            className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Formulaire d'ajout de commentaire */}
                  {showAddComment && isUserLoggedIn() && !userComment && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-4">Ajouter votre avis</h3>
                      <form onSubmit={handleSubmitComment}>
                        {commentError && (
                          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                            {commentError}
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Votre note
                          </label>
                          <div className="flex space-x-2 mb-4">
                            {renderStars(rating, true, setRating)}
                          </div>
                          <span className="text-gray-600">
                            {rating > 0 ? `${rating}/5` : 'Sélectionnez une note'}
                          </span>
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Votre commentaire
                          </label>
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Partagez votre expérience avec cette salle..."
                            required
                          />
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowAddComment(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            disabled={commentLoading || rating === 0 || !newComment.trim()}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 bg-blue-600"
                          >
                            {commentLoading ? 'Envoi...' : 'Publier mon avis'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {stats ? (
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="text-5xl font-bold mr-6">{moyenne.toFixed(1)}</div>
                        <div>
                          <div className="flex mb-1">{renderStars(Math.round(moyenne))}</div>
                          <div className="text-gray-600">{stats.total} avis</div>
                        </div>
                      </div>
                      
                      {/* Distribution des notes */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center">
                            <div className="w-12 text-sm text-gray-600">{rating} étoiles</div>
                            <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-xl overflow-hidden">
                              <div 
                                className="h-full bg-yellow-500 rounded-xl"
                                style={{ width: `${stats.percentage(rating)}%` }}
                              />
                            </div>
                            <div className="w-12 text-sm text-gray-600 text-right">
                              {stats.distribution[rating]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-4">Aucun avis pour le moment.</p>
                  )}

                  {/* Liste des commentaires */}
                  {commentaires.length > 0 ? (
                    <div className="space-y-6">
                      {commentaires.map((commentaire) => {
                        const isCurrentUserComment = commentaire.utilisateur_id === 
                          JSON.parse(localStorage.getItem('user'))?.utilisateur_id;
                        
                        return (
                          <div key={commentaire.commentaire_id} className="border-b pb-6 last:border-0">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="font-bold text-gray-800">
                                  {commentaire.nom} {commentaire.prenom}
                                  {isCurrentUserComment && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      Vous
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center mt-1">
                                  {renderStars(commentaire.note || 0)}
                                  <span className="ml-2 text-sm text-gray-500">
                                    {new Date(commentaire.date_creation).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                              </div>
                              {isCurrentUserComment && (
                                <button
                                  onClick={() => handleDeleteComment(commentaire.commentaire_id)}
                                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                                  title="Supprimer mon commentaire"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                            <p className="text-gray-700">{commentaire.commentaire}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : !showAddComment ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-4">Soyez le premier à laisser un commentaire !</p>
                      {isUserLoggedIn() ? (
                        <button
                          onClick={() => setShowAddComment(true)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                          Écrire un commentaire
                        </button>
                      ) : (
                        <p className="text-sm">Connectez-vous pour laisser un avis</p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Colonne droite - Réservation et contact */}
            <div className="space-y-8">
              {/* Carte de réservation */}
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Réserver cette salle</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {parseFloat(salle.prix_par_heure).toLocaleString()} €
                    </div>
                    <div className="text-gray-600">par heure</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Capacité maximale</span>
                      <span className="font-medium">{salle.capacite} personnes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Équipements inclus</span>
                      <span className="font-medium">{equipements.length}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReservationModal(true)}
                    className="w-full btn-primary py-4 text-lg bg-blue-800 text-white rounded-xl"
                  >
                    <FaCalendar className="mr-2 inline" />
                    Réserver maintenant
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    Annulation gratuite jusqu'à 24h avant
                  </div>
                </div>
              </div>

              {/* Carte de contact */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <FaMapMarkerAlt className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Localisation</div>
                      <div className="text-gray-600">{salle.localisation}</div>
                    </div>
                  </div>

                  <button className="w-full btn-outline py-3">
                    <FaShareAlt className="mr-2 inline" />
                    Partager cette salle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de réservation */}
      <ReservationModal
        salle={salle}
        isOpen={showReservationModal}
        onClose={() => {
          setShowReservationModal(false);
          setReservationError('');
          setReservationSuccess('');
        }}
        onSubmit={handleReservationSubmit}
        loading={reservationLoading}
        error={reservationError}
        success={reservationSuccess}
      />

      <Footer />
    </div>
  );
};

export default SalleDetail;