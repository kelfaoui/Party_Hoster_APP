import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = (): React.ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4 px-4">
          <div className="flex items-center space-x-2">
            <img src="/logo-2.svg" width={164} alt="Logo" />
          </div>
          <button
            type="button"
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="flex flex-col space-y-4 py-4 px-4">
              <span className="text-gray-700 py-2">Accueil</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
