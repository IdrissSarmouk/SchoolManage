import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Check, AlertTriangle, Pencil, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed

const EvaluationModal = ({ isOpen, mode, evaluation, classId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    evaluation || {
      classId: classId,
      title: '',
      date: new Date().toISOString().split('T')[0],
      coefficient: 1,
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
            {mode === 'add' ? "Ajouter une évaluation" : "Modifier l'évaluation"}
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

const TeacherGrades = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [editingGrades, setEditingGrades] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, evaluation: null });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teachers/${user.id}/classes`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch classes');
        
        const data = await response.json();
        setClasses(data);
        
        if (data.length > 0) {
          setSelectedClass(data[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchClasses();
    }
  }, [user]);

  // Fetch evaluations when selected class changes
  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!selectedClass) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/teachers/${user.id}/evaluations?classId=${selectedClass.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch evaluations');
        
        const data = await response.json();
        setEvaluations(data);
        setSelectedEvaluation(null);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    };

    if (user && user.id && selectedClass) {
      fetchEvaluations();
    }
  }, [user, selectedClass]);

  // Fetch students when selected class changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/teachers/${user.id}/classes/${selectedClass.id}/students`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (user && user.id && selectedClass) {
      fetchStudents();
    }
  }, [user, selectedClass]);

  // Fetch grades when selected evaluation changes (MAJ: utilise l'API correcte)
  useEffect(() => {
    const fetchGrades = async () => {
      if (!selectedEvaluation || !students.length) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/teachers/${user.id}/evaluations/${selectedEvaluation.id}/grades`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (!response.ok) throw new Error('Failed to fetch grades');
        const { grades: gradesList } = await response.json();

        // Transform API data into our internal format
        const gradesObj = {};
        students.forEach(student => {
          const found = gradesList.find(g => g.student_id === student.id);
          gradesObj[student.id] = {
            value: found && found.grade !== null ? found.grade.toString() : '',
            comment: found && found.remarks ? found.remarks : ''
          };
        });

        setGrades(prev => ({
          ...prev,
          [selectedEvaluation.id]: gradesObj
        }));

        // Si aucune note n'est disponible, activer automatiquement le mode d'édition
        const hasGrades = gradesList.some(g => g.grade !== null);
        setEditingGrades(!hasGrades);
        setUnsavedChanges(false);
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };

    if (user && user.id && selectedEvaluation && students.length > 0) {
      fetchGrades();
    }
    // eslint-disable-next-line
  }, [user, selectedClass, selectedEvaluation, students]);

  const handleClassChange = (classId) => {
    const newClass = classes.find((c) => c.id === parseInt(classId));
    if (newClass) {
      setSelectedClass(newClass);
      setSelectedEvaluation(null);
      setEditingGrades(false);
      setUnsavedChanges(false);
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
    else if (newValue > 20) newValue = 20;
    else newValue = newValue.toFixed(1);

    setGrades({
      ...grades,
      [selectedEvaluation.id]: {
        ...grades[selectedEvaluation.id],
        [studentId]: {
          ...grades[selectedEvaluation.id][studentId],
          value: newValue.toString()
        }
      }
    });
    setUnsavedChanges(true);
  };

  const handleCommentChange = (studentId, comment) => {
    setGrades({
      ...grades,
      [selectedEvaluation.id]: {
        ...grades[selectedEvaluation.id],
        [studentId]: {
          ...grades[selectedEvaluation.id][studentId],
          comment: comment
        }
      }
    });
    setUnsavedChanges(true);
  };

  // Sauvegarde et recharge les notes depuis l'API pour garantir la persistance
  const saveGrades = async () => {
    try {
      const gradePromises = students.map(student => {
        const studentGrade = grades[selectedEvaluation.id][student.id];
        if (!studentGrade || studentGrade.value === '') return null;

        return fetch(`http://localhost:3000/api/teachers/${user.id}/grades`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            studentId: student.id,
            evaluationId: selectedEvaluation.id,
            grade: parseFloat(studentGrade.value),
            remarks: studentGrade.comment
          })
        });
      });

      // Filter out null promises and execute all
      const validPromises = gradePromises.filter(p => p !== null);
      await Promise.all(validPromises);

      // Recharge les notes depuis l'API pour afficher les valeurs persistées
      const response = await fetch(
        `http://localhost:3000/api/teachers/${user.id}/evaluations/${selectedEvaluation.id}/grades`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.ok) {
        const { grades: gradesList } = await response.json();
        const gradesObj = {};
        students.forEach(student => {
          const found = gradesList.find(g => g.student_id === student.id);
          gradesObj[student.id] = {
            value: found && found.grade !== null ? found.grade.toString() : '',
            comment: found && found.remarks ? found.remarks : ''
          };
        });
        setGrades(prev => ({
          ...prev,
          [selectedEvaluation.id]: gradesObj
        }));
      }

      setEditingGrades(false);
      setUnsavedChanges(false);
      setSuccessMessage('Notes enregistrées avec succès !');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Erreur lors de l\'enregistrement des notes.');
    }
  };

  const handleAddEvaluation = async (evaluation) => {
    try {
      const response = await fetch(`http://localhost:3000/api/teachers/${user.id}/evaluations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: evaluation.title,
          date: evaluation.date,
          coefficient: evaluation.coefficient,
          classId: selectedClass.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create evaluation');
      }

      const result = await response.json();
      
      // Update evaluations list with the new evaluation
      const newEvaluation = result.evaluation;
      setEvaluations([...evaluations, newEvaluation]);
      setSelectedEvaluation(newEvaluation);
      setModalState({ isOpen: false, mode: null, evaluation: null });
      
      // Activer l'édition des notes directement pour la nouvelle évaluation
      setEditingGrades(true);
      
      setSuccessMessage('Évaluation créée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating evaluation:', error);
      alert('Erreur lors de la création de l\'évaluation.');
    }
  };

  // This would need a PUT endpoint that's not shown in the API list
  const handleEditEvaluation = (evaluation) => {
    // For now, let's just update the local state
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

  // Vérifier s'il y a des notes saisies ou non pour l'évaluation sélectionnée
  const hasGradesForSelectedEvaluation = () => {
    if (!selectedEvaluation || !grades[selectedEvaluation.id]) return false;
    return Object.values(grades[selectedEvaluation.id]).some(grade => grade.value && grade.value !== '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-neutral-600">Chargement...</p>
      </div>
    );
  }

  // Initialiser un objet de notes vide si nécessaire
  const initializeEmptyGrades = () => {
    if (selectedEvaluation && !grades[selectedEvaluation.id] && students.length > 0) {
      const emptyGrades = {};
      students.forEach(student => {
        emptyGrades[student.id] = { value: '', comment: '' };
      });
      setGrades(prev => ({
        ...prev,
        [selectedEvaluation.id]: emptyGrades
      }));
      return emptyGrades;
    }
    return grades[selectedEvaluation?.id] || {};
  };

  // S'assurer que l'objet grades est initialisé
  const currentGrades = selectedEvaluation ? (grades[selectedEvaluation.id] || initializeEmptyGrades()) : {};

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
                value={selectedClass?.id || ''}
                onChange={(e) => handleClassChange(e.target.value)}
                className="block w-40 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {classes.length === 0 ? (
                  <option value="">Aucune classe</option>
                ) : (
                  classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))
                )}
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
                disabled={!selectedClass}
              >
                <option value="">Sélectionnez une évaluation</option>
                {evaluations.map((evaluation) => (
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
            disabled={!selectedClass}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </button>
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
          </div>
          
          {/* Edit controls */}
          <div className="flex justify-end">
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
                  className="ml-2 inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
          
          {/* Students and grades table - toujours affiché, même s'il n'y a pas de notes */}
          {students.length > 0 ? (
            <div className="table-container overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="w-2/5">Élève</th>
                    <th scope="col" className="w-1/5 text-center">Note</th>
                    <th scope="col" className="w-2/5 text-center">Remarque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="whitespace-nowrap py-4 pl-6 pr-3">
                        <div className="flex items-center">
                          <div className="ml-4 font-medium text-neutral-900">
                            {student.first_name} {student.last_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        {editingGrades ? (
                          <input
                            type="number"
                            value={currentGrades[student.id]?.value || ''}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            min="0"
                            max="20"
                            step="0.1"
                            className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        ) : (
                          <span className="font-medium">
                            {currentGrades[student.id]?.value ? 
                              `${currentGrades[student.id].value}/20` : 
                              '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingGrades ? (
                          <input
                            type="text"
                            value={currentGrades[student.id]?.comment || ''}
                            onChange={(e) => handleCommentChange(student.id, e.target.value)}
                            className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Ajouter une remarque..."
                          />
                        ) : (
                          <span className="text-neutral-600">
                            {currentGrades[student.id]?.comment || "-"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-md bg-neutral-50 p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
              <h3 className="mt-2 text-lg font-medium text-neutral-900">Aucun élève</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Aucun élève n'est inscrit dans cette classe.
              </p>
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
          {selectedClass && (
            <div className="mt-6">
              <button
                onClick={() => setModalState({ isOpen: true, mode: 'add', evaluation: null })}
                className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle évaluation
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        evaluation={modalState.evaluation}
        classId={selectedClass?.id}
        onClose={() => setModalState({ isOpen: false, mode: null, evaluation: null })}
        onSubmit={handleSubmitEvaluation}
      />
    </div>
  );
};

export default TeacherGrades;