import React from 'react';
import { Users, GraduationCap, BookOpen, UserCheck, ArrowUp, ArrowDown } from 'lucide-react';
import Chart from '../../components/Chart';

const AdminDashboard: React.FC = () => {
  // Mock data for demonstration
  const statistics = [
    {
      title: 'Enseignants',
      value: '42',
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Élèves',
      value: '857',
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Classes',
      value: '28',
      change: '0',
      changeType: 'neutral',
      icon: <BookOpen className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Comptes Actifs',
      value: '703',
      icon: <UserCheck className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics cards */}
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
                    {stat.change} depuis le dernier trimestre
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-primary/10 p-3">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Répartition des élèves par niveau</h3>
          <Chart type="bar" />
        </div>
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Répartition des profs par niveau</h3>
          <Chart type="bar" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;