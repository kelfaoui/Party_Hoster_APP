import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import Header from '../Header';
import Footer from '../Footer';
import api from '../../api/axiosConfig';

const ClientLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          setIsClient(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Vérifier si l'utilisateur est administrateur
        if (parsedUser.type !== 'Client') {
          setIsClient(false);
          return;
        }

        // Optionnel: vérifier avec l'API
        try {
          await api.get('/utilisateurs/profile');
          setIsClient(true);
        } catch (error) {
          setIsClient(false);
        }

      } catch (error) {
        console.error('Erreur de vérification admin:', error);
        setIsClient(false);
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

  if (!isClient) {
     return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <ClientSidebar />
        <div className="ml-64 flex-1">
          <main className="p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;