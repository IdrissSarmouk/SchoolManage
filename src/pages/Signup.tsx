import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { School, ChevronRight } from 'lucide-react';

const Signup: React.FC = () => {
  const [role, setRole] = useState('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [classe, setClasse] = useState('1M1');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signup({ role, firstName, lastName, password, classe });
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const classes = [
    '1M1', '1M2', '1M3',
    '2M1', '2M2', '2M3',
    '3M1', '3M2', '3M3',
    '4M1', '4M2', '4M3',
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Left side - Image */}
      <div className="hidden w-1/2 bg-primary lg:block">
        <div className="flex h-full flex-col items-center justify-center px-8 text-white">
          <School className="mb-6 h-24 w-24" />
          <h1 className="mb-4 text-4xl font-bold">SchoolManager</h1>
          <p className="mb-8 text-center text-xl">
            Plateforme de gestion scolaire complète pour administrateurs, enseignants, élèves et parents
          </p>
          <div className="w-3/4 max-w-md rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <p className="mb-4 text-lg font-medium">Rejoignez-nous :</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4" />
                <span>Interface simple et intuitive</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4" />
                <span>Suivi en temps réel</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4" />
                <span>Support pour tous les rôles</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full lg:w-1/2">
        <div className="flex h-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center lg:hidden">
              <School className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-2 text-2xl font-bold text-neutral-900">SchoolManager</h2>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 lg:text-3xl">Inscription</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Créez votre compte personnel
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {authError && (
                  <div className="rounded-md bg-error/10 p-3 text-sm text-error">
                    {authError}
                  </div>
                )}

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-neutral-700">
                    Rôle
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  >
                    <option value="student">Élève</option>
                    <option value="teacher">Enseignant</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">
                    Nom de famille
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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

                {/* Conditional rendering of 'classe' field */}
                {role === 'student' && (
                  <div>
                    <label htmlFor="classe" className="block text-sm font-medium text-neutral-700">
                      Classe scolaire
                    </label>
                    <select
                      id="classe"
                      value={classe}
                      onChange={(e) => setClasse(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    >
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isLoading ? 'Inscription...' : 'S’inscrire'}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-neutral-600">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary-light">
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
