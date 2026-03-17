import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaDoorOpen, 
  FaUsers,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';

const ClientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/client',
      icon: <FaTachometerAlt className="w-5 h-5" />,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/client/reservations',
      icon: <FaCalendarAlt className="w-5 h-5" />,
      label: 'Réservations'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full lg:w-64 bg-gradient-to-r from-slate-400 to-slate-600 text-white lg:block transform transition-transform duration-300 ease-in-out">
      {/* Close button for mobile */}
      <button className="lg:hidden absolute top-4 right-4 p-2 text-white hover:bg-slate-500 rounded-lg">
        <FaTimes className="w-5 h-5" />
      </button>
      
      {/* Logo */}
      <div className="flex items-center justify-center h-16">
        <div className="text-xl font-bold text-white">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-secondary">
              <img src="/logo-2.svg" width="164px" className="logo-white" />
            </span>
          </Link>
        </div>
      </div>

      {/* Menu */}
      <nav className="mt-8">
        <ul className="space-y-2 px-4 lg:px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={`
                  flex items-center justify-center lg:justify-start space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path, item.exact) 
                    ? 'bg-primary text-white' 
                    : 'text-white hover:bg-slate-500 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium text-center lg:text-left">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button for mobile */}
      <div className="lg:hidden px-4 mt-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-white hover:bg-red-500 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>

      {/* Footer de la sidebar */}
      <div className="absolute bottom-0 w-full p-4">
        <div className="flex items-center justify-center lg:justify-between bg-white rounded-3xl py-2">
          <div className="text-sm text-green-600 mx-auto">
            © 2026 Party Hoster
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;