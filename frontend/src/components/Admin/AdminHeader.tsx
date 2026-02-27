import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBell, FaCog } from 'react-icons/fa';

const AdminHeader = ({ user }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-blue-400">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-800">
              Tableau de Bord
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl">
              <FaBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-xl"></span>
            </button>

            {/* Paramètres  */}
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl">
              <FaCog className="w-5 h-5" />
            </button>

            {/* Menu flottant de l'utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg bg-blue-50"
              >
                <div className="w-6 h-6 bg-primary rounded-xl flex items-center justify-center">
                  <FaUser className="text-gray-500" />
                </div>
                <div className="text-left hidden md:block me-3">
                  <div className="font-medium text-gray-800">
                    {user?.prenom} {user?.nom}
                  </div>
                
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border-1 border-gray-200">
                    <div className="px-4 py-2 border-b">
                      <div className="font-medium text-gray-800">
                        {user?.prenom} {user?.nom}
                      </div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;