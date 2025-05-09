import React, { useState, useEffect } from 'react';
import { Search, UserSearch, GraduationCap, Award, Clock, CalendarDays, AlertTriangle, BookOpen, History } from 'lucide-react';

// Mock data for students
const MOCK_STUDENTS = [
  {
    id: 1,
    name: 'Lucas Dupont',
    class: '3ème A',
    birthdate: '2008-05-12',
    parentInfo: {
      name: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      phone: '06 12 34 56 78',
    },
  },
  {
    id: 2,
    name: 'Emma Martin',
    class: '4ème B',
    birthdate: '2009-03-24',
    parentInfo: {
      name: 'Thomas Martin',
      email: 'thomas.martin@email.com',
      phone: '06 23 45 67 89',
    },
  },
  {
    id: 3,
    name: 'Noah Bernard',
    class: '6ème C',
    birthdate: '2011-09-15',
    parentInfo: {
      name: 'Sophie Bernard',
      email: 'sophie.bernard@email.com',
      phone: '06 34 56 78 90',
    },
  },
  {
    id: 4,
    name: 'Chloé Petit',
    class: '5ème A',
    birthdate: '2010-12-03',
    parentInfo: {
      name: 'Philippe Petit',
      email: 'philippe.petit@email.com',
      phone: '06 45 67 89 01',
    },
  },
  {
    id: 5,
    name: 'Hugo Laurent',
    class: '3ème B',
    birthdate: '2008-07-21',
    parentInfo: {
      name: 'Julie Laurent',
      email: 'julie.laurent@email.com',
      phone: '06 56 78 90 12',
    },
  },
];

// Generate mock grades for a student
const generateStudentGrades = (studentId) => {
  const subjects = [
    'Mathématiques',
    'Français',
    'Histoire-Géographie',
    'Sciences',
    'Anglais',
    'Éducation Physique',
  ];
  
  const grades = [];
  const now = new Date();
  
  // Generate grades for the past 3 months
  for (let i = 0; i < 3; i++) {
    const month = new Date(now);
    month.setMonth(month.getMonth() - i);
    
    subjects.forEach(subject => {
      const random = Math.random();
      const gradesCount = Math.floor(random * 3) + 1; // 1-3 grades per subject per month
      
      for (let j = 0; j < gradesCount; j++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const date = new Date(month.getFullYear(), month.getMonth(), day);
        
        // Generate a grade between a range, with distribution favoring the middle
        const rawGrade = (Math.random() + Math.random() + Math.random() + Math.random()) * 5;
        const grade = Math.min(20, Math.max(0, rawGrade));
        
        grades.push({
          id: `${studentId}-${subject}-${date.toISOString()}`,
          subject,
          date,
          grade: grade.toFixed(1),
          classAverage: (grade + (Math.random() * 4) - 2).toFixed(1),
          description: `Évaluation sur ${getRandomTopic(subject)}`,
          coefficient: Math.random() > 0.7 ? 2 : 1,
        });
      }
    });
  }
  
  // Sort by date, most recent first
  return grades.sort((a, b) => b.date - a.date);
};

// Helper to get random topic based on subject
const getRandomTopic = (subject) => {
  const topics = {
    'Mathématiques': ['les équations', 'la géométrie', 'les fractions', 'les pourcentages', 'la trigonométrie'],
    'Français': ['la dissertation', 'l\'analyse de texte', 'la poésie', 'la grammaire', 'la conjugaison'],
    'Histoire-Géographie': ['la Révolution française', 'la Seconde Guerre mondiale', 'la géographie de l\'Europe', 'les fleuves français', 'les régions'],
    'Sciences': ['la photosynthèse', 'les états de la matière', 'le système solaire', 'la génétique', 'les circuits électriques'],
    'Anglais': ['la compréhension écrite', 'l\'expression orale', 'la grammaire', 'le vocabulaire', 'la culture anglophone'],
    'Éducation Physique': ['l\'endurance', 'les sports collectifs', 'la gymnastique', 'la natation', 'l\'athlétisme'],
  };
  
  const subjectTopics = topics[subject] || ['le chapitre récent'];
  return subjectTopics[Math.floor(Math.random() * subjectTopics.length)];
};

// Generate mock attendance data for a student
const generateStudentAttendance = (studentId) => {
  const attendance = [];
  const now = new Date();
  
  // Generate attendance records for the past 3 months
  for (let i = 0; i < 3; i++) {
    const month = new Date(now);
    month.setMonth(month.getMonth() - i);
    
    // Generate 1-5 attendance records per month
    const recordsCount = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 0; j < recordsCount; j++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      
      const types = ['absent', 'late', 'excused'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      attendance.push({
        id: `${studentId}-${date.toISOString()}`,
        date,
        type,
        minutes: type === 'late' ? Math.floor(Math.random() * 30) + 5 : 0,
        reason: type === 'excused' ? getRandomExcuseReason() : '',
        subject: getRandomSubject(),
      });
    }
  }
  
  // Sort by date, most recent first
  return attendance.sort((a, b) => b.date - a.date);
};

// Helper to get random subject
const getRandomSubject = () => {
  const subjects = [
    'Mathématiques',
    'Français',
    'Histoire-Géographie',
    'Sciences',
    'Anglais',
    'Éducation Physique',
  ];
  
  return subjects[Math.floor(Math.random() * subjects.length)];
};

// Helper to get random excuse reason
const getRandomExcuseReason = () => {
  const reasons = [
    'Rendez-vous médical',
    'Maladie',
    'Raison familiale',
    'Rendez-vous orthodontiste',
    'Certificat médical fourni',
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Generate mock comments for a student
const generateStudentComments = (studentId) => {
  const comments = [];
  const now = new Date();
  
  // Generate comments for the past 3 months
  for (let i = 0; i < 3; i++) {
    const month = new Date(now);
    month.setMonth(month.getMonth() - i);
    
    // Generate 0-5 comments per month
    const commentsCount = Math.floor(Math.random() * 6);
    
    for (let j = 0; j < commentsCount; j++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      
      const types = ['positive', 'neutral', 'negative'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      comments.push({
        id: `${studentId}-comment-${date.toISOString()}`,
        date,
        type,
        subject: getRandomSubject(),
        comment: getRandomComment(type),
        teacherName: getRandomTeacherName(),
      });
    }
  }
  
  // Sort by date, most recent first
  return comments.sort((a, b) => b.date - a.date);
};

// Helper to get random teacher name
const getRandomTeacherName = () => {
  const teacherNames = [
    'Mme. Martin',
    'M. Dupont',
    'Mme. Bernard',
    'M. Petit',
    'Mme. Laurent',
    'M. Moreau',
  ];
  
  return teacherNames[Math.floor(Math.random() * teacherNames.length)];
};

// Helper to get random comment based on type
const getRandomComment = (type) => {
  const comments = {
    'positive': [
      'Excellent travail, continue ainsi !',
      'Très bonne participation en classe.',
      'Progrès significatifs ce trimestre.',
      'Travail sérieux et appliqué.',
      'Attitude exemplaire en classe.',
    ],
    'neutral': [
      'Travail correct mais peut mieux faire.',
      'Participation moyenne en classe.',
      'Résultats satisfaisants mais irréguliers.',
      'Doit approfondir certaines notions.',
      'Attention parfois dispersée.',
    ],
    'negative': [
      'Manque de travail personnel.',
      'Doit faire plus d\'efforts pour progresser.',
      'Attitude à améliorer en classe.',
      'Travail insuffisant ce trimestre.',
      'Nombreuses difficultés à surmonter.',
    ],
  };
  
  const typeComments = comments[type] || comments.neutral;
  return typeComments[Math.floor(Math.random() * typeComments.length)];
};

const StudentHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentData, setStudentData] = useState({
    grades: [],
    attendance: [],
    comments: [],
  });
  const [activeTab, setActiveTab] = useState('grades');
  
  // Filter students based on search query
  const filteredStudents = MOCK_STUDENTS.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Load student data when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      setStudentData({
        grades: generateStudentGrades(selectedStudent.id),
        attendance: generateStudentAttendance(selectedStudent.id),
        comments: generateStudentComments(selectedStudent.id),
      });
    }
  }, [selectedStudent]);
  
  // Calculate average grade by subject
  const calculateSubjectAverages = () => {
    const subjectTotals = {};
    const subjectCounts = {};
    
    studentData.grades.forEach(grade => {
      const { subject, grade: gradeValue, coefficient } = grade;
      const numericGrade = parseFloat(gradeValue);
      const coef = coefficient || 1;
      
      if (!subjectTotals[subject]) {
        subjectTotals[subject] = 0;
        subjectCounts[subject] = 0;
      }
      
      subjectTotals[subject] += numericGrade * coef;
      subjectCounts[subject] += coef;
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
  
  // Count attendance by type
  const countAttendanceByType = () => {
    const counts = {
      absent: 0,
      late: 0,
      excused: 0,
    };
    
    studentData.attendance.forEach(record => {
      counts[record.type]++;
    });
    
    return counts;
  };
  
  // Count comments by type
  const countCommentsByType = () => {
    const counts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    
    studentData.comments.forEach(comment => {
      counts[comment.type]++;
    });
    
    return counts;
  };
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  // Calculate stats for the student
  const subjectAverages = selectedStudent ? calculateSubjectAverages() : {};
  const overallAverage = selectedStudent ? calculateOverallAverage(subjectAverages) : '-';
  const attendanceCounts = selectedStudent ? countAttendanceByType() : { absent: 0, late: 0, excused: 0 };
  const commentCounts = selectedStudent ? countCommentsByType() : { positive: 0, neutral: 0, negative: 0 };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left sidebar - Student search and list */}
        <div className="lg:col-span-1">
          <div className="card">
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
                className="block w-full rounded-md border border-neutral-300 py-2 pl-10 text-sm placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="h-[calc(100vh-20rem)] overflow-y-auto">
              <div className="divide-y divide-neutral-100">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`flex w-full items-start py-3 text-left transition-colors first:pt-0 last:pb-0 ${
                      selectedStudent?.id === student.id
                        ? 'bg-primary/5'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="mr-3 h-10 w-10 flex-shrink-0">
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
                    <div>
                      <div className="font-medium text-neutral-900">{student.name}</div>
                      <div className="mt-1 text-xs text-neutral-500">{student.class}</div>
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
          </div>
        </div>
        
        {/* Right side - Student details */}
        <div className="lg:col-span-3">
          {selectedStudent ? (
            <div className="space-y-6">
              {/* Student information */}
              <div className="card">
                <div className="flex flex-col items-start sm:flex-row sm:items-center">
                  <div className="mr-6 h-16 w-16 flex-shrink-0">
                    {selectedStudent.avatar ? (
                      <img
                        src={selectedStudent.avatar}
                        alt={selectedStudent.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {selectedStudent.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex-grow sm:mt-0">
                    <h2 className="text-2xl font-bold text-neutral-900">{selectedStudent.name}</h2>
                    <div className="mt-1 flex flex-wrap items-center">
                      <span className="mr-3 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <GraduationCap className="mr-1 h-3 w-3" />
                        {selectedStudent.class}
                      </span>
                      <span className="mr-3 text-sm text-neutral-500">
                        Né(e) le {formatDate(selectedStudent.birthdate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 rounded-md bg-neutral-50 p-3 sm:mt-0">
                    <div className="text-xs font-medium text-neutral-500">Contact parent</div>
                    <div className="mt-1 text-sm font-medium text-neutral-900">{selectedStudent.parentInfo.name}</div>
                    <div className="mt-0.5 text-xs text-neutral-500">{selectedStudent.parentInfo.phone}</div>
                    <div className="text-xs text-neutral-500">{selectedStudent.parentInfo.email}</div>
                  </div>
                </div>
              </div>
              
              {/* Student stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="card bg-primary/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-neutral-500">Moyenne générale</p>
                      <p className="mt-1 text-2xl font-bold text-primary">{overallAverage}/20</p>
                    </div>
                    <Award className="h-10 w-10 text-primary/60" />
                  </div>
                </div>
                
                <div className="card bg-error/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-neutral-500">Absences</p>
                      <p className="mt-1 text-2xl font-bold text-error">
                        {attendanceCounts.absent + attendanceCounts.excused}
                      </p>
                    </div>
                    <AlertTriangle className="h-10 w-10 text-error/60" />
                  </div>
                </div>
                
                <div className="card bg-warning/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-neutral-500">Retards</p>
                      <p className="mt-1 text-2xl font-bold text-warning">{attendanceCounts.late}</p>
                    </div>
                    <Clock className="h-10 w-10 text-warning/60" />
                  </div>
                </div>
                
                <div className="card bg-success/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-neutral-500">Remarques positives</p>
                      <p className="mt-1 text-2xl font-bold text-success">{commentCounts.positive}</p>
                    </div>
                    <BookOpen className="h-10 w-10 text-success/60" />
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
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                    }`}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'attendance'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                    }`}
                  >
                    Absences et retards
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'comments'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                    }`}
                  >
                    Remarques
                  </button>
                </div>
              </div>
              
              {/* Tab content */}
              <div>
                {/* Grades tab */}
                {activeTab === 'grades' && (
                  <div className="space-y-6">
                    {/* Subject averages */}
                    <div className="card">
                      <h3 className="mb-4 text-lg font-semibold text-neutral-900">Moyennes par matière</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {Object.entries(subjectAverages).map(([subject, average]) => (
                          <div key={subject} className="rounded-md border border-neutral-200 p-3">
                            <p className="text-sm font-medium text-neutral-900">{subject}</p>
                            <p className="mt-1 text-xl font-bold text-primary">{average}/20</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Grades list */}
                    <div className="card">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-neutral-900">Historique des notes</h3>
                        <CalendarDays className="h-5 w-5 text-neutral-500" />
                      </div>
                      
                      {studentData.grades.length > 0 ? (
                        <div className="table-container overflow-x-auto">
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Matière</th>
                                <th scope="col">Évaluation</th>
                                <th scope="col">Coef</th>
                                <th scope="col">Note</th>
                                <th scope="col">Moy. classe</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                              {studentData.grades.map((grade) => (
                                <tr key={grade.id}>
                                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                                    {formatDate(grade.date)}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                                    {grade.subject}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-neutral-700">
                                    {grade.description}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-neutral-900">
                                    {grade.coefficient}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <span className={`
                                      ${parseFloat(grade.grade) >= 14 ? 'text-success' : ''}
                                      ${parseFloat(grade.grade) < 14 && parseFloat(grade.grade) >= 10 ? 'text-neutral-900' : ''}
                                      ${parseFloat(grade.grade) < 10 ? 'text-error' : ''}
                                    `}>
                                      {grade.grade}/20
                                    </span>
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                    {grade.classAverage}/20
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
                  <div className="card">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900">Absences et retards</h3>
                      <History className="h-5 w-5 text-neutral-500" />
                    </div>
                    
                    {studentData.attendance.length > 0 ? (
                      <div className="table-container overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Cours</th>
                              <th scope="col">Type</th>
                              <th scope="col">Détails</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {studentData.attendance.map((record) => (
                              <tr key={record.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                                  {formatDate(record.date)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                                  {record.subject}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                  {record.type === 'absent' && (
                                    <span className="inline-flex items-center rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-medium text-error">
                                      Absent(e)
                                    </span>
                                  )}
                                  {record.type === 'late' && (
                                    <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                                      Retard
                                    </span>
                                  )}
                                  {record.type === 'excused' && (
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                      Excusé(e)
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-700">
                                  {record.type === 'late' && `${record.minutes} minutes de retard`}
                                  {record.type === 'excused' && record.reason}
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
                
                {/* Comments tab */}
                {activeTab === 'comments' && (
                  <div className="card">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900">Remarques des enseignants</h3>
                      <BookOpen className="h-5 w-5 text-neutral-500" />
                    </div>
                    
                    {studentData.comments.length > 0 ? (
                      <div className="space-y-4">
                        {studentData.comments.map((comment) => (
                          <div key={comment.id} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="mr-2 font-medium text-neutral-900">{comment.subject}</span>
                                {comment.type === 'positive' && (
                                  <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                                    Positive
                                  </span>
                                )}
                                {comment.type === 'neutral' && (
                                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                    Neutre
                                  </span>
                                )}
                                {comment.type === 'negative' && (
                                  <span className="inline-flex items-center rounded-full bg-error/10 px-2 py-0.5 text-xs font-medium text-error">
                                    À améliorer
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-neutral-500">{formatDate(comment.date)}</div>
                            </div>
                            <p className="text-sm text-neutral-700">{comment.comment}</p>
                            <p className="mt-1 text-xs text-neutral-500">Par {comment.teacherName}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md bg-neutral-50 p-4 text-center text-sm text-neutral-500">
                        Aucune remarque enregistrée
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