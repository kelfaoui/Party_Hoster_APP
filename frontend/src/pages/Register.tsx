import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../api/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    confirm_password: '',
    numero_telephone: '',
    type: 'Client',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'mot_de_passe') {
      setPasswordRequirements({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.mot_de_passe !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (!passwordRequirements.length || 
        !passwordRequirements.uppercase || 
        !passwordRequirements.lowercase ||
        !passwordRequirements.number) {
      setError('Le mot de passe ne respecte pas les exigences de sécurité');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/utilisateurs/register', {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
        numero_telephone: formData.numero_telephone,
        type: formData.type,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 bg-white">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <FaCheck className="text-green-500 text-6xl mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Inscription réussie !
              </h2>
              <p className="text-gray-600 mb-8">
                Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
              </p>
              <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-white px-5">
        <div className=" max-w-3xl mx-auto ms-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            {/* Formulaire */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Créer un compte
                </h1>
                <p className="text-gray-600">
                  Rejoignez notre communauté dès aujourd'hui
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Prénom *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="numero_telephone"
                      value={formData.numero_telephone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Type de compte
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Client', 'Proprietaire'].map((type) => (
                      <div key={type} className="relative">
                        <input
                          type="radio"
                          id={type}
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={handleChange}
                          className="hidden peer"
                        />
                        <label
                          htmlFor={type}
                          className="block p-4 border-2 border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 transition-colors"
                        >
                          {type === 'Client' ? 'Client' : 'Propriétaire'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="mot_de_passe"
                      value={formData.mot_de_passe}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Exigences mot de passe */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Exigences du mot de passe :
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { key: 'length', text: 'Au moins 8 caractères' },
                      { key: 'uppercase', text: 'Une lettre majuscule' },
                      { key: 'lowercase', text: 'Une lettre minuscule' },
                      { key: 'number', text: 'Un chiffre' },
                      { key: 'special', text: 'Un caractère spécial (optionnel)' },
                    ].map((req) => (
                      <li key={req.key} className="flex items-center">
                        {passwordRequirements[req.key] ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaTimes className="text-gray-300 mr-2" />
                        )}
                        <span className={passwordRequirements[req.key] ? 'text-green-700' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-primary rounded focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-gray-700">
                    J'accepte les{' '}
                    <Link to="/conditions" className="text-primary hover:underline">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/confidentialite" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-lg bg-blue-800 rounded-xl text-white"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-xl h-5 w-5 border-b-2 border-white mr-3"></div>
                      Création du compte...
                    </span>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <Link
                    to="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>

            {/* Informations */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Pourquoi nous rejoindre ?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FaCheck className="mr-3 mt-1 flex-shrink-0" />
                    <span>Accès à des centaines de salles professionnelles</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="mr-3 mt-1 flex-shrink-0" />
                    <span>Réservation 24h/24 et 7j/7</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="mr-3 mt-1 flex-shrink-0" />
                    <span>Paiement sécurisé</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="mr-3 mt-1 flex-shrink-0" />
                    <span>Support client dédié</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="mr-3 mt-1 flex-shrink-0" />
                    <span>Gestion simplifiée de vos réservations</span>
                  </li>
                </ul>
              </div>

              {formData.type === 'Proprietaire' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Devenir propriétaire
                  </h3>
                  <p className="text-gray-600 mb-4">
                    En tant que propriétaire, vous pouvez :
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1" />
                      <span>Gérer vos salles facilement</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1" />
                      <span>Définir vos propres tarifs</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1" />
                      <span>Recevoir des paiements sécurisés</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1" />
                      <span>Bénéficier d'une visibilité nationale</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;