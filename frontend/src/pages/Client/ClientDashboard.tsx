import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaDoorOpen, 
  FaUsers, 
  FaMoneyBillWave,
  FaChartLine,
  FaArrowUp,
  FaArrowDown 
} from 'react-icons/fa';
import api from '../../api/axiosConfig';

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalSalles: 0,
    totalUtilisateurs: 0,
    revenueTotal: 0,
    reservationsThisMonth: 0,
    newUsersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentReservations, setRecentReservations] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les statistiques
        const [reservationsRes, sallesRes] = await Promise.all([
          api.get('/reservations/mes-reservations?limit=1000'),
          api.get('/salles/mes-salles?limit=1000')
        ]);

        const reservations = reservationsRes.data.data || reservationsRes.data;
        const salles = sallesRes.data.data || sallesRes.data;
        

        // Calculer les statistiques
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const reservationsThisMonth = reservations.filter((res: any) => {
          const resDate = new Date(res.date_creation || res.created_at);
          return resDate.getMonth() === thisMonth && resDate.getFullYear() === thisYear;
        });

    

        const revenueTotal = reservations.reduce((sum: number, res: any) => {
          return sum + parseFloat(res.prix_total || 0);
        }, 0);

        setStats({
          totalReservations: reservations.length,
          totalSalles: salles.length,
          totalUtilisateurs: 0,
          revenueTotal,
          reservationsThisMonth: reservationsThisMonth.length,
          newUsersThisMonth: 0
        });

        // Récupérer les réservations récentes
        const recentRes = reservations
          .sort((a: any, b: any) => new Date(b.date_creation || b.created_at).getTime() - new Date(a.date_creation || a.created_at).getTime())
          .slice(0, 5);
        setRecentReservations(recentRes);

      } catch (error) {
        console.error('Erreur dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewReservationDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowReservationModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirme': return 'bg-green-100 text-green-800';
      case 'EnAttente': return 'bg-yellow-100 text-yellow-800';
      case 'Annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = [
    {
      title: 'Total Réservations',
      value: stats.totalReservations,
      icon: <FaCalendarAlt className="text-blue-500" />,
      change: '+12%',
      trend: 'up',
      color: 'bg-blue-50'
    },
    {
      title: 'Total Salles',
      value: stats.totalSalles,
      icon: <FaDoorOpen className="text-green-500" />,
      change: '+5%',
      trend: 'up',
      color: 'bg-green-50'
    },
    {
      title: 'Dépenses totales',
      value: `${stats.revenueTotal.toLocaleString()} €`,
      icon: <FaMoneyBillWave className="text-yellow-500" />,
      change: '+15%',
      trend: 'up',
      color: 'bg-yellow-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-xl h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord</h1>
        <p className="text-gray-600">Bienvenue dans le panel d'administration</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl p-6 shadow-sm`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <FaArrowUp className="text-green-500 mr-1" />
                  ) : (
                    <FaArrowDown className="text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} ce mois
                  </span>
                </div>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Réservations récentes */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Vos Réservations</h2>
            <button 
              onClick={() => window.location.href = '/client/reservations'}
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4">
            {recentReservations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                <p>Vous n'avez pas encore de réservations</p>
                <button 
                  onClick={() => window.location.href = '/salles'}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Réserver une salle
                </button>
              </div>
            ) : (
              recentReservations.map((reservation: any) => (
                <div 
                  key={reservation.reservation_id} 
                  className="p-4 hover:bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                  onClick={() => handleViewReservationDetails(reservation)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-gray-800 flex items-center">
                        <FaDoorOpen className="mr-2 text-gray-400" />
                        {reservation.salle_nom || 'Salle non spécifiée'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Réservation #{reservation.reservation_id}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">
                        {parseFloat(reservation.prix_total || 0).toLocaleString()} €
                      </div>
                      <span className={`px-2 py-1 rounded-xl text-xs font-medium ${getStatusColor(reservation.statut)}`}>
                        {reservation.statut}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <div>
                      <div>{new Date(reservation.heure_debut).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(reservation.heure_debut).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(reservation.heure_fin).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Aperçu du Mois</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 border border-gray-300 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.reservationsThisMonth}
            </div>
            <div className="text-gray-600">Réservations ce mois</div>
          </div>
          <div className="text-center p-4 border border-gray-300 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(stats.revenueTotal / 1000)}K
            </div>
            <div className="text-gray-600">Dépenses (en milliers)</div>
          </div>
        </div>
      </div>

      {/* Modal des détails de réservation */}
      {showReservationModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Détails de la Réservation</h2>
              <button
                onClick={() => setShowReservationModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Numéro de réservation</h3>
                    <p className="text-lg font-semibold text-gray-800">#{selectedReservation.reservation_id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Salle</h3>
                    <p className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaDoorOpen className="mr-2 text-gray-400" />
                      {selectedReservation.salle_nom || 'Salle non spécifiée'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Statut</h3>
                    <span className={`px-3 py-1 rounded-xl text-sm font-medium ${getStatusColor(selectedReservation.statut)}`}>
                      {selectedReservation.statut}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Date de réservation</h3>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(selectedReservation.heure_debut).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Horaires</h3>
                    <p className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {new Date(selectedReservation.heure_debut).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(selectedReservation.heure_fin).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Prix total</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {parseFloat(selectedReservation.prix_total || 0).toLocaleString()} €
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations complémentaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Durée de la réservation</h4>
                    <p className="text-gray-800">
                      {Math.round((new Date(selectedReservation.heure_fin).getTime() - new Date(selectedReservation.heure_debut).getTime()) / (1000 * 60 * 60) * 10) / 10} heures
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Date de création</h4>
                    <p className="text-gray-800">
                      {new Date(selectedReservation.date_creation || selectedReservation.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;