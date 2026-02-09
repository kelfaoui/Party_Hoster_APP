import React, { useState } from 'react';
import { FaUsers, FaMapMarkerAlt, FaStar, FaRegStar } from 'react-icons/fa';
import type { Salle } from '../types/salle';

interface SalleCardProps {
  salle: Salle;
}

const SalleCard = ({ salle }: SalleCardProps): React.ReactElement => {
  const [moyenne] = useState<number>(4.5);

  const renderStars = (): React.ReactNode[] => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(moyenne);
    const hasHalfStar = moyenne % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            salle.image ||
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
          alt={salle.nom}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-xl">
          {salle.prix_par_heure} €/h
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{salle.nom}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {salle.description || 'Salle professionnelle équipée pour vos réunions et événements'}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <FaUsers className="mr-2" />
              <span>{salle.capacite} personnes</span>
            </div>
            {salle.localisation && (
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span className="truncate max-w-[150px]">{salle.localisation}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {renderStars()}
            <span className="ml-2 text-gray-700 font-medium">{moyenne.toFixed(1)}/5</span>
          </div>
        </div>
        <div className="mt-auto flex gap-3">
          <button
            type="button"
            className="inline-block text-center w-1/2 px-4 py-2 border border-red-600 text-red-600 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Voir détails
          </button>
          <button
            type="button"
            className="w-1/2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalleCard;
