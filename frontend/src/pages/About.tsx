import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaRocket, FaEye, FaHandshake, FaAward, FaUsers, FaChartLine } from 'react-icons/fa';

const About = () => {
  const teamMembers = [
    { name: 'Chabane KELFAOUI', role: 'CEO & Fondateur', image: '/public/chabane.jpg' },
    { name: 'Yidir Cherifi', role: 'Directeur Technique', image: '/public/cherifi.png' },
    { name: 'Djamila Zitouni', role: 'Responsable Commerciale', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Remi Lemoust', role: 'Developpeur Full-Stack', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ];

  const values = [
    { icon: <FaRocket />, title: 'Innovation', description: 'Nous repoussons constamment les limites pour améliorer votre expérience' },
    { icon: <FaEye />, title: 'Transparence', description: 'Des prix clairs et aucune surprise cachée' },
    { icon: <FaHandshake />, title: 'Confiance', description: 'Des partenariats solides avec nos propriétaires et clients' },
    { icon: <FaAward />, title: 'Excellence', description: 'Un service de qualité pour chaque réservation' },
    { icon: <FaUsers />, title: 'Communauté', description: 'Nous construisons un réseau de professionnels' },
    { icon: <FaChartLine />, title: 'Croissance', description: 'Nous grandissons ensemble avec nos partenaires' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
       <section className="bg-gradient-to-r from-blue-400 to-blue-800 py-20">
          <div className="container-custom text-center text-white">
            <h1 className="text-5xl font-bold mb-6">À propos de notre organisation</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Découvrez l'histoire derrière SallesReserve et notre mission de transformer 
              la manière dont les entreprises trouvent et réservent des espaces de travail.
            </p>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="py-20 bg-white px-4">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Notre histoire</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="text-lg">
                    Fondée en 2026, SallesReserve est née d'un constat simple : trouver 
                    la salle de réunion parfaite était souvent un parcours du combattant 
                    pour les professionnels.
                  </p>
                  <p className="text-lg">
                    Notre fondatrice, Julia Frapatelli, a passé des semaines à chercher 
                    désespérément une salle adaptée pour une réunion importante. 
                    Frustrée par le manque de transparence des prix et la difficulté 
                    à vérifier les disponibilités en temps réel, elle a décidé de 
                    créer une solution.
                  </p>
                  <p className="text-lg">
                    Aujourd'hui, nous connectons des milliers d'entreprises avec 
                    des espaces de travail de qualité à travers la France, en offrant 
                    une expérience de réservation fluide et transparente.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src="/slide1.jpg"
                  alt="Notre équipe"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notre Mission */}
        <section className="py-20 bg-gray-50 px-5">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Notre mission</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simplifier la recherche et la réservation d'espaces professionnels 
                tout en garantissant la meilleure expérience possible pour nos utilisateurs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-primary text-4xl mb-6">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* L'Équipe */}
        <section className="py-20 bg-white px-4">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Rencontrez notre équipe</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des passionnés dévoués à révolutionner l'industrie des espaces de travail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-xl mx-auto object-cover shadow-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-400 to-blue-800 py-20 px-5">
          <div className="container-custom text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Rejoignez notre aventure</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Que vous soyez propriétaire d'espaces ou entreprise à la recherche 
              de salles, participez à notre mission de transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 font-bold text-lg hover:bg-gray-100 transition-colors rounded-xl"
              >
                Devenir Client
              </a>
              <a
                href="/proprietaires"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Devenir Propriétaire
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;