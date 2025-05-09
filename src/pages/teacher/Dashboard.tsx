import React from 'react';
import { GraduationCap, Book } from 'lucide-react';
import Chart from '../../components/Chart';

const TeacherDashboard: React.FC = () => {
  // Mock data for demonstration
  const statistics = [
    {
      title: 'Élèves',
      value: '124',
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Classes attribuées',
      value: '5',
      icon: <Book className="h-8 w-8 text-warning" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {statistics.map((stat) => (
          <div key={stat.title} className="card overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">{stat.value}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row with charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Moyenne par classe</h3>
          <Chart type="bar" />
        </div>
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Évolution des notes</h3>
          <Chart type="line" />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;