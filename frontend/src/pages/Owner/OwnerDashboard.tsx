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

const OwnerDashboard = () => {
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les statistiques
        const [reservationsRes, sallesRes, usersRes] = await Promise.all([
          api.get('/reservations?limit=1000'),
          api.get('/salles?limit=1000'),
          api.get('/utilisateurs')
        ]);

        const reservations = reservationsRes.data.data || reservationsRes.data;
        const salles = sallesRes.data.data || sallesRes.data;
        const users = usersRes.data;

        // Calculer les statistiques
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const reservationsThisMonth = reservations.filter(res => {
          const resDate = new Date(res.date_creation || res.created_at);
          return resDate.getMonth() === thisMonth && resDate.getFullYear() === thisYear;
        });

        const newUsersThisMonth = users.filter(user => {
          const userDate = new Date(user.date_creation);
          return userDate.getMonth() === thisMonth && userDate.getFullYear() === thisYear;
        });

        const revenueTotal = reservations.reduce((sum, res) => {
          return sum + parseFloat(res.prix_total || 0);
        }, 0);

        setStats({
          totalReservations: reservations.length,
          totalSalles: salles.length,
          totalUtilisateurs: users.length,
          revenueTotal,
          reservationsThisMonth: reservationsThisMonth.length,
          newUsersThisMonth: newUsersThisMonth.length
        });

        // Récupérer les réservations récentes
        const recentRes = reservations
          .sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))
          .slice(0, 5);
        setRecentReservations(recentRes);

        // Récupérer les utilisateurs récents
        const recentUsrs = users
          .sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))
          .slice(0, 5);
        setRecentUsers(recentUsrs);

      } catch (error) {
        console.error('Erreur dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      title: 'Total Utilisateurs',
      value: stats.totalUtilisateurs,
      icon: <FaUsers className="text-purple-500" />,
      change: '+8%',
      trend: 'up',
      color: 'bg-purple-50'
    },
    {
      title: 'Revenu Total',
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
        <p className="text-gray-600">Bienvenue dans le panel propriétaire</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Réservations Récentes</h2>
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4">
            {recentReservations.map((reservation) => (
              <div key={reservation.reservation_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">
                    Réservation #{reservation.reservation_id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(reservation.date_creation).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-800">
                    {parseFloat(reservation.prix_total || 0).toLocaleString()} €
                  </div>
                  <span className={`px-2 py-1 rounded-xl text-xs ${
                    reservation.statut === 'Confirme' ? 'bg-green-100 text-green-800' :
                    reservation.statut === 'EnAttente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {reservation.statut}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Utilisateurs récents */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Utilisateurs Récents</h2>
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.utilisateur_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                    <FaUsers className="text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {user.prenom} {user.nom}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {new Date(user.date_creation).toLocaleDateString('fr-FR')}
                  </div>
                  <span className={`px-2 py-1 rounded-xl text-xs ${
                    user.type === 'Administrateur' ? 'bg-purple-100 text-purple-800' :
                    user.type === 'Proprietaire' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Aperçu du Mois</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-300 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.reservationsThisMonth}
            </div>
            <div className="text-gray-600">Réservations ce mois</div>
          </div>
          <div className="text-center p-4 border border-gray-300 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.newUsersThisMonth}
            </div>
            <div className="text-gray-600">Nouveaux utilisateurs</div>
          </div>
          <div className="text-center p-4 border border-gray-300 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(stats.revenueTotal / 1000)}K
            </div>
            <div className="text-gray-600">Revenu (en milliers)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;