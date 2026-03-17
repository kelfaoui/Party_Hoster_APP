import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import OwnerSidebar from './OwnerSidebar';
import OwnerHeader from './OwnerHeader';
import api from '../../api/axiosConfig';

const OwnerLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Fermer le sidebar quand la route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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

        // Vérifier si l'utilisateur est propriétaire
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
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <OwnerSidebar />
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
            <OwnerSidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <OwnerHeader user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;