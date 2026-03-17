import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import Header from '../Header';
import Footer from '../Footer';
import api from '../../api/axiosConfig';

const ClientLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Fermer le sidebar quand la route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkClientAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          setIsClient(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Vérifier si l'utilisateur est client
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
        console.error('Erreur de vérification client:', error);
        setIsClient(false);
      } finally {
        setLoading(false);
      }
    };

    checkClientAccess();
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
    <div className="min-h-screen bg-white">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <ClientSidebar onClose={() => {}} />
      </div>
      
      {/* Sidebar Mobile (overlay) */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar Mobile */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <ClientSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <Header onSidebarMenuClick={() => setSidebarOpen(true)} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ClientLayout;