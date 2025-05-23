import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { School, ChevronRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect by role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher/Dashboard');
      } else if (user.role === 'student') {
        navigate('/student/Dashboard');
      } else {
        navigate('/'); // fallback if role is unknown
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.response?.data?.error || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Left side */}
      <div className="hidden w-1/2 bg-primary lg:block">
        <div className="flex h-full flex-col items-center justify-center px-8 text-white">
          <School className="mb-6 h-24 w-24" />
          <h1 className="mb-4 text-4xl font-bold">SchoolManager</h1>
          <p className="mb-8 text-center text-xl">
            Plateforme de gestion scolaire complète pour administrateurs, enseignants, élèves et parents
          </p>
          <div className="w-3/4 max-w-md rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <p className="mb-4 text-lg font-medium">Fonctionnalités principales :</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4" />
                <span>Gestion des enseignants et élèves</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4" />
                <span>Suivi des notes et présences</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4" />
                <span>Calendrier des examens et événements</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4" />
                <span>Tableaux de bord personnalisés</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2">
        <div className="flex h-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center lg:hidden">
              <School className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-2 text-2xl font-bold text-neutral-900">SchoolManager</h2>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 lg:text-3xl">Connexion</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Accédez à votre espace personnel
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {authError && (
                  <div className="rounded-md bg-red-100 p-3 text-sm text-red-600">
                    {authError}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-neutral-600">
                Pas de compte ?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary-light">
                  Inscrivez-vous
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;