import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.mot_de_passe);
      navigate('/');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 bg-white">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Connexion
              </h1>
              <p className="text-gray-600">
                Connectez-vous à votre compte pour continuer
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 font-medium">
                    Mot de passe
                  </label>
                  <Link
                    to="/mot-de-passe-oublie"
                    className="text-primary hover:underline text-sm"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="mot_de_passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Votre mot de passe"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg bg-blue-800 text-white rounded-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-xl h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connexion...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Ou connectez-vous avec
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaGoogle className="text-red-500 mr-3" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaFacebook className="text-blue-600 mr-3" />
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                >
                  S'inscrire maintenant
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;