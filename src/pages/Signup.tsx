import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, ChevronRight } from 'lucide-react';

const Signup: React.FC = () => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classe, setClasse] = useState('1M1');
  const [subject, setSubject] = useState('Mathematiques');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          class_name: classe,
          subject_name: subject
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // Affiche l’erreur renvoyée par le serveur
        setErrorMsg(data.error || 'Une erreur est survenue');
        if (data.availableSubjects) {
          setErrorMsg(`${data.error}. Matières disponibles: ${data.availableSubjects.join(', ')}`);
        }
      } else {
        // Inscription OK → redirection vers la page de connexion
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Impossible de contacter le serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const classes = [
    '1M1','1M2','1M3',
    '2M1','2M2','2M3',
    '3M1','3M2','3M3',
    '4M1','4M2','4M3',
  ];
  const subjects = [
    'Mathematiques','Civiles','Sciences',
    'Arabe','Francais','Anglais',
    'Histoire Geographie','Islamique',
  ];

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
            <p className="mb-4 text-lg font-medium">Rejoignez‑nous :</p>
            <ul className="space-y-2">
              <li className="flex items-center"><ChevronRight className="mr-2 h-4 w-4" />Interface simple et intuitive</li>
              <li className="flex items-center"><ChevronRight className="mr-2 h-4 w-4" />Suivi en temps réel</li>
              <li className="flex items-center"><ChevronRight className="mr-2 h-4 w-4" />Support pour tous les rôles</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2">
        <div className="flex h-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center lg:hidden">
              <School className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-2 text-2xl font-bold text-neutral-900">SchoolManager</h2>
            </div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 lg:text-3xl">Inscription</h2>
              <p className="mt-2 text-sm text-neutral-600">Créez votre compte personnel</p>
            </div>
            <div className="mb-6 rounded-lg bg-white p-8 shadow-sm">
              {errorMsg && (
                <div className="rounded-md bg-error/10 p-3 text-sm text-error mb-4">
                  {errorMsg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-neutral-700">
                    Rôle
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="mt-1 block w-full rounded-md border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="student">Élève</option>
                    <option value="teacher">Enseignant</option>
                  </select>
                </div>

                {/* Prénom & Nom */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">Prénom</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">Nom</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* Email & Password */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Mot de passe</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* Classe ou Matière */}
                {role === 'student' && (
                  <div>
                    <label htmlFor="classe" className="block text-sm font-medium text-neutral-700">Classe scolaire</label>
                    <select
                      id="classe"
                      value={classe}
                      onChange={e => setClasse(e.target.value)}
                      className="mt-1 block w-full rounded-md border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                {role === 'teacher' && (
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700">Matière enseignée</label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="mt-1 block w-full rounded-md border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isLoading ? 'Inscription…' : 'S’inscrire'}
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