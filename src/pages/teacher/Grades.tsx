import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Plus, Check, AlertTriangle, Pencil, Save, X } from 'lucide-react';

// Mock data for classes taught by the teacher
const TEACHER_CLASSES = [
  { id: 1, name: '3ème A', subject: 'Mathématiques' },
  { id: 2, name: '5ème B', subject: 'Mathématiques' },
  { id: 3, name: '4ème C', subject: 'Mathématiques' },
  { id: 4, name: '6ème A', subject: 'Mathématiques' },
];

// Mock data for students in classes
const generateStudentsForClass = (classId) => {
  const studentCount = 15 + Math.floor(Math.random() * 10); // 15-24 students per class
  const students = [];
  
  for (let i = 1; i <= studentCount; i++) {
    students.push({
      id: `${classId}-${i}`,
      name: `Élève ${i}`,
      avatar: `https://i.pravatar.cc/150?img=${(classId * 10) + i}`,
    });
  }
  
  return students;
};

// Mock data for evaluations
const MOCK_EVALUATIONS = [
  { id: 1, classId: 1, title: 'Contrôle - Équations du second degré', date: '2023-10-15', coefficient: 3, maxScore: 20 },
  { id: 2, classId: 1, title: 'Quiz - Théorème de Pythagore', date: '2023-09-28', coefficient: 1, maxScore: 20 },
  { id: 3, classId: 1, title: 'Devoir maison - Trigonométrie', date: '2023-10-05', coefficient: 2, maxScore: 20 },
  { id: 4, classId: 2, title: 'Contrôle - Fractions', date: '2023-10-10', coefficient: 2, maxScore: 20 },
  { id: 5, classId: 2, title: 'Interrogation - Priorités de calcul', date: '2023-09-22', coefficient: 1, maxScore: 20 },
  { id: 6, classId: 3, title: 'Contrôle - Géométrie dans l\'espace', date: '2023-10-12', coefficient: 2, maxScore: 20 },
  { id: 7, classId: 4, title: 'Évaluation - Nombres décimaux', date: '2023-10-08', coefficient: 2, maxScore: 20 },
];

// Generate mock grades for students
const generateGradesForEvaluation = (evaluationId, students) => {
  const grades = {};
  
  students.forEach(student => {
    // Generate a random grade between 0 and the max score (usually 20)
    // Weighted towards the middle of the range (bell curve)
    const rawGrade = (Math.random() + Math.random() + Math.random() + Math.random()) * 5;
    const grade = Math.min(20, Math.max(0, rawGrade));
    grades[student.id] = grade.toFixed(1);
  });
  
  return grades;
};

const EvaluationModal = ({ isOpen, mode, evaluation, classId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    evaluation || {
      classId: classId,
      title: '',
      date: new Date().toISOString().split('T')[0],
      coefficient: 1,
      maxScore: 20,
    }
  );
  
  useEffect(() => {
    if (evaluation) {
      setFormData(evaluation);
    } else if (classId) {
      setFormData({
        classId: classId,
        title: '',
        date: new Date().toISOString().split('T')[0],
        coefficient: 1,
        maxScore: 20,
      });
    }
  }, [evaluation, classId]);
  
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
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            {mode === 'add' ? 'Ajouter une évaluation' : 'Modifier l\'évaluation'}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-neutral-100">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
              Titre de l'évaluation
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="Ex: Contrôle - Fonctions linéaires"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-neutral-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="coefficient" className="block text-sm font-medium text-neutral-700">
                Coefficient
              </label>
              <input
                type="number"
                id="coefficient"
                name="coefficient"
                value={formData.coefficient}
                onChange={handleChange}
                min="1"
                max="5"
                required
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="maxScore" className="block text-sm font-medium text-neutral-700">
                Note maximale
              </label>
              <input
                type="number"
                id="maxScore"
                name="maxScore"
                value={formData.maxScore}
                onChange={handleChange}
                min="1"
                required
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
              {mode === 'add' ? 'Ajouter' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TeacherGrades: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState(TEACHER_CLASSES[0]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [evaluations, setEvaluations] = useState(MOCK_EVALUATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [editingGrades, setEditingGrades] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, evaluation: null });
  const [successMessage, setSuccessMessage] = useState('');

  // Generate students when selected class changes
  useEffect(() => {
    if (selectedClass) {
      setStudents(generateStudentsForClass(selectedClass.id));
      setSelectedEvaluation(null);
      setEditingGrades(false);
      setUnsavedChanges(false);
    }
  }, [selectedClass]);

  // Generate grades when selected evaluation changes
  useEffect(() => {
    if (selectedEvaluation && students.length > 0) {
      // Check if we already have grades for this evaluation
      if (!grades[selectedEvaluation.id]) {
        setGrades({
          ...grades,
          [selectedEvaluation.id]: generateGradesForEvaluation(selectedEvaluation.id, students)
        });
      }
      setEditingGrades(false);
      setUnsavedChanges(false);
    }
  }, [selectedEvaluation, students]);

  // Filter evaluations based on selected class
  const filteredEvaluations = evaluations.filter(
    (evaluation) => evaluation.classId === selectedClass.id
  );
  
  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassChange = (classId) => {
    const newClass = TEACHER_CLASSES.find((c) => c.id === parseInt(classId));
    if (newClass) {
      setSelectedClass(newClass);
    }
  };

  const handleEvaluationChange = (evaluationId) => {
    if (evaluationId) {
      const newEvaluation = evaluations.find((e) => e.id === parseInt(evaluationId));
      if (newEvaluation) {
        setSelectedEvaluation(newEvaluation);
      }
    } else {
      setSelectedEvaluation(null);
    }
  };

  const toggleEditingGrades = () => {
    if (editingGrades && unsavedChanges) {
      if (window.confirm('Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir annuler ?')) {
        // Reset grades to the previous state
        if (grades[selectedEvaluation.id]) {
          const originalGrades = grades[selectedEvaluation.id];
          setGrades({
            ...grades,
            [selectedEvaluation.id]: { ...originalGrades }
          });
        }
        setEditingGrades(false);
        setUnsavedChanges(false);
      }
    } else {
      setEditingGrades(!editingGrades);
    }
  };

  const handleGradeChange = (studentId, value) => {
    // Ensure the value is a valid number and within range
    let newValue = parseFloat(value);
    if (isNaN(newValue)) newValue = '';
    else if (newValue < 0) newValue = 0;
    else if (newValue > selectedEvaluation.maxScore) newValue = selectedEvaluation.maxScore;
    else newValue = newValue.toFixed(1);
    
    setGrades({
      ...grades,
      [selectedEvaluation.id]: {
        ...grades[selectedEvaluation.id],
        [studentId]: newValue.toString()
      }
    });
    setUnsavedChanges(true);
  };

  const saveGrades = () => {
    // In a real app, this would save to the backend
    console.log('Saving grades:', grades[selectedEvaluation.id]);
    setEditingGrades(false);
    setUnsavedChanges(false);
    setSuccessMessage('Notes enregistrées avec succès !');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleAddEvaluation = (evaluation) => {
    const newEvaluation = {
      ...evaluation,
      id: evaluations.length + 1,
    };
    setEvaluations([...evaluations, newEvaluation]);
    setSelectedEvaluation(newEvaluation);
    setModalState({ isOpen: false, mode: null, evaluation: null });
  };

  const handleEditEvaluation = (evaluation) => {
    setEvaluations(
      evaluations.map((e) => (e.id === evaluation.id ? { ...e, ...evaluation } : e))
    );
    setSelectedEvaluation({ ...selectedEvaluation, ...evaluation });
    setModalState({ isOpen: false, mode: null, evaluation: null });
  };

  const handleSubmitEvaluation = (formData) => {
    if (modalState.mode === 'add') {
      handleAddEvaluation(formData);
    } else {
      handleEditEvaluation(formData);
    }
  };

  // Calculate average grade for a student across all evaluations
  const calculateStudentAverage = (studentId) => {
    let totalWeightedGrade = 0;
    let totalCoefficient = 0;
    
    filteredEvaluations.forEach(evaluation => {
      if (grades[evaluation.id] && grades[evaluation.id][studentId]) {
        const grade = parseFloat(grades[evaluation.id][studentId]);
        if (!isNaN(grade)) {
          totalWeightedGrade += grade * evaluation.coefficient;
          totalCoefficient += evaluation.coefficient;
        }
      }
    });
    
    if (totalCoefficient === 0) return '-';
    return (totalWeightedGrade / totalCoefficient).toFixed(1);
  };

  // Calculate average grade for all students in the current evaluation
  const calculateEvaluationAverage = () => {
    if (!selectedEvaluation || !grades[selectedEvaluation.id]) return '-';
    
    const evaluationGrades = grades[selectedEvaluation.id];
    let total = 0;
    let count = 0;
    
    Object.values(evaluationGrades).forEach(grade => {
      const gradeValue = parseFloat(grade);
      if (!isNaN(gradeValue)) {
        total += gradeValue;
        count++;
      }
    });
    
    if (count === 0) return '-';
    return (total / count).toFixed(1);
  };
  
  // Calculate class average for all evaluations
  const calculateClassAverage = () => {
    let totalAverage = 0;
    let count = 0;
    
    filteredStudents.forEach(student => {
      const average = calculateStudentAverage(student.id);
      if (average !== '-') {
        totalAverage += parseFloat(average);
        count++;
      }
    });
    
    if (count === 0) return '-';
    return (totalAverage / count).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header with class & evaluation selectors */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div>
            <label htmlFor="class-selector" className="mb-1 block text-sm font-medium text-neutral-700">
              Classe
            </label>
            <div className="relative inline-block text-left">
              <select
                id="class-selector"
                value={selectedClass.id}
                onChange={(e) => handleClassChange(e.target.value)}
                className="block w-40 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {TEACHER_CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.subject}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="evaluation-selector" className="mb-1 block text-sm font-medium text-neutral-700">
              Évaluation
            </label>
            <div className="relative inline-block text-left">
              <select
                id="evaluation-selector"
                value={selectedEvaluation?.id || ''}
                onChange={(e) => handleEvaluationChange(e.target.value)}
                className="block w-64 truncate rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Sélectionnez une évaluation</option>
                {filteredEvaluations.map((evaluation) => (
                  <option key={evaluation.id} value={evaluation.id}>
                    {evaluation.title} ({new Date(evaluation.date).toLocaleDateString('fr-FR')})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setModalState({ isOpen: true, mode: 'add', evaluation: null })}
            className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </button>
          
          {selectedEvaluation && (
            <button
              onClick={() => setModalState({ isOpen: true, mode: 'edit', evaluation: selectedEvaluation })}
              className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </button>
          )}
        </div>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="animate-fade-in rounded-md bg-success/10 p-3 text-sm text-success">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            {successMessage}
          </div>
        </div>
      )}
      
      {selectedEvaluation ? (
        <div className="space-y-6">
          {/* Evaluation details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="card">
              <p className="text-sm font-medium text-neutral-500">Titre</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">{selectedEvaluation.title}</p>
            </div>
            <div className="card">
              <p className="text-sm font-medium text-neutral-500">Date</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">
                {new Date(selectedEvaluation.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="card">
              <p className="text-sm font-medium text-neutral-500">Coefficient</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">{selectedEvaluation.coefficient}</p>
            </div>
            <div className="card">
              <p className="text-sm font-medium text-neutral-500">Moyenne</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">
                {calculateEvaluationAverage()}/{selectedEvaluation.maxScore}
              </p>
            </div>
          </div>
          
          {/* Search and edit controls */}
          <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div className="relative w-full max-w-xs">
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
            
            <div className="flex space-x-2">
              {editingGrades ? (
                <>
                  <button
                    onClick={saveGrades}
                    disabled={!unsavedChanges}
                    className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      unsavedChanges
                        ? 'bg-success hover:bg-success/90 focus:ring-success'
                        : 'bg-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </button>
                  <button
                    onClick={toggleEditingGrades}
                    className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Annuler
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEditingGrades}
                  className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier les notes
                </button>
              )}
            </div>
          </div>
          
          {/* Students and grades table */}
          {grades[selectedEvaluation.id] ? (
            <div className="table-container overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="w-3/5">Élève</th>
                    <th scope="col" className="w-1/5 text-center">Note</th>
                    <th scope="col" className="w-1/5 text-center">Moyenne générale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="whitespace-nowrap py-4 pl-6 pr-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {student.avatar ? (
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                {student.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4 font-medium text-neutral-900">{student.name}</div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        {editingGrades ? (
                          <input
                            type="number"
                            value={grades[selectedEvaluation.id][student.id]}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            min="0"
                            max={selectedEvaluation.maxScore}
                            step="0.1"
                            className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        ) : (
                          <span className="font-medium">
                            {grades[selectedEvaluation.id][student.id]}/{selectedEvaluation.maxScore}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-center font-medium">
                        {calculateStudentAverage(student.id)}/{selectedEvaluation.maxScore}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Class average row */}
                  <tr className="bg-neutral-50">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 font-semibold">
                      Moyenne de la classe
                    </td>
                    <td className="px-3 py-4 text-center font-semibold">
                      {calculateEvaluationAverage()}/{selectedEvaluation.maxScore}
                    </td>
                    <td className="px-3 py-4 text-center font-semibold">
                      {calculateClassAverage()}/{selectedEvaluation.maxScore}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-md bg-neutral-50 p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
              <h3 className="mt-2 text-lg font-medium text-neutral-900">Aucune note disponible</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Les notes pour cette évaluation n'ont pas encore été saisies.
              </p>
              <div className="mt-6">
                <button
                  onClick={toggleEditingGrades}
                  className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Saisir les notes
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md bg-neutral-50 p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
          <h3 className="mt-2 text-lg font-medium text-neutral-900">Aucune évaluation sélectionnée</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Veuillez sélectionner une évaluation dans la liste déroulante ci-dessus ou créer une nouvelle évaluation.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setModalState({ isOpen: true, mode: 'add', evaluation: null })}
              className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle évaluation
            </button>
          </div>
        </div>
      )}
      
      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        evaluation={modalState.evaluation}
        classId={selectedClass.id}
        onClose={() => setModalState({ isOpen: false, mode: null, evaluation: null })}
        onSubmit={handleSubmitEvaluation}
      />
    </div>
  );
};

export default TeacherGrades;