import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Download, Award, Calendar } from 'lucide-react';
import Chart from '../../components/Chart';

// Mock data for student grades
const MOCK_GRADES_DATA = {
  student: {
    name: 'Lucas Dupont',
    class: '3ème A',
    year: '2023-2024',
  },
  subjects: [
    {
      id: 1,
      name: 'Mathématiques',
      teacher: 'Mme Martin',
      average: 15.5,
      classAverage: 14.2,
      grades: [
        { id: 101, date: '2023-10-05', title: 'Contrôle sur les équations', grade: 16, coefficient: 2, maxGrade: 20, classAverage: 14.5 },
        { id: 102, date: '2023-09-18', title: 'Interrogation sur les fractions', grade: 15, coefficient: 1, maxGrade: 20, classAverage: 13.8 },
        { id: 103, date: '2023-09-02', title: 'Devoir maison - Géométrie', grade: 17, coefficient: 1, maxGrade: 20, classAverage: 15.2 },
      ],
    },
    {
      id: 2,
      name: 'Français',
      teacher: 'M. Bernard',
      average: 14.0,
      classAverage: 13.5,
      grades: [
        { id: 201, date: '2023-10-10', title: 'Dissertation sur Molière', grade: 14, coefficient: 2, maxGrade: 20, classAverage: 13.2 },
        { id: 202, date: '2023-09-25', title: 'Commentaire de texte', grade: 13, coefficient: 1, maxGrade: 20, classAverage: 12.8 },
        { id: 203, date: '2023-09-05', title: 'Dictée', grade: 15, coefficient: 1, maxGrade: 20, classAverage: 14.5 },
      ],
    },
    {
      id: 3,
      name: 'Histoire-Géographie',
      teacher: 'Mme Petit',
      average: 16.2,
      classAverage: 14.8,
      grades: [
        { id: 301, date: '2023-10-12', title: 'Contrôle sur la Seconde Guerre mondiale', grade: 17, coefficient: 2, maxGrade: 20, classAverage: 15.0 },
        { id: 302, date: '2023-09-20', title: 'Exposé sur l\'Union européenne', grade: 16, coefficient: 1, maxGrade: 20, classAverage: 14.5 },
        { id: 303, date: '2023-09-08', title: 'Quiz sur les repères chronologiques', grade: 15, coefficient: 1, maxGrade: 20, classAverage: 14.2 },
      ],
    },
    {
      id: 4,
      name: 'Anglais',
      teacher: 'M. Dubois',
      average: 13.8,
      classAverage: 14.0,
      grades: [
        { id: 401, date: '2023-10-08', title: 'Compréhension orale', grade: 12, coefficient: 1, maxGrade: 20, classAverage: 13.5 },
        { id: 402, date: '2023-09-22', title: 'Expression écrite', grade: 14, coefficient: 1, maxGrade: 20, classAverage: 14.2 },
        { id: 403, date: '2023-09-01', title: 'Test de vocabulaire', grade: 15, coefficient: 1, maxGrade: 20, classAverage: 14.8 },
      ],
    },
    {
      id: 5,
      name: 'Sciences',
      teacher: 'Mme Laurent',
      average: 15.0,
      classAverage: 14.1,
      grades: [
        { id: 501, date: '2023-10-15', title: 'Contrôle sur la cellule', grade: 16, coefficient: 2, maxGrade: 20, classAverage: 14.5 },
        { id: 502, date: '2023-09-28', title: 'TP sur l\'électricité', grade: 14, coefficient: 1, maxGrade: 20, classAverage: 13.8 },
        { id: 503, date: '2023-09-10', title: 'Quiz sur les atomes', grade: 15, coefficient: 1, maxGrade: 20, classAverage: 14.0 },
      ],
    },
    {
      id: 6,
      name: 'Éducation Physique',
      teacher: 'M. Moreau',
      average: 17.5,
      classAverage: 15.8,
      grades: [
        { id: 601, date: '2023-10-18', title: 'Évaluation d\'endurance', grade: 18, coefficient: 1, maxGrade: 20, classAverage: 16.0 },
        { id: 602, date: '2023-09-30', title: 'Gymnastique', grade: 17, coefficient: 1, maxGrade: 20, classAverage: 15.5 },
        { id: 603, date: '2023-09-12', title: 'Sports collectifs', grade: 18, coefficient: 1, maxGrade: 20, classAverage: 16.2 },
      ],
    },
  ],
  trimester: {
    number: 1,
    average: 15.3,
    classAverage: 14.4,
    classRank: '5e / 24',
    teacherComments: [
      {
        teacherName: 'Mme Martin',
        subject: 'Mathématiques',
        comment: 'Excellent travail ce trimestre. Continue ainsi !',
      },
      {
        teacherName: 'M. Bernard',
        subject: 'Français',
        comment: 'Bon travail, mais la participation orale pourrait être améliorée.',
      },
      {
        teacherName: 'Mme Petit',
        subject: 'Histoire-Géographie',
        comment: 'Très bon trimestre avec des résultats constants.',
      },
      {
        teacherName: 'M. Dubois',
        subject: 'Anglais',
        comment: 'Des résultats corrects, mais des efforts restent à faire.',
      },
      {
        teacherName: 'Mme Laurent',
        subject: 'Sciences',
        comment: 'Bon investissement en classe et à la maison.',
      },
      {
        teacherName: 'M. Moreau',
        subject: 'Éducation Physique',
        comment: 'Excellent niveau et bonne attitude en cours.',
      },
    ],
    principalComment: 'Lucas a réalisé un très bon premier trimestre. Il doit maintenir ses efforts pour progresser encore davantage.',
  },
};

const StudentGrades: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trimesterFilter, setTrimesterFilter] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const { student, subjects, trimester } = MOCK_GRADES_DATA;
  
  // Filter subjects based on search query and selected subject
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || subject.name === selectedSubject;
    return matchesSearch && matchesSubject;
  });
  
  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
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
          
          <div className="flex space-x-3">
            <button className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <Award className="mr-2 h-4 w-4" />
              Trimestre {trimester.number}
            </button>
            
            <button className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <Download className="mr-2 h-4 w-4" />
              Télécharger le bulletin
            </button>
          </div>
        </div>
      </div>
      
      {/* Statistics and charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Évolution des moyennes</h3>
          <Chart type="line" />
        </div>
        
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900">Statistiques</h3>
            <Calendar className="h-5 w-5 text-neutral-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between rounded-md bg-neutral-50 p-3">
              <span className="text-sm font-medium text-neutral-600">Moyenne générale:</span>
              <span className="font-bold text-primary">{trimester.average}/20</span>
            </div>
            
            <div className="flex justify-between rounded-md bg-neutral-50 p-3">
              <span className="text-sm font-medium text-neutral-600">Moyenne de la classe:</span>
              <span className="font-medium text-neutral-900">{trimester.classAverage}/20</span>
            </div>
            
            <div className="flex justify-between rounded-md bg-neutral-50 p-3">
              <span className="text-sm font-medium text-neutral-600">Rang dans la classe:</span>
              <span className="font-medium text-neutral-900">{trimester.classRank}</span>
            </div>
            
            <div className="flex justify-between rounded-md bg-neutral-50 p-3">
              <span className="text-sm font-medium text-neutral-600">Trimestre:</span>
              <span className="font-medium text-neutral-900">{trimester.number}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="mb-2 text-sm font-medium text-neutral-600">Appréciation générale:</p>
            <p className="rounded-md bg-neutral-50 p-3 text-sm text-neutral-700">
              {trimester.principalComment}
            </p>
          </div>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une matière..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-sm placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          
          {showFilters && (
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="mb-4">
                <label htmlFor="trimester-filter" className="block text-sm font-medium text-neutral-700">
                  Trimestre
                </label>
                <select
                  id="trimester-filter"
                  value={trimesterFilter}
                  onChange={(e) => setTrimesterFilter(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-neutral-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value={1}>Trimestre 1</option>
                  <option value={2}>Trimestre 2</option>
                  <option value={3}>Trimestre 3</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subject-filter" className="block text-sm font-medium text-neutral-700">
                  Matière
                </label>
                <select
                  id="subject-filter"
                  value={selectedSubject || ''}
                  onChange={(e) => setSelectedSubject(e.target.value || null)}
                  className="mt-1 block w-full rounded-md border border-neutral-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Toutes les matières</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubject(null);
                    setShowFilters(false);
                  }}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Subjects and grades */}
      <div className="space-y-6">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="card">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{subject.name}</h3>
                <p className="text-sm text-neutral-500">
                  {subject.teacher}
                </p>
              </div>
              
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-xs font-medium text-neutral-500">Moyenne de l'élève</p>
                  <p className="text-xl font-bold text-primary">{subject.average}/20</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs font-medium text-neutral-500">Moyenne de la classe</p>
                  <p className="text-lg font-medium text-neutral-900">{subject.classAverage}/20</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              {subject.grades.length > 0 ? (
                <div className="table-container overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Titre</th>
                        <th scope="col">Coefficient</th>
                        <th scope="col">Note</th>
                        <th scope="col">Moyenne classe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subject.grades.map((grade) => (
                        <tr key={grade.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                            {formatDate(grade.date)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                            {grade.title}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-neutral-900">
                            {grade.coefficient}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                            <span className={`
                              ${grade.grade >= 14 ? 'text-success' : ''}
                              ${grade.grade < 14 && grade.grade >= 10 ? 'text-neutral-900' : ''}
                              ${grade.grade < 10 ? 'text-error' : ''}
                            `}>
                              {grade.grade}/{grade.maxGrade}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                            {grade.classAverage}/{grade.maxGrade}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-sm text-neutral-500">
                  Aucune note pour cette matière.
                </p>
              )}
            </div>
            
            {/* Teacher comment */}
            {trimester.teacherComments.find(comment => comment.subject === subject.name) && (
              <div className="rounded-md bg-neutral-50 p-3">
                <p className="text-xs font-medium text-neutral-500">Appréciation du professeur:</p>
                <p className="text-sm text-neutral-700">
                  {trimester.teacherComments.find(comment => comment.subject === subject.name)?.comment}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGrades;