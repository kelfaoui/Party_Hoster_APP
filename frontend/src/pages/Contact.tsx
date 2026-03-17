import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      console.log('Données du formulaire:', formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: '',
      });

      // Réinitialiser après 5 secondes
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-400 to-blue-800 py-12 lg:py-20">
          <div className="container-custom px-4 text-center text-white">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">Contactez-Nous</h1>
            <p className="text-lg lg:text-xl max-w-3xl mx-auto">
              Une question ? Un projet ? Notre équipe est à votre écoute pour vous accompagner.
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-12 lg:py-20 bg-white mb-2">
          <div className="container-custom px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Informations de contact */}
              <div className="p-4 lg:p-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 lg:mb-8">
                  Nos Coordonnées
                </h2>

                <div className="space-y-6 lg:space-y-8">
                  <div className="flex items-start space-x-4">
                    <FaMapMarkerAlt className="text-primary text-xl lg:text-2xl mt-1" />
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">Adresse</h3>
                      <p className="text-gray-600 text-sm lg:text-base">
                        24 Avenue Foch, Paris<br />
                        
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-2">
                    <FaPhone className="text-primary text-xl lg:text-2xl mb-2" />
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">Téléphone</h3>
                      <p className="text-gray-600 text-sm lg:text-base">06 56 25 34 88</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FaEnvelope className="text-primary text-xl lg:text-2xl" />
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">Email</h3>
                      <p className="text-gray-600 text-sm lg:text-base">contact@partyhoster.fr</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FaClock className="text-primary text-xl lg:text-2xl" />
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">Horaires</h3>
                      <p className="text-gray-600 text-sm lg:text-base">
                        24h/24 - 7jours/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire de contact */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 lg:mb-8">
                  Envoyez-nous un Message
                </h2>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 lg:p-8 text-center">
                    <FaCheckCircle className="text-green-500 text-4xl lg:text-5xl mx-auto mb-4 lg:mb-6" />
                    <h3 className="text-xl lg:text-2xl font-bold text-green-800 mb-4">
                      Message envoyé avec succès !
                    </h3>
                    <p className="text-green-700 text-sm lg:text-base">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm lg:text-base">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm lg:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm lg:text-base">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm lg:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm lg:text-base">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm lg:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm lg:text-base">
                          Sujet *
                        </label>
                        <select
                          name="sujet"
                          value={formData.sujet}
                          onChange={handleChange}
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm lg:text-base"
                          required
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="reservation">Réservation</option>
                          <option value="information">Demande d'information</option>
                          <option value="support">Support technique</option>
                          <option value="partenariat">Partenariat</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm lg:text-base">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4 lg:rows-6"
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm lg:text-base"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 lg:py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base lg:text-lg"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-xl h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-white mr-3"></div>
                          Envoi en cours...
                        </span>
                      ) : (
                        'Envoyer le message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 lg:py-20 bg-gray-50">
          <div className="container-custom px-4">
            <h2 className="text-2xl lg:text-4xl font-bold text-center text-gray-800 mb-8 lg:mb-12">
              Questions Fréquentes
            </h2>

            <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
              {[
                {
                  question: "Comment réserver une salle ?",
                  answer: "Créez un compte, recherchez une salle disponible, sélectionnez vos dates et effectuez le paiement en ligne."
                },
                {
                  question: "Puis-je modifier ou annuler ma réservation ?",
                  answer: "Oui, vous pouvez modifier ou annuler votre réservation jusqu'à 24h avant le début de la location."
                },
                {
                  question: "Les équipements sont-ils inclus ?",
                  answer: "Oui, chaque salle comprend l'équipement de base (vidéoprojecteur, Wi-Fi, tableau). L'équipement spécifique est mentionné dans la description."
                },
                {
                  question: "Comment devenir propriétaire sur votre plateforme ?",
                  answer: "Inscrivez-vous en tant que propriétaire, ajoutez vos salles avec photos et descriptions, et commencez à recevoir des réservations."
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 lg:mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm lg:text-base">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;