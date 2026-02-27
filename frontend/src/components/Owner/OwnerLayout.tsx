import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import OwnerSidebar from './OwnerSidebar';
import OwnerHeader from './OwnerHeader';
import api from '../../api/axiosConfig';

const OwnerLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          setIsOwner(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Vérifier si l'utilisateur est administrateur
        if (parsedUser.type !== 'Proprietaire') {
          setIsOwner(false);
          return;
        }

        // Optionnel: vérifier avec l'API
        try {
          await api.get('/utilisateurs/profile');
          setIsOwner(true);
        } catch (error) {
          setIsOwner(false);
        }

      } catch (error) {
        console.error('Erreur de vérification propriètaire:', error);
        setIsOwner(false);
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

  if (!isOwner) {
     return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <OwnerSidebar />
      <div className="ml-64">
        <OwnerHeader user={user} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;