import React, { useEffect, useState } from 'react';
import { GraduationCap, Book, LineChart as LineChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const TeacherDashboard = () => {
  const [statistics, setStatistics] = useState([]);
  const [classAverages, setClassAverages] = useState([]);
  const [attendanceRates, setAttendanceRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the authenticated user from context
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      // Make sure we have a logged-in teacher with an ID
      if (!user || !user.id || user.role !== 'teacher') {
        setError('Utilisateur non authentifié ou non autorisé');
        setLoading(false);liu
        return;
      }
      
      const teacherId = user.id;
      
      try {
        // Fetch all data in parallel for better performance
        const [studentsRes, classesRes, averagesRes, attendanceRes] = await Promise.all([
          fetch(`http://localhost:3000/api/teachers/${teacherId}/students/count`),
          fetch(`http://localhost:3000/api/teachers/${teacherId}/classes/count`),
          fetch(`http://localhost:3000/api/teachers/${teacherId}/class-averages`),
          fetch(`http://localhost:3000/api/teachers/${teacherId}/attendance-rates`)
        ]);
        
        // Check for API errors
        if (!studentsRes.ok) throw new Error('Erreur de récupération des élèves');
        if (!classesRes.ok) throw new Error('Erreur de récupération des classes');
        if (!averagesRes.ok) throw new Error('Erreur de récupération des moyennes');
        if (!attendanceRes.ok) throw new Error('Erreur de récupération des taux d\'assiduité');
        
        // Parse all responses
        const studentsData = await studentsRes.json();
        const classesData = await classesRes.json();
        const averagesData = await averagesRes.json();
        const attendanceData = await attendanceRes.json();
        
        // Set statistics
        setStatistics([
          {
            title: 'Élèves',
            value: studentsData[0] ? studentsData[0].total_students : 0,
            icon: <GraduationCap className="h-8 w-8 text-primary" />,
          },
          {
            title: 'Classes attribuées',
            value: classesData.total_classes,
            icon: <Book className="h-8 w-8 text-warning" />,
          },
        ]);
        
        // Set chart data
        setClassAverages(averagesData);
        setAttendanceRates(attendanceData);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]); // Dependency on user to refetch if user changes

  // Custom chart colors
  const chartColors = {
    averages: '#4f46e5', // Indigo
    attendance: '#10b981', // Emerald
  };

  // Format chart data to ensure positive values and add color
  const formattedClassAverages = classAverages.map(item => ({
    name: item.class_name,
    value: Number(item.average_grade) || 0,
    fill: chartColors.averages
  }));

  const formattedAttendanceRates = attendanceRates.map(item => ({
    name: item.class_name,
    value: Number(item.attendance_rate) || 0,
    stroke: chartColors.attendance
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur: {error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Bienvenue, {user?.first_name || 'Enseignant'}
        </h2>
        <p className="text-neutral-600">
          Voici un résumé de vos statistiques d'enseignement. Utilisez le menu latéral pour accéder à toutes les fonctionnalités.
        </p>
      </div>
      
      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {statistics.map((stat) => (
          <div key={stat.title} className="bg-white shadow rounded-lg p-6">
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
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Class Averages Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Moyenne par classe</h3>
            <BarChartIcon className="h-5 w-5 text-neutral-500" />
          </div>
          
          {formattedClassAverages.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedClassAverages} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 20]} stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(2)}/20`, 'Moyenne']}
                    labelFormatter={(label) => `Classe: ${label}`}
                  />
                  <Bar dataKey="value" name="Moyenne" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-neutral-500">
              Aucune donnée de moyenne disponible
            </div>
          )}
        </div>
        
        {/* Attendance Rates Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Taux d'assiduité par classe</h3>
            <LineChartIcon className="h-5 w-5 text-neutral-500" />
          </div>
          
          {formattedAttendanceRates.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedAttendanceRates} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(2)}%`, 'Taux d\'assiduité']}
                    labelFormatter={(label) => `Classe: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Taux d'assiduité" 
                    stroke={chartColors.attendance}
                    strokeWidth={2}
                    dot={{ stroke: chartColors.attendance, strokeWidth: 2, r: 4 }}
                    activeDot={{ stroke: chartColors.attendance, strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-neutral-500">
              Aucune donnée d'assiduité disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;