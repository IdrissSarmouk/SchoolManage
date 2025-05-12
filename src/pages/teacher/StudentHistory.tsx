import React, { useState, useEffect } from 'react';
import { Search, UserSearch, GraduationCap, Clock, CalendarDays, History, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StudentHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentData, setStudentData] = useState({
    grades: [],
    attendance: [],
  });
  const [activeTab, setActiveTab] = useState('grades');
  const [error, setError] = useState(null);

  // Fetch students taught by the logged-in teacher
  useEffect(() => {
    const fetchStudents = async () => {
      if (!isAuthenticated || user?.role !== 'teacher') return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/teachers/${user.id}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [isAuthenticated, user]);

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    (student.first_name + ' ' + student.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.class_id?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load student data when a student is selected
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!selectedStudent) return;
      
      setLoading(true);
      try {
        // Fetch student grades
        const gradesResponse = await fetch(`http://localhost:3000/api/student/${selectedStudent.id}/grades`);
        if (!gradesResponse.ok) throw new Error('Failed to fetch grades');
        const gradesData = await gradesResponse.json();
        
        // Fetch student attendance
        const attendanceResponse = await fetch(`http://localhost:3000/api/student/${selectedStudent.id}/attendance`);
        if (!attendanceResponse.ok) throw new Error('Failed to fetch attendance');
        const attendanceData = await attendanceResponse.json();
        
        setStudentData({
          grades: gradesData,
          attendance: attendanceData.attendance || [],
        });
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [selectedStudent]);

  // Calculate average grade by subject
  const calculateSubjectAverages = () => {
    const subjectTotals = {};
    const subjectCounts = {};
    
    studentData.grades.forEach(grade => {
      const { subject, grade: gradeValue, coefficient } = grade;
      const numericGrade = parseFloat(gradeValue);
      const coef = coefficient || 1;
      
      if (!isNaN(numericGrade)) {
        if (!subjectTotals[subject]) {
          subjectTotals[subject] = 0;
          subjectCounts[subject] = 0;
        }
        
        subjectTotals[subject] += numericGrade * coef;
        subjectCounts[subject] += coef;
      }
    });
    
    const averages = {};
    Object.keys(subjectTotals).forEach(subject => {
      if (subjectCounts[subject] > 0) {
        averages[subject] = (subjectTotals[subject] / subjectCounts[subject]).toFixed(1);
      }
    });
    
    return averages;
  };
  
  // Calculate overall average grade
  const calculateOverallAverage = (subjectAverages) => {
    const subjects = Object.keys(subjectAverages);
    if (subjects.length === 0) return '-';
    
    let total = 0;
    subjects.forEach(subject => {
      total += parseFloat(subjectAverages[subject]);
    });
    
    return (total / subjects.length).toFixed(1);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  // Get student full name
  const getStudentFullName = (student) => {
    return `${student.first_name} ${student.last_name}`;
  };

  // Calculate stats for the student
  const subjectAverages = selectedStudent ? calculateSubjectAverages() : {};
  const overallAverage = selectedStudent ? calculateOverallAverage(subjectAverages) : '-';

  // Count attendance by type
  const countAttendanceByType = () => {
    const counts = {
      absent: 0,
      late: 0,
      excused: 0,
    };
    
    studentData.attendance.forEach(record => {
      if (record.status === 'absent') counts.absent++;
      else if (record.status === 'late') counts.late++;
      else if (record.status === 'excused') counts.excused++;
    });
    
    return counts;
  };

  const attendanceCounts = selectedStudent ? countAttendanceByType() : { absent: 0, late: 0, excused: 0 };

  if (!isAuthenticated || user?.role !== 'teacher') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-neutral-900">Accès restreint</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Vous devez être connecté en tant qu'enseignant pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left sidebar - Student search and list */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Élèves</h3>
              <UserSearch className="h-5 w-5 text-neutral-500" />
            </div>
            
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un élève..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border border-neutral-300 py-2 pl-10 text-sm placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {loading && !selectedStudent ? (
              <div className="py-4 text-center text-sm text-neutral-500">
                Chargement des élèves...
              </div>
            ) : error && !selectedStudent ? (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            ) : (
              <div className="h-[calc(100vh-20rem)] overflow-y-auto">
                <div className="divide-y divide-neutral-100">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`flex w-full items-start py-3 text-left transition-colors first:pt-0 last:pb-0 ${
                        selectedStudent?.id === student.id
                          ? 'bg-blue-50'
                          : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="mr-3 h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          {student.first_name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{getStudentFullName(student)}</div>
                        <div className="mt-1 text-xs text-neutral-500">Classe {student.class_id}</div>
                      </div>
                    </button>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <div className="py-4 text-center text-sm text-neutral-500">
                      Aucun élève trouvé
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right side - Student details */}
        <div className="lg:col-span-3">
          {loading && selectedStudent ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-neutral-200 bg-white">
              <p className="text-neutral-500">Chargement des données...</p>
            </div>
          ) : error && selectedStudent ? (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : selectedStudent ? (
            <div className="space-y-6">
              {/* Student information */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col items-start sm:flex-row sm:items-center">
                  <div className="mr-6 h-16 w-16 flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl">
                      {selectedStudent.first_name.charAt(0)}
                    </div>
                  </div>
                  <div className="mt-4 flex-grow sm:mt-0">
                    <h2 className="text-2xl font-bold text-neutral-900">{getStudentFullName(selectedStudent)}</h2>
                    <div className="mt-1 flex flex-wrap items-center">
                      <span className="mr-3 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <GraduationCap className="mr-1 h-3 w-3" />
                        Classe {selectedStudent.class_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-neutral-200">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('grades')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'grades'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                    }`}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'attendance'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                    }`}
                  >
                    Absences et retards
                  </button>
                </div>
              </div>
              
              {/* Tab content */}
              <div>
                {/* Grades tab */}
                {activeTab === 'grades' && (
                  <div className="space-y-6">
                    {/* Grades list */}
                    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-neutral-900">Historique des notes</h3>
                        <CalendarDays className="h-5 w-5 text-neutral-500" />
                      </div>
                      
                      {studentData.grades.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Matière</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Évaluation</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Coef</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Note</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white">
                              {studentData.grades.map((grade, index) => (
                                <tr key={index}>
                                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                                    {formatDate(grade.date)}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                                    {grade.subject}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-neutral-700">
                                    {grade.title}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-neutral-900">
                                    {grade.coefficient}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <span className={`
                                      ${parseFloat(grade.grade) >= 14 ? 'text-green-600' : ''}
                                      ${parseFloat(grade.grade) < 14 && parseFloat(grade.grade) >= 10 ? 'text-neutral-900' : ''}
                                      ${parseFloat(grade.grade) < 10 ? 'text-red-600' : ''}
                                    `}>
                                      {grade.grade}/20
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="rounded-md bg-neutral-50 p-4 text-center text-sm text-neutral-500">
                          Aucune note enregistrée
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Attendance tab */}
                {activeTab === 'attendance' && (
                  <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900">Absences et retards</h3>
                      <History className="h-5 w-5 text-neutral-500" />
                    </div>
                    
                    {studentData.attendance.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                          <thead className="bg-neutral-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Cours</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 bg-white">
                            {studentData.attendance.map((record) => (
                              <tr key={record.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                                  {formatDate(record.date)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                                  {record.subject}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                  {record.status === 'absent' && (
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                      Absent(e)
                                    </span>
                                  )}
                                  {record.status === 'late' && (
                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                      Retard
                                    </span>
                                  )}
                                  {record.status === 'excused' && (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                      Justifié(e)
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="rounded-md bg-neutral-50 p-4 text-center text-sm text-neutral-500">
                        Aucune absence ou retard enregistré
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-neutral-50 p-8 text-center">
              <UserSearch className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-lg font-medium text-neutral-900">Aucun élève sélectionné</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Veuillez sélectionner un élève dans la liste pour afficher son historique.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHistory;