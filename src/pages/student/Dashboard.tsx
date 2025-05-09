import React from 'react';
import { Award, GraduationCap, Clock } from 'lucide-react';
import Chart from '../../components/Chart';

const StudentDashboard: React.FC = () => {
  const studentInfo = {
    name: 'Lucas Dupont',
    class: '3ème A',
    averageGrade: '14.7/20',
    lastUpdate: 'Il y a 2 jours',
    classRank: '5e / 24',
  };

  const recentGrades = [
    {
      id: 1,
      subject: 'Mathématiques',
      title: 'Contrôle sur les fonctions',
      date: '10 novembre',
      grade: '16/20',
      classAverage: '13.2/20',
    },
    {
      id: 2,
      subject: 'Français',
      title: 'Commentaire de texte',
      date: '5 novembre',
      grade: '14/20',
      classAverage: '12.5/20',
    },
    {
      id: 3,
      subject: 'Anglais',
      title: 'Expression écrite',
      date: '3 novembre',
      grade: '15/20',
      classAverage: '14.1/20',
    },
    {
      id: 4,
      subject: 'Sciences',
      title: 'TP sur les circuits électriques',
      date: '28 octobre',
      grade: '18/20',
      classAverage: '15.7/20',
    },
  ];

  const attendanceInfo = {
    absences: 2,
    justified: 1,
    lates: 3,
    attendance: '95%',
  };

  return (
    <div className="space-y-6">
      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Moyenne générale</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{studentInfo.averageGrade}</p>
              <p className="mt-1 text-xs text-neutral-500">Mise à jour: {studentInfo.lastUpdate}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Award className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Classement</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{studentInfo.classRank}</p>
              <p className="mt-1 text-xs text-neutral-500">Dans la classe de {studentInfo.class}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Assiduité</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{attendanceInfo.attendance}</p>
              <p className="mt-1 text-xs text-neutral-500">{attendanceInfo.absences} absences, {attendanceInfo.lates} retards</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent grades and chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900">Notes récentes</h3>
            <button className="text-sm font-medium text-primary hover:text-primary-light">
              Voir tout
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <div className="flex items-center">
                    <span className="mr-2 font-medium text-neutral-900">{grade.subject}</span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                      {grade.date}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-700">{grade.title}</p>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <span className="text-lg font-bold text-primary">{grade.grade}</span>
                  <span className="text-xs text-neutral-500">Moy. classe: {grade.classAverage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Évolution des moyennes</h3>
          <Chart type="line" />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
