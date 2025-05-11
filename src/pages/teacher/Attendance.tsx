import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Search, Check, X, AlertTriangle, Save, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Attendance statuses
const ATTENDANCE_STATUSES = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  NONE: 'none'
};

const AttendanceCalendar = ({ currentDate, onDateChange }) => {
  // Get the first and last day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the day of the week of the first day (0 = Sunday)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Adjust to make Monday the first day of the week (0 = Monday)
  const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  // Calculate the number of days in the month
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Generate calendar days array with padding for days from previous and next months
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < adjustedFirstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }
  
  // Get month name and year
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long' });
  const year = currentDate.getFullYear();
  
  // Get day names starting with Monday
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Check if a day is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Check if a day is selected
  const isSelected = (date) => {
    if (!date) return false;
    return date.getDate() === currentDate.getDate();
  };
  
  // Go to previous month
  const goToPrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onDateChange(prevMonth);
  };
  
  // Go to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onDateChange(nextMonth);
  };
  
  // Go to today
  const goToToday = () => {
    onDateChange(new Date());
  };
  
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 capitalize">
            {monthName} {year}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={goToPrevMonth}
            className="inline-flex items-center rounded-md p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToToday}
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Aujourd'hui
          </button>
          <button
            onClick={goToNextMonth}
            className="inline-flex items-center rounded-md p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Day names row */}
        {dayNames.map((day, index) => (
          <div key={index} className="pb-1 text-center text-xs font-medium text-neutral-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              <button
                onClick={() => onDateChange(day)}
                className={`flex h-full w-full items-center justify-center rounded-md text-sm ${
                  isToday(day)
                    ? 'bg-primary/10 font-semibold text-primary'
                    : isSelected(day)
                    ? 'bg-primary font-semibold text-white'
                    : 'hover:bg-neutral-100'
                }`}
              >
                {day.getDate()}
              </button>
            ) : (
              <div className="h-full w-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TeacherAttendance = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAttendance, setEditingAttendance] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setSelectedClass(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchClasses();
  }, [user]);

  // Fetch students and attendance when class or date changes
  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      if (!selectedClass) return;

      try {
        // Fetch students
        const studentsRes = await fetch(
          `http://localhost:3000/api/teachers/${user.id}/classes/${selectedClass.id}/students`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!studentsRes.ok) throw new Error('Failed to fetch students');
        const studentsData = await studentsRes.json();
        setStudents(studentsData);

        // Fetch attendance
        const dateString = currentDate.toISOString().split('T')[0];
        const attendanceRes = await fetch(
          `http://localhost:3000/api/attendance/status/class/${selectedClass.id}?date=${dateString}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
        const attendanceData = await attendanceRes.json();
        
        // Format attendance data
        const formattedAttendance = {};
        attendanceData.forEach(record => {
          formattedAttendance[record.student_id] = {
            status: record.status || ATTENDANCE_STATUSES.NONE
          };
        });
        
        setAttendanceData(formattedAttendance);
        setEditingAttendance(false);
        setUnsavedChanges(false);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStudentsAndAttendance();
  }, [selectedClass, currentDate, user]);

  const handleClassChange = (classId) => {
    const newClass = classes.find(c => c.id === parseInt(classId));
    setSelectedClass(newClass);
  };

  const saveAttendance = async () => {
    try {
      const records = Object.entries(attendanceData).map(([studentId, data]) => ({
        studentId: parseInt(studentId),
        subjectId: selectedClass.subject_id,
        date: currentDate.toISOString().split('T')[0],
        status: data.status
      }));

      const response = await fetch('http://localhost:3000/api/attendance/bulk-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ records })
      });

      if (!response.ok) throw new Error('Failed to save attendance');
      
      setEditingAttendance(false);
      setUnsavedChanges(false);
      setSuccessMessage('Présences enregistrées avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleEditingAttendance = () => {
    if (editingAttendance && unsavedChanges) {
      if (window.confirm('Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir annuler ?')) {
        setEditingAttendance(false);
        setUnsavedChanges(false);
        // Refetch the attendance data to reset changes
        const fetchStudentsAndAttendance = async () => {
          if (!selectedClass) return;

          try {
            const dateString = currentDate.toISOString().split('T')[0];
            const attendanceRes = await fetch(
              `http://localhost:3000/api/attendance/status/class/${selectedClass.id}?date=${dateString}`,
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
            
            if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
            const attendanceData = await attendanceRes.json();
            
            // Format attendance data
            const formattedAttendance = {};
            attendanceData.forEach(record => {
              formattedAttendance[record.student_id] = {
                status: record.status || ATTENDANCE_STATUSES.NONE
              };
            });
            
            setAttendanceData(formattedAttendance);
          } catch (err) {
            setError(err.message);
          }
        };

        fetchStudentsAndAttendance();
      }
    } else {
      setEditingAttendance(!editingAttendance);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { status }
    }));
    setUnsavedChanges(true);
  };

  // Format the current date for display
  const formatCurrentDate = () => {
    return currentDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get attendance stats for the current view
  const getAttendanceStats = () => {
    if (!attendanceData) return { present: 0, absent: 0, late: 0, none: 0, total: 0 };
    
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      none: 0,
      total: Object.keys(attendanceData).length
    };
    
    Object.values(attendanceData).forEach(record => {
      stats[record.status]++;
    });
    
    return stats;
  };

  const stats = getAttendanceStats();

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex items-center text-red-600">
          <AlertTriangle className="mr-2 h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with class selector and date details */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div>
            <label htmlFor="class-selector" className="mb-1 block text-sm font-medium text-neutral-700">
              Classe
            </label>
            <div className="relative inline-block text-left">
              <select
                id="class-selector"
                value={selectedClass?.id}
                onChange={(e) => handleClassChange(e.target.value)}
                className="block w-40 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.subject_name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div>
            <p className="mb-1 text-sm font-medium text-neutral-700">Date</p>
            <p className="text-sm capitalize text-neutral-900">{formatCurrentDate()}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {editingAttendance ? (
            <>
              <button
                onClick={saveAttendance}
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
                onClick={toggleEditingAttendance}
                className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </button>
            </>
          ) : (
            <button
              onClick={toggleEditingAttendance}
              className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Check className="mr-2 h-4 w-4" />
              Modifier les présences
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
      
      {/* Attendance content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left side - Calendar */}
        <div className="lg:col-span-1">
          <AttendanceCalendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>
        
        {/* Right side - Attendance list */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Feuille de présence</h3>
              
              <div className="relative w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un élève..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border border-neutral-300 py-1.5 pl-10 text-sm placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            
            {/* Attendance statistics */}
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <div className="text-xs font-medium text-success">Présents</div>
                <div className="mt-1 text-2xl font-semibold text-success">{stats.present}</div>
              </div>
              <div className="rounded-lg bg-error/10 p-3">
                <div className="text-xs font-medium text-error">Absents</div>
                <div className="mt-1 text-2xl font-semibold text-error">{stats.absent}</div>
              </div>
              <div className="rounded-lg bg-warning/10 p-3">
                <div className="text-xs font-medium text-warning">En retard</div>
                <div className="mt-1 text-2xl font-semibold text-warning">{stats.late}</div>
              </div>
              <div className="rounded-lg bg-neutral-100 p-3">
                <div className="text-xs font-medium text-neutral-600">Total</div>
                <div className="mt-1 text-2xl font-semibold text-neutral-800">{stats.total}</div>
              </div>
            </div>
            
            {/* Attendance table */}
            <div className="table-container overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="w-1/2">Élève</th>
                    <th scope="col" className="w-1/2">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const attendance = attendanceData[student.id] || {
                        status: ATTENDANCE_STATUSES.NONE
                      };
                      
                      return (
                        <tr key={student.id}>
                          <td className="whitespace-nowrap py-4 pl-6 pr-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {student.avatar ? (
                                  <img
                                    src={student.avatar}
                                    alt={`${student.first_name} ${student.last_name}`}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    {student.first_name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 font-medium text-neutral-900">{student.first_name} {student.last_name}</div>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            {editingAttendance ? (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleAttendanceChange(student.id, ATTENDANCE_STATUSES.PRESENT)}
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                    attendance.status === ATTENDANCE_STATUSES.PRESENT
                                      ? 'bg-success/10 text-success ring-1 ring-success'
                                      : 'bg-neutral-100 text-neutral-700 hover:bg-success/10 hover:text-success'
                                  }`}
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Présent
                                </button>
                                <button
                                  onClick={() => handleAttendanceChange(student.id, ATTENDANCE_STATUSES.ABSENT)}
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                    attendance.status === ATTENDANCE_STATUSES.ABSENT
                                      ? 'bg-error/10 text-error ring-1 ring-error'
                                      : 'bg-neutral-100 text-neutral-700 hover:bg-error/10 hover:text-error'
                                  }`}
                                >
                                  <X className="mr-1 h-3 w-3" />
                                  Absent
                                </button>
                                <button
                                  onClick={() => handleAttendanceChange(student.id, ATTENDANCE_STATUSES.LATE)}
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                    attendance.status === ATTENDANCE_STATUSES.LATE
                                      ? 'bg-warning/10 text-warning ring-1 ring-warning'
                                      : 'bg-neutral-100 text-neutral-700 hover:bg-warning/10 hover:text-warning'
                                  }`}
                                >
                                  <Clock className="mr-1 h-3 w-3" />
                                  En retard
                                </button>
                              </div>
                            ) : (
                              <div>
                                {attendance.status === ATTENDANCE_STATUSES.PRESENT && (
                                  <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                                    <Check className="mr-1 h-3 w-3" />
                                    Présent
                                  </span>
                                )}
                                {attendance.status === ATTENDANCE_STATUSES.ABSENT && (
                                  <span className="inline-flex items-center rounded-full bg-error/10 px-3 py-1 text-xs font-medium text-error">
                                    <X className="mr-1 h-3 w-3" />
                                    Absent
                                  </span>
                                )}
                                {attendance.status === ATTENDANCE_STATUSES.LATE && (
                                  <span className="inline-flex items-center rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                                    <Clock className="mr-1 h-3 w-3" />
                                    En retard
                                  </span>
                                )}
                                {attendance.status === ATTENDANCE_STATUSES.NONE && (
                                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                                    Non défini
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-sm text-neutral-500">
                        Aucun élève trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;