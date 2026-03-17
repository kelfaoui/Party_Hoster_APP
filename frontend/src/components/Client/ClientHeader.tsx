import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBell, FaCog, FaBars } from 'react-icons/fa';

const ClientHeader = ({ user, onMenuClick }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-400">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Menu burger and Title */}
          <div className="flex items-center space-x-4">
            {/* Menu Burger - Mobile only */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl"
            >
              <FaBars className="w-5 h-5" />
            </button>
            
            {/* Title */}
            <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
              Mes Réservations
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl">
              <FaBell className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-xl"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl">
              <FaCog className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 lg:space-x-3 p-2 hover:bg-gray-100 rounded-lg bg-slate-50"
              >
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-primary rounded-xl flex items-center justify-center">
                  <FaUser className="text-gray-500 text-sm lg:text-base" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-medium text-gray-800 text-sm">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
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

export default ClientHeader;
