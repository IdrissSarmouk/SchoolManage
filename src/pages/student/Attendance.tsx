import React, { useState } from 'react';
import { Calendar, Clock, File, Search, Filter, ChevronDown, X } from 'lucide-react';
import Chart from '../../components/Chart';

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Generate mock attendance data
const generateAttendanceData = () => {
  const attendanceRecords = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Generate for the past 6 months
  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const month = new Date(currentYear, currentMonth - monthOffset, 1);

    const absenceCount = Math.floor(Math.random() * 4);

    for (let i = 0; i < absenceCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const justified = Math.random() > 0.5;

      attendanceRecords.push({
        id: `absence-${monthOffset}-${i}`,
        type: 'absence',
        date: new Date(month.getFullYear(), month.getMonth(), day),
        justified,
        reason: justified ? getRandomJustificationReason() : '',
        subject: getRandomSubject(),
        reportedBy: getRandomTeacherName(),
      });
    }

    const lateCount = Math.floor(Math.random() * 6);

    for (let i = 0; i < lateCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const minutesLate = Math.floor(Math.random() * 26) + 5;
      const justified = Math.random() > 0.5;

      attendanceRecords.push({
        id: `late-${monthOffset}-${i}`,
        type: 'late',
        date: new Date(month.getFullYear(), month.getMonth(), day),
        minutesLate,
        justified,
        reason: justified ? getRandomJustificationReason() : '',
        subject: getRandomSubject(),
        reportedBy: getRandomTeacherName(),
      });
    }
  }

  return attendanceRecords.sort((a, b) => b.date - a.date);
};

const getRandomJustificationReason = () => {
  const reasons = ['Rendez-vous médical', 'Maladie', 'Problème de transport', 'Rendez-vous orthodontiste', 'Raison familiale'];
  return reasons[Math.floor(Math.random() * reasons.length)];
};

const getRandomSubject = () => {
  const subjects = ['Mathématiques', 'Français', 'Histoire-Géographie', 'Sciences', 'Anglais', 'Éducation Physique'];
  return subjects[Math.floor(Math.random() * subjects.length)];
};

const getRandomTeacherName = () => {
  const teacherNames = ['Mme. Martin', 'M. Bernard', 'Mme. Petit', 'M. Dubois', 'Mme. Laurent', 'M. Moreau'];
  return teacherNames[Math.floor(Math.random() * teacherNames.length)];
};

const MOCK_ATTENDANCE_DATA = {
  student: {
    name: 'Lucas Dupont',
    class: '3ème A',
    year: '2023-2024',
  },
  summary: {
    absenceDays: 8,
    justifiedAbsences: 5,
    unjustifiedAbsences: 3,
    lateDays: 12,
    justifiedLates: 7,
    unjustifiedLates: 5,
    attendance: '95%',
  },
  records: generateAttendanceData(),
  remarks: 'L’élève a fait des efforts notables au deuxième trimestre. Une vigilance est recommandée en mathématiques et en anglais.',
};

const AttendanceFilters = ({ filters, setFilters, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (name, value) => setLocalFilters({ ...localFilters, [name]: value });

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = { type: 'all', justified: 'all', period: 'all' };
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 z-10 mt-2 w-64 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-900">Filtres</h3>
        <button onClick={onClose} className="inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Type</label>
          <select value={localFilters.type} onChange={(e) => handleChange('type', e.target.value)} className="mt-1 block w-full rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-sm">
            <option value="all">Tous les types</option>
            <option value="absence">Absences</option>
            <option value="late">Retards</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Justification</label>
          <select value={localFilters.justified} onChange={(e) => handleChange('justified', e.target.value)} className="mt-1 block w-full rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-sm">
            <option value="all">Tous</option>
            <option value="justified">Justifiés</option>
            <option value="unjustified">Non justifiés</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Période</label>
          <select value={localFilters.period} onChange={(e) => handleChange('period', e.target.value)} className="mt-1 block w-full rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-sm">
            <option value="all">Toute l'année</option>
            <option value="trimester1">Trimestre 1</option>
            <option value="trimester2">Trimestre 2</option>
            <option value="trimester3">Trimestre 3</option>
            <option value="month1">Dernier mois</option>
            <option value="month3">3 derniers mois</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button onClick={handleReset} className="text-xs font-medium text-neutral-700 hover:text-neutral-900">Réinitialiser</button>
        <button onClick={handleApply} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white">Appliquer</button>
      </div>
    </div>
  );
};

const StudentAttendance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ type: 'all', justified: 'all', period: 'all' });

  const { student, summary, records, remarks } = MOCK_ATTENDANCE_DATA;

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.subject.toLowerCase().includes(searchQuery.toLowerCase()) || (record.reason && record.reason.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filters.type === 'all' || record.type === filters.type;
    const matchesJustified = filters.justified === 'all' || (filters.justified === 'justified' && record.justified) || (filters.justified === 'unjustified' && !record.justified);

    let matchesPeriod = true;
    const now = new Date();

    if (filters.period === 'month1') {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      matchesPeriod = record.date >= oneMonthAgo;
    } else if (filters.period === 'month3') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      matchesPeriod = record.date >= threeMonthsAgo;
    } else if (filters.period === 'trimester1') {
      const startDate = new Date(now.getFullYear(), 8, 1);
      const endDate = new Date(now.getFullYear(), 11, 31);
      matchesPeriod = record.date >= startDate && record.date <= endDate;
    } else if (filters.period === 'trimester2') {
      const startDate = new Date(now.getFullYear(), 0, 1);
      const endDate = new Date(now.getFullYear(), 2, 31);
      matchesPeriod = record.date >= startDate && record.date <= endDate;
    } else if (filters.period === 'trimester3') {
      const startDate = new Date(now.getFullYear(), 3, 1);
      const endDate = new Date(now.getFullYear(), 5, 30);
      matchesPeriod = record.date >= startDate && record.date <= endDate;
    }

    return matchesSearch && matchesType && matchesJustified && matchesPeriod;
  });

  const subjectCounts = {};
  records.forEach((record) => {
    subjectCounts[record.subject] = (subjectCounts[record.subject] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Student info */}
      <div className="card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{student.name}</h2>
            <p className="text-sm text-neutral-600">{student.class} | Année scolaire {student.year}</p>
          </div>
      
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p>Présence</p>
          <p className="text-3xl font-bold">{summary.attendance}</p>
        </div>
        <div className="card">
          <p>Absences</p>
          <p className="text-3xl font-bold">{summary.absenceDays} jours</p>
        </div>
        <div className="card">
          <p>Retards</p>
          <p className="text-3xl font-bold">{summary.lateDays}</p>
        </div>
        <div className="card">
          <p>Total non justifié</p>
          <p className="text-3xl font-bold">{summary.unjustifiedAbsences + summary.unjustifiedLates}</p>
        </div>
      </div>

      {/* Répartition par matière */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Répartition par matière</h3>
        <ul className="space-y-2">
          {Object.entries(subjectCounts).map(([subject, count]) => (
            <li key={subject} className="flex justify-between">
              <span>{subject}</span>
              <span>{count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Remarques */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Remarques</h3>
        <p>{remarks}</p>
      </div>
    </div>
  );
};

export default StudentAttendance;
