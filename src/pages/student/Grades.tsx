import React from 'react';
import { Download } from 'lucide-react';

const MOCK_GRADES_DATA = {
  student: {
    name: 'Lucas Dupont',
    class: '3ème A',
    year: '2023-2024',
  },
};

const StudentGrades: React.FC = () => {
  const { student } = MOCK_GRADES_DATA;

  return (
    <div className="space-y-6">
      {/* Header with student info and report card button */}
      <div className="card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{student.name}</h2>
            <p className="text-sm text-neutral-600">
              {student.class} | Année scolaire {student.year}
            </p>
          </div>

          <div>
            <button className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <Download className="mr-2 h-4 w-4" />
              Télécharger le bulletin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
