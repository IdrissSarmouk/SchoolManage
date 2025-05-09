import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4 text-center">
      <h1 className="mb-2 text-9xl font-bold text-primary">404</h1>
      <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Page non trouvée</h2>
      <p className="mb-8 max-w-md text-neutral-600">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </button>
    </div>
  );
};

export default NotFound;