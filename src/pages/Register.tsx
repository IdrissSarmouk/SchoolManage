import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { School } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(email, password, name, role);
      
      // Redirect based on role
      if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Left side - Image */}
      <div className="hidden w-1/2 bg-primary lg:block">
        <div className="flex h-full flex-col items-center justify-center px-8 text-white">
          <School className="mb-6 h-24 w-24" />
          <h1 className="mb-4 text-4xl font-bold">SchoolManager</h1>
          <p className="mb-8 text-center text-xl">
            Plateforme de gestion scolaire complète pour enseignants et élèves
          </p>
        </div>
      </div>
      
      {/* Right side - Registration form */}
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
                Créez votre compte pour accéder à la plateforme
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
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                    Nom complet
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  />
                </div>
                
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
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-neutral-700">
                    Je suis
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'teacher' | 'student')}
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  >
                    <option value="student">Élève</option>
                    <option value="teacher">Enseignant</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </button>
                
                <div className="text-center text-sm">
                  <span className="text-neutral-600">Déjà inscrit ?</span>{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-medium text-primary hover:text-primary-light"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;