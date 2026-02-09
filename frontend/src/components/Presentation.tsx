import React from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaHeadset,
} from 'react-icons/fa';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Stat {
  number: string;
  label: string;
}

const Presentation = (): React.ReactElement => {
  const features: Feature[] = [
    {
      icon: <FaCheckCircle className="text-4xl text-primary" />,
      title: 'Réservation Facile',
      description: 'Réservez votre salle en quelques clics, 24h/24 et 7j/7',
    },
    {
      icon: <FaClock className="text-4xl text-primary" />,
      title: 'Disponibilité en Temps Réel',
      description: 'Visualisez les disponibilités instantanément',
    },
    {
      icon: <FaShieldAlt className="text-4xl text-primary" />,
      title: 'Paiement Sécurisé',
      description: 'Transactions bancaires 100% sécurisées',
    },
    {
      icon: <FaUsers className="text-4xl text-primary" />,
      title: 'Service Client',
      description: 'Une équipe dédiée pour vous accompagner',
    },
    {
      icon: <FaChartLine className="text-4xl text-primary" />,
      title: 'Optimisation des Coûts',
      description: 'Payez uniquement pour le temps utilisé',
    },
    {
      icon: <FaHeadset className="text-4xl text-primary" />,
      title: 'Support Technique',
      description: 'Assistance technique pour vos équipements',
    },
  ];

  const stats: Stat[] = [
    { number: '500+', label: 'Salles Disponibles' },
    { number: '10K+', label: 'Clients Satisfaits' },
    { number: '50+', label: 'Villes Couvertes' },
    { number: '99%', label: 'Taux de Satisfaction' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Pourquoi choisir SallesReserve ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous simplifions la recherche et la réservation de salles de réunion pour les
            professionnels, offrant une expérience fluide et des espaces de qualité.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray-600 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center bg-gradient-to-r from-red-400 to-red-600 py-20 rounded-2xl p-12">
          <h3 className="text-4xl font-bold text-white mb-6">
            Prêt à réserver votre Prochaine salle ?
          </h3>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d&apos;entreprises qui nous font déjà confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              type="button"
              className="btn-primary bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg border-2 border-white rounded-xl"
            >
              Explorer les Salles
            </button>
            <button
              type="button"
              className="btn-outline border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 border-2 text-lg rounded-xl"
            >
              Créer un Compte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Presentation;
