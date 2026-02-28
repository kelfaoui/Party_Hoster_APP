import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaDoorOpen, 
  FaUsers,
  FaStar,
  FaComment,
  FaSignOutAlt 
} from 'react-icons/fa';

const OwnerSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/owner',
      icon: <FaTachometerAlt className="w-5 h-5" />,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/owner/reservations',
      icon: <FaCalendarAlt className="w-5 h-5" />,
      label: 'Réservations'
    },
    {
      path: '/owner/salles',
      icon: <FaDoorOpen className="w-5 h-5" />,
      label: 'Salles'
    },
    {
      path: '/owner/notations',
      icon: <FaStar className="w-5 h-5" />,
      label: 'Notations'
    },
    {
      path: '/owner/commentaires',
      icon: <FaComment className="w-5 h-5" />,
      label: 'Commentaires'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-r from-green-400 to-green-600 text-whit rounded-3xl ">
      {/* Logo */}
      <div className="flex items-center justify-center h-16  border-green-700">
        <div className="text-xl font-bold text-white">
          <div className="flex items-center space-x-2">
            
            <span className="text-2xl font-bold text-secondary">
            <img src="/logo-2.svg" width="164px" className="logo-white" />
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path, item.exact) 
                    ? 'bg-primary text-white' 
                    : 'text-white hover:bg-green-500 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer de la sidebar */}
      <div className="absolute bottom-0 w-full p-4">
        <div className="flex items-center justify-between bg-white rounded-3xl py-2">
          <div className="text-sm text-green-600 mx-auto">
            © 2026 Party Hoster
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSidebar;