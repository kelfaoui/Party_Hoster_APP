import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import api from '../../api/axiosConfig';

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          setIsAdmin(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Vérifier si l'utilisateur est administrateur
        if (parsedUser.type !== 'Administrateur') {
          setIsAdmin(false);
          return;
        }

        // Optionnel: vérifier avec l'API
        try {
          await api.get('/utilisateurs/profile');
          setIsAdmin(true);
        } catch (error) {
          setIsAdmin(false);
        }

      } catch (error) {
        console.error('Erreur de vérification admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
     return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar />
      <div className="ml-64">
        <AdminHeader user={user} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;