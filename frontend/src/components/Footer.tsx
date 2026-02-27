import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white px-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Logo et description */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img src="/logo-2.svg" width="164px" />
            </div>
            <p className="text-gray-400 mb-6">
              Plateforme leader de réservation de salles de réunion et d'événements 
              pour les professionnels en France.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/salles" className="text-gray-400 hover:text-primary transition-colors">
                  Salles
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/conditions" className="text-gray-400 hover:text-primary transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-xl font-bold mb-6">Informations</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/proprietaires" className="text-gray-400 hover:text-primary transition-colors">
                  Devenir propriétaire
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/carrieres" className="text-gray-400 hover:text-primary transition-colors">
                  Carrières
                </Link>
              </li>
              <li>
                <Link to="/presse" className="text-gray-400 hover:text-primary transition-colors">
                  Presse
                </Link>
              </li>
              <li>
                <Link to="/partenaires" className="text-gray-400 hover:text-primary transition-colors">
                  Partenaires
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary mt-1" />
                <span className="text-gray-400">
                  24 Avenue Foch, Paris<br />
                  
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary" />
                <span className="text-gray-400">06 56 25 34 88</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary" />
                <span className="text-gray-400">contact@partyhoster.fr</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaClock className="text-primary" />
                <span className="text-gray-400">24/24 7jours/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {currentYear} Party Housing. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <Link to="/confidentialite" className="text-gray-400 hover:text-primary">
                Confidentialité
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-primary">
                Cookies
              </Link>
              <Link to="/mentions-legales" className="text-gray-400 hover:text-primary">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;