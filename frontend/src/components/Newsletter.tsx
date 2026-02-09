import React, { useState, FormEvent } from 'react';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const Newsletter = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }, 1500);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {subscribed ? (
              <div className="flex flex-col items-center">
                <FaCheckCircle className="text-green-500 text-6xl mb-6" />
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Merci de votre inscription !
                </h3>
                <p className="text-gray-600 text-lg">
                  Vous recevrez bientôt nos dernières nouvelles et offres spéciales.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Restez Informé</h2>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                  Inscrivez-vous à notre newsletter pour recevoir les dernières offres, les nouvelles
                  salles disponibles et des conseils pour vos événements.
                </p>
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <input
                        type="email"
                        placeholder="Votre adresse email"
                        className="w-full px-6 py-4 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-lg rounded-xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary px-8 py-4 text-lg flex items-center justify-center min-w-[200px] btn-outline px-8 py-3 text-lg border-1 border-blue-800 text-blue-800 rounded-xl"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-xl h-5 w-5 border-b-2 border-white mr-3" />
                          Envoi...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          S&apos;inscrire
                          <FaPaperPlane className="ml-3" />
                        </span>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-4">
                    En vous inscrivant, vous acceptez notre{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </a>
                    . Vous pourrez vous désinscrire à tout moment.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
