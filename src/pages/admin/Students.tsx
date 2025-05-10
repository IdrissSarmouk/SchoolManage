import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, ChevronDown, Filter } from 'lucide-react';

// Classes disponibles pour le filtrage
const CLASSES = [
  '1M1', '1M2', '1M3', '2M1', '2M2', '2M3',
  '3M1', '3M2', '3M3', '4M1', '4M2', '4M3'
];

const StudentModal = ({ isOpen, type, student, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    student || {
      first_name: '',
      last_name: '',
      class_name: '',
      email: '',
      password: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      address: '',
    }
  );

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        class_name: student.class_name || '',
        password: ''
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        class_name: '',
        email: '',
        password: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            type === 'add' ? 'Ajouter un élève' : 'Modifier l'élève'
          </h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-neutral-100">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <label htmlFor="class_name" className="block text-sm font-medium text-neutral-700">
                Classe
              </label>
              <select
                id="class_name"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              >
                <option value="">Sélectionnez une classe</option>
                {CLASSES.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
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
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                {type === 'add' ? 'Mot de passe' : 'Nouveau mot de passe (laisser vide pour ne pas changer)'}
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

const DeleteConfirmation = ({ isOpen, student, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
            <Trash2 className="h-6 w-6 text-error" />
          </div>
          <h2 className="mt-2 text-xl font-semibold text-neutral-900">Supprimer l'élève</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Êtes-vous sûr de vouloir supprimer l'élève <span className="font-medium">{student?.first_name} {student?.last_name}</span> ?
            Cette action ne peut pas être annulée.
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
            onClick={() => onConfirm(student.id)}
            className="rounded-md border border-transparent bg-error px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentFilters = ({ filters, setFilters, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    setLocalFilters({
      ...localFilters,
      class_name: e.target.value,
    });
  };

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      class_name: '',
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

      <div>
        <label htmlFor="class-filter" className="block text-xs font-medium text-neutral-700">
          Classe
        </label>
        <select
          id="class-filter"
          value={localFilters.class_name}
          onChange={handleChange}
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
      
      <div className="flex justify-between pt-4">
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
  );
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, student: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });
  const [filters, setFilters] = useState({ class_name: '' });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/students');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des étudiants');
        }
        const data = await response.json();
        setStudents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Impossible de charger les étudiants. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search query and filters
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      (student.parentName && student.parentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.class_name && student.class_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass = 
      filters.class_name === '' || student.class_name === filters.class_name;

    return matchesSearch && matchesClass;
  });

  // Sort students based on sort config
  const sortedStudents = React.useMemo(() => {
    let sortableStudents = [...filteredStudents];
    if (sortConfig.key) {
      sortableStudents.sort((a, b) => {
        // Handle sorting by name (combination of first_name and last_name)
        if (sortConfig.key === 'name') {
          const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
          const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
          if (nameA < nameB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (nameA > nameB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        
        // For other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [filteredStudents, sortConfig]);

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

  const handleAddStudent = async (student) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout de l\'élève');
      }

      const newStudent = await response.json();
      
      // Ajouter les champs supplémentaires qui ne sont pas retournés par l'API
      const enhancedStudent = {
        ...newStudent,
        parentName: student.parentName,
        parentEmail: student.parentEmail,
        parentPhone: student.parentPhone,
        address: student.address,
      };
      
      setStudents([...students, enhancedStudent]);
      setModalState({ isOpen: false, type: null, student: null });
    } catch (err) {
      console.error('Error adding student:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = async (student) => {
    try {
      setLoading(true);
      const studentData = {
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        class_name: student.class_name,
      };
      
      // N'incluez le mot de passe que s'il a été fourni
      if (student.password) {
        studentData.password = student.password;
      }

      const response = await fetch(`http://localhost:3000/api/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification de l\'élève');
      }

      // Mettre à jour l'état local
      setStudents(
        students.map((s) => (s.id === student.id ? { 
          ...s, 
          ...student,
          // Conserver les informations supplémentaires
          parentName: student.parentName || s.parentName,
          parentEmail: student.parentEmail || s.parentEmail,
          parentPhone: student.parentPhone || s.parentPhone,
          address: student.address || s.address
        } : s))
      );
      
      setModalState({ isOpen: false, type: null, student: null });
    } catch (err) {
      console.error('Error editing student:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/students/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'élève');
      }

      setStudents(students.filter((s) => s.id !== id));
      setDeleteModal({ isOpen: false, student: null });
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (formData) => {
    if (modalState.type === 'add') {
      handleAddStudent(formData);
    } else {
      handleEditStudent(formData);
    }
  };

  if (loading && students.length === 0) {
    return <div className="flex justify-center p-8">Chargement des élèves...</div>;
  }

  if (error && students.length === 0) {
    return <div className="p-8 text-center text-error">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Message d'erreur */}
      {error && (
        <div className="rounded-md bg-error/10 p-4 text-error">
          <p>{error}</p>
        </div>
      )}
      
      {/* Header with search and add button */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un élève..."
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
            <StudentFilters
              filters={filters}
              setFilters={setFilters}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
            />
          </div>
          
          <button
            onClick={() => 
              setModalState({ isOpen: true, type: 'add', student: null })
            }
            className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un élève
          </button>
        </div>
      </div>

      {/* Students table */}
      <div className="table-container overflow-x-auto">
        <table className="table w-full">
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
                  onClick={() => requestSort('class_name')}
                  className="flex items-center font-medium"
                >
                  Classe {getSortIndicator('class_name')}
                </button>
              </th>
              <th scope="col">
                <button
                  onClick={() => requestSort('email')}
                  className="flex items-center font-medium"
                >
                  Email {getSortIndicator('email')}
                </button>
              </th>
              <th scope="col">Contact Parent</th>
              <th scope="col" className="text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {sortedStudents.length > 0 ? (
              sortedStudents.map((student) => (
                <tr key={student.id}>
                  <td className="whitespace-nowrap py-4 pl-6 pr-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-neutral-900">{student.first_name} {student.last_name}</div>
                        <div className="text-xs text-neutral-500">{student.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-900">
                    <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                      {student.class_name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-900">
                    {student.email}
                  </td>
                  <td className="px-3 py-4 text-sm text-neutral-900">
                    <div className="font-medium">{student.parentName}</div>
                    <div className="text-xs text-neutral-500">{student.parentPhone}</div>
                    <div className="text-xs text-neutral-500">{student.parentEmail}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        setModalState({
                          isOpen: true,
                          type: 'edit',
                          student: student,
                        })
                      }
                      className="mr-2 rounded-full p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({ isOpen: true, student: student })
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
                  Aucun élève trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Simplifiée pour l'instant */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-700">
          Affichage de 1 à {sortedStudents.length} sur {sortedStudents.length} élèves
        </div>
        <div className="flex space-x-1">
          <button
            disabled
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            disabled
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Modals */}
      <StudentModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        student={modalState.student}
        onClose={() => setModalState({ isOpen: false, type: null, student: null })}
        onSubmit={handleSubmit}
      />
      
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        student={deleteModal.student}
        onClose={() => setDeleteModal({ isOpen: false, student: null })}
        onConfirm={handleDeleteStudent}
      />
    </div>
  );
};

export default AdminStudents;