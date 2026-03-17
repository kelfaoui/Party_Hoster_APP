import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaDoorOpen, FaTachometerAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo-2.svg" width="164px" />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {user?.type === 'Client' && (
              <>
                <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  Accueil
                </Link>
                <Link to="/carte" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  Carte
                </Link>
                <Link to="/salles" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  Salles
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  À propos
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Boutons Connexion/Inscription */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-8">
                {user.type === 'Client' && (
                  <Link
                    to="/client"
                    className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium"
                  >
                    <FaTachometerAlt className="mr-2 inline" />
                    Mes réservations
                  </Link>
                )}
                {user.type === 'Admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium"
                  >
                    <FaTachometerAlt className="mr-2 inline" />
                    Tableau de bord
                  </Link>
                )}
                {user.type === 'Owner' && (
                  <Link
                    to="/owner"
                    className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium"
                  >
                    <FaTachometerAlt className="mr-2 inline" />
                    Tableau de bord
                  </Link>
                )}
                <span className="text-gray-700 flex items-center ml-8">
                  <FaUser className="mr-2" />
                  Bonjour, {user.prenom}
                </span>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm px-4 py-2 border-1 bg-red-600 text-white rounded-xl">
                  Connexion
                </Link>
                <Link to="/register" className="btn-outline text-sm px-4 py-2 border-1 border-red-600 text-red-600 rounded-xl">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Menu Mobile Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="flex flex-col space-y-4 py-4 px-4">
              {user?.type === 'Client' && (
                <>
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-primary py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accueil
                  </Link>
                  <Link
                    to="/salles"
                    className="text-gray-700 hover:text-primary py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Salles
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-primary py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    À propos
                  </Link>
                  <Link
                    to="/contact"
                    className="text-gray-700 hover:text-primary py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              )}
              <div className="pt-4 border-t">
                {user ? (
                  <div className="space-y-4">
                    <div className="text-gray-700">
                      Connecté en tant que {user.email}
                    </div>
                    {user.type === 'Client' && (
                      <Link
                        to="/client"
                        className="btn-primary text-sm px-4 py-2 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaTachometerAlt className="mr-2" />
                        Mes réservations
                      </Link>
                    )}
                    {user.type === 'Admin' && (
                      <Link
                        to="/admin"
                        className="btn-primary text-sm px-4 py-2 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaTachometerAlt className="mr-2" />
                        Tableau de bord
                      </Link>
                    )}
                    {user.type === 'Owner' && (
                      <Link
                        to="/owner"
                        className="btn-primary text-sm px-4 py-2 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaTachometerAlt className="mr-2" />
                        Tableau de bord
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="btn-outline text-sm px-4 py-2 border-1 bg-red-600 text-white rounded-xl"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      className="btn-outline text-sm px-4 py-2 border-1 bg-red-600 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="btn-outline text-sm px-4 py-2 border-1 border-red-600 text-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;