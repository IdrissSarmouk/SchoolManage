import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, ChevronDown, Filter } from 'lucide-react';

// Available subjects for filtering
const SUBJECTS = [
  'Mathematiques',
  'Français',
  'Histoire Geographie',
  'Sciences',
  'Anglais',
  'Arabe',
  'Civile',
  'Islamique',
];

// Available classes for filtering
const CLASSES = [
  '1M1', '1M2', '1M3', '2M1', '2M2', '2M3',
  '3M1', '3M2', '3M3', '4M1', '4M2', '4M3',
];

const TeacherModals = ({ isOpen, type, teacher, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    teacher || {
      first_name: '',
      last_name: '',
      email: '',
      password: '', // Ajout du champ password pour la création
      subject_name: '',
      class_names: [],
      phone: '',
      startDate: '',
    }
  );

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData(
        teacher || {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          subject_name: '',
          class_names: [],
          phone: '',
          startDate: '',
        }
      );
    }
  }, [isOpen, teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClassChange = (className) => {
    const newClasses = formData.class_names.includes(className)
      ? formData.class_names.filter((c) => c !== className)
      : [...formData.class_names, className];
    
    setFormData({ ...formData, class_names: newClasses });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            {type === 'add' ? 'Ajouter un enseignant' : 'Modifier l\'enseignant'}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-neutral-100">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-neutral-700">
              Prénom
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-neutral-700">
              Nom
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            />
          </div>
          
          {type === 'add' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={type === 'add'}
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="subject_name" className="block text-sm font-medium text-neutral-700">
              Matière
            </label>
            <select
              id="subject_name"
              name="subject_name"
              value={formData.subject_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            >
              <option value="">Sélectionnez une matière</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Classes
            </label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {CLASSES.map((className) => (
                <div key={className} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`class-${className}`}
                    checked={formData.class_names.includes(className)}
                    onChange={() => handleClassChange(className)}
                    className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`class-${className}`} className="ml-2 text-sm text-neutral-700">
                    {className}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          
          

          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {type === 'add' ? 'Ajouter' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmation = ({ isOpen, teacher, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
            <Trash2 className="h-6 w-6 text-error" />
          </div>
          <h2 className="mt-2 text-xl font-semibold text-neutral-900">Supprimer l'enseignant</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Êtes-vous sûr de vouloir supprimer l'enseignant{' '}
            <span className="font-medium">
              {teacher?.first_name} {teacher?.last_name}
            </span>
            ? Cette action ne peut pas être annulée.
          </p>
        </div>
        
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => onConfirm(teacher.id)}
            className="rounded-md border border-transparent bg-error px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherFilters = ({ filters, setFilters, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e, filterType) => {
    if (filterType === 'subject') {
      setLocalFilters({
        ...localFilters,
        subject: e.target.value,
      });
    } else if (filterType === 'class') {
      setLocalFilters({
        ...localFilters,
        class: e.target.value,
      });
    }
  };

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      subject: '',
      class: '',
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-md bg-white p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-900">Filtres</h3>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-500">
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="subject-filter" className="block text-xs font-medium text-neutral-700">
            Matière
          </label>
          <select
            id="subject-filter"
            value={localFilters.subject}
            onChange={(e) => handleChange(e, 'subject')}
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-1 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Toutes les matières</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="class-filter" className="block text-xs font-medium text-neutral-700">
            Classe
          </label>
          <select
            id="class-filter"
            value={localFilters.class}
            onChange={(e) => handleChange(e, 'class')}
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-1 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Toutes les classes</option>
            {CLASSES.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-neutral-700 hover:text-neutral-900"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

// Type pour un enseignant
interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  classes: string[];
}

const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, teacher: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, teacher: null });
  const [filters, setFilters] = useState({ subject: '', class: '' });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Chargement initial des enseignants
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/teachers');
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        // Transformation des données pour correspondre à notre modèle d'interface
        const formattedTeachers = data.map(teacher => ({
          id: teacher.id,
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          email: teacher.email || '',
          subject: teacher.subject,
          classes: teacher.classes || []
        }));
        
        setTeachers(formattedTeachers);
      } catch (err) {
        setError(`Erreur lors du chargement des enseignants: ${err.message}`);
        console.error('Erreur lors du chargement des enseignants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filtrer les enseignants
  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = 
      filters.subject === '' || teacher.subject === filters.subject;
    
    const matchesClass = 
      filters.class === '' || teacher.classes.includes(filters.class);
    
    return matchesSearch && matchesSubject && matchesClass;
  });

  // Trier les enseignants
  const sortedTeachers = React.useMemo(() => {
    let sortableTeachers = [...filteredTeachers];
    if (sortConfig.key) {
      sortableTeachers.sort((a, b) => {
        // Pour les noms complets
        if (sortConfig.key === 'name') {
          const aName = `${a.first_name} ${a.last_name}`;
          const bName = `${b.first_name} ${b.last_name}`;
          if (aName < bName) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aName > bName) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTeachers;
  }, [filteredTeachers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const handleAddTeacher = async (teacherData) => {
    try {
      const response = await fetch('http://localhost:3000/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout de l\'enseignant');
      }

      // Recharger la liste des enseignants après l'ajout
      const teachersResponse = await fetch('http://localhost:3000/api/teachers');
      const updatedTeachers = await teachersResponse.json();
      
      const formattedTeachers = updatedTeachers.map(teacher => ({
        id: teacher.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email || '',
        subject: teacher.subject,
        classes: teacher.classes || []
      }));
      
      setTeachers(formattedTeachers);
      setModalState({ isOpen: false, type: null, teacher: null });
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'enseignant:', err);
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleEditTeacher = async (teacherData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/teachers/${teacherData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: teacherData.first_name,
          last_name: teacherData.last_name,
          email: teacherData.email,
          subject_name: teacherData.subject_name,
          class_names: teacherData.class_names,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'enseignant');
      }

      // Recharger la liste des enseignants après la mise à jour
      const teachersResponse = await fetch('http://localhost:3000/api/teachers');
      const updatedTeachers = await teachersResponse.json();
      
      const formattedTeachers = updatedTeachers.map(teacher => ({
        id: teacher.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email || '',
        subject: teacher.subject,
        classes: teacher.classes || []
      }));
      
      setTeachers(formattedTeachers);
      setModalState({ isOpen: false, type: null, teacher: null });
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'enseignant:', err);
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/teachers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'enseignant');
      }

      // Filtrer l'enseignant supprimé de notre state local
      setTeachers(teachers.filter((t) => t.id !== id));
      setDeleteModal({ isOpen: false, teacher: null });
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'enseignant:', err);
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleSubmit = (formData) => {
    if (modalState.type === 'add') {
      handleAddTeacher(formData);
    } else {
      handleEditTeacher(formData);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des enseignants...</div>;
  }

  if (error) {
    return <div className="text-error p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un enseignant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-sm placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtres
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <TeacherFilters
              filters={filters}
              setFilters={setFilters}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
            />
          </div>
          
          <button
            onClick={() => 
              setModalState({ isOpen: true, type: 'add', teacher: null })
            }
            className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un enseignant
          </button>
        </div>
      </div>

      {/* Teachers table */}
      <div className="table-container overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <button
                  onClick={() => requestSort('name')}
                  className="flex items-center font-medium"
                >
                  Nom {getSortIndicator('name')}
                </button>
              </th>
              <th scope="col">
                <button
                  onClick={() => requestSort('subject')}
                  className="flex items-center font-medium"
                >
                  Matière {getSortIndicator('subject')}
                </button>
              </th>
              <th scope="col">Classes</th>
              <th scope="col" className="text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {sortedTeachers.length > 0 ? (
              sortedTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="whitespace-nowrap py-4 pl-6 pr-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {teacher.first_name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-neutral-900">
                          {teacher.first_name} {teacher.last_name}
                        </div>
                        <div className="text-xs text-neutral-500">{teacher.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-900">
                    {teacher.subject}
                  </td>
                  <td className="px-3 py-4 text-sm text-neutral-900">
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes && teacher.classes.map((cls) => (
                        <span
                          key={cls}
                          className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </td>
                  
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        setModalState({
                          isOpen: true,
                          type: 'edit',
                          teacher: {
                            ...teacher,
                            subject_name: teacher.subject,
                            class_names: teacher.classes || [],
                          },
                        })
                      }
                      className="mr-3 rounded-full p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({ isOpen: true, teacher: teacher })
                      }
                      className="rounded-full p-1 text-neutral-600 hover:bg-neutral-100 hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
             <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-neutral-500">
                  Aucun enseignant trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination options can go here if needed */}
      
      {/* Modals */}
      <TeacherModals
        isOpen={modalState.isOpen}
        type={modalState.type}
        teacher={modalState.teacher}
        onClose={() => setModalState({ isOpen: false, type: null, teacher: null })}
        onSubmit={handleSubmit}
      />
      
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        teacher={deleteModal.teacher}
        onClose={() => setDeleteModal({ isOpen: false, teacher: null })}
        onConfirm={handleDeleteTeacher}
      />
    </div>
  );
};

export default AdminTeachers;