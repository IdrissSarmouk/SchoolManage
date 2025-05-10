import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, UserCheck, ArrowUp, ArrowDown } from 'lucide-react';
import Chart from '../../components/Chart';

// Types pour les données des graphiques
interface ClassData {
  class_name: string;
  student_count: number;
}

interface SubjectData {
  subject_name: string;
  teacher_count: number;
}

const AdminDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState([
    { title: 'Enseignants', value: '0', icon: <Users className="h-8 w-8 text-primary" /> },
    { title: 'Élèves', value: '0', icon: <GraduationCap className="h-8 w-8 text-primary" /> },
    { title: 'Classes', value: '0', icon: <BookOpen className="h-8 w-8 text-primary" /> },
    { title: 'Comptes Actifs', value: '0', icon: <UserCheck className="h-8 w-8 text-primary" /> },
  ]);
  
  // États pour les données des graphiques
  const [studentsByClass, setStudentsByClass] = useState<ClassData[]>([]);
  const [teachersBySubject, setTeachersBySubject] = useState<SubjectData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, studentsRes, classesRes, accountsRes, studentsByClassRes, teachersBySubjectRes] = await Promise.all([
          fetch('http://localhost:3000/api/teachers/count').then(res => res.json()),
          fetch('http://localhost:3000/api/student/count').then(res => res.json()),
          fetch('http://localhost:3000/api/classes/count').then(res => res.json()),
          fetch('http://localhost:3000/api/accounts/count').then(res => res.json()),
          fetch('http://localhost:3000/api/students/by-class').then(res => res.json()),
          fetch('http://localhost:3000/api/teachers/by-subject').then(res => res.json()),
        ]);

        setStatistics([
          { title: 'Enseignants', value: teachersRes.total_teachers.toString(), icon: <Users className="h-8 w-8 text-primary" /> },
          { title: 'Élèves', value: studentsRes.total_students.toString(), icon: <GraduationCap className="h-8 w-8 text-primary" /> },
          { title: 'Classes', value: classesRes.total_classes.toString(), icon: <BookOpen className="h-8 w-8 text-primary" /> },
          { title: 'Comptes Actifs', value: accountsRes.total_accounts.toString(), icon: <UserCheck className="h-8 w-8 text-primary" /> },
        ]);
        
        // Mise à jour des données pour les graphiques
        setStudentsByClass(studentsByClassRes);
        setTeachersBySubject(teachersBySubjectRes);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);
  
  // Préparation des données pour le graphique des élèves par classe
  const studentsByClassChartData = {
    labels: studentsByClass.map(item => item.class_name),
    values: studentsByClass.map(item => Number(item.student_count)),
  };
  
  // Préparation des données pour le graphique des profs par matière
  const teachersBySubjectChartData = {
    labels: teachersBySubject.map(item => item.subject_name),
    values: teachersBySubject.map(item => Number(item.teacher_count)),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat) => (
          <div key={stat.title} className="card overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">{stat.value}</p>
                <div className="mt-1 flex items-center">
                  {stat.changeType === 'increase' ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-success" />
                  ) : stat.changeType === 'decrease' ? (
                    <ArrowDown className="mr-1 h-4 w-4 text-error" />
                  ) : null}
                  <span
                    className={`text-sm ${
                      stat.changeType === 'increase'
                        ? 'text-success'
                        : stat.changeType === 'decrease'
                        ? 'text-error'
                        : 'text-neutral-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-primary/10 p-3">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Répartition des élèves par niveau</h3>
          {studentsByClass.length > 0 ? (
            <Chart type="bar" data={studentsByClassChartData} height={300} />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-neutral-500">Chargement des données...</p>
            </div>
          )}
        </div>
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Répartition des profs par matière</h3>
          {teachersBySubject.length > 0 ? (
            <Chart type="doughnut" data={teachersBySubjectChartData} height={300} />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-neutral-500">Chargement des données...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;