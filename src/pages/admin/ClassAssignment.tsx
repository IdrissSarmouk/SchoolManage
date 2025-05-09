import React, { useState } from 'react';
import { Save, Check, ChevronDown } from 'lucide-react';

// Mock data for teachers
const MOCK_TEACHERS = [
  { id: 1, name: 'Hasan Martin', subject: 'Mathématiques', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 2, name: 'Thomas Bernard', subject: 'Histoire-Géographie', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 3, name: 'Marie Laurent', subject: 'Français', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 4, name: 'Pierre Dubois', subject: 'Sciences', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 5, name: 'Julie Moreau', subject: 'Anglais', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 6, name: 'Alexandre Leroy', subject: 'Éducation Physique', avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: 7, name: 'Claire Dupont', subject: 'Civile', avatar: 'https://i.pravatar.cc/150?img=17' },
  { id: 8, name: 'Jean Rousseau', subject: 'Arabe', avatar: 'https://i.pravatar.cc/150?img=18' },
  { id: 9, name: 'Laure Simon', subject: 'Islamique', avatar: 'https://i.pravatar.cc/150?img=19' },
];

const SUBJECTS = [
  'Mathématiques', 'Français', 'Histoire-Géographie', 'Sciences', 
  'Anglais', 'Arabe', 'Civile', 'Islamique',
];

const CLASSES = [
  '1M1', '1M2', '1M3', '2M1', '2M2', '2M3',
  '3M1', '3M2', '3M3', '4M1', '4M2', '4M3',
];

const generateInitialAssignments = () => {
  const assignments = {};
  CLASSES.forEach(className => {
    assignments[className] = {};
    SUBJECTS.forEach(subject => {
      const random = Math.random();
      if (random > 0.3) {
        const eligibleTeachers = MOCK_TEACHERS.filter(t => t.subject === subject);
        if (eligibleTeachers.length > 0) {
          const randomTeacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];
          assignments[className][subject] = randomTeacher.id;
        } else {
          assignments[className][subject] = null;
        }
      } else {
        assignments[className][subject] = null;
      }
    });
  });
  return assignments;
};

const AdminClassAssignment: React.FC = () => {
  const [assignments, setAssignments] = useState(generateInitialAssignments());
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAssignmentChange = (subject, teacherId) => {
    setAssignments({
      ...assignments,
      [selectedClass]: {
        ...assignments[selectedClass],
        [subject]: teacherId,
      },
    });
    setUnsavedChanges(true);
    setSuccessMessage('');
  };

  const saveAssignments = () => {
    console.log('Saving assignments:', assignments);
    setUnsavedChanges(false);
    setSuccessMessage('Affectations enregistrées avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getEligibleTeachers = (subject) => {
    return MOCK_TEACHERS.filter(teacher => teacher.subject === subject);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center">
          <label htmlFor="class-selector" className="mr-2 text-sm font-medium text-neutral-700">
            Classe :
          </label>
          <div className="relative inline-block text-left">
            <select
              id="class-selector"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-40 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {CLASSES.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        <button
          onClick={saveAssignments}
          disabled={!unsavedChanges}
          className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            unsavedChanges
              ? 'bg-primary hover:bg-primary-light focus:ring-primary'
              : 'bg-neutral-400 cursor-not-allowed'
          }`}
        >
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les modifications
        </button>
      </div>

      {successMessage && (
        <div className="animate-fade-in rounded-md bg-success/10 p-3 text-sm text-success">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            {successMessage}
          </div>
        </div>
      )}

      <div className="table-container overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="w-1/4">Matière</th>
              <th scope="col" className="w-3/4">Enseignant assigné</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {SUBJECTS.map((subject) => (
              <tr key={subject}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                  {subject}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-900">
                  <div className="relative w-full max-w-md">
                    <select
                      value={assignments[selectedClass][subject] || ''}
                      onChange={(e) => handleAssignmentChange(subject, e.target.value === '' ? null : Number(e.target.value))}
                      className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-10 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Non assigné</option>
                      {getEligibleTeachers(subject).map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClassAssignment;