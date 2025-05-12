import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [averageGrade, setAverageGrade] = useState<string | null>(null);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const avgRes = await fetch(`http://localhost:3000/api/student/${user.id}/general-average`);
        const avgData = await avgRes.json();

        const gradesRes = await fetch(`http://localhost:3000/api/student/${user.id}/grades`);
        const gradesData = await gradesRes.json();

        if (avgData && avgData.general_average) {
          setAverageGrade(`${avgData.general_average}/20`);
        }

        const formattedGrades = gradesData.map((grade: any, idx: number) => ({
          id: idx,
          subject: grade.subject,
          title: grade.title,
          date: new Date(grade.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
          grade: `${grade.grade}/20`,
        }));

        setRecentGrades(formattedGrades);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div>Chargement du tableau de bord...</div>;

  return (
    <div className="space-y-6">
      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Moyenne générale</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {averageGrade || 'Non disponible'}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Award className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent grades */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Notes récentes</h3>
        </div>

        <div className="divide-y divide-neutral-100">
          {recentGrades.length > 0 ? (
            recentGrades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-start justify-between py-3 first:pt-0 last:pb-0"
              >
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
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-600">Aucune note disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;