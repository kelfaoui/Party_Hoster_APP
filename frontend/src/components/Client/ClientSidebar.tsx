import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaDoorOpen, 
  FaUsers,
  FaSignOutAlt 
} from 'react-icons/fa';

const ClientSidebar = () => {
  const location = useLocation();

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

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-r from-slate-400 to-slate-600 text-whit rounded-3xl">
      {/* Logo */}
      <div className="flex items-center justify-center h-16">
        <div className="text-xl font-bold text-white">
        <Link to="/" className="flex items-center space-x-2">
            
            <span className="text-2xl font-bold text-secondary">
            <img src="/logo-2.svg" width="164px" className="logo-white" />
            </span>
          </Link>
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
                    : 'text-white hover:bg-slate-500 hover:text-white'
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

export default ClientSidebar;