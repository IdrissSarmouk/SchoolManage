import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Filter, ChevronDown, X } from 'lucide-react';

// Helper to get days in month
const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Helper to get first day of month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Helper to format date
const formatDate = (date) => {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Generate mock events
const generateEvents = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Generate events for the next 3 months
  const events = [];
  
  // Event types: class, exam, event
  const eventTypes = ['class', 'exam', 'event'];
  
  // Event titles
  const eventTitles = {
    exam: [
      'Contrôle de mathématiques',
      'Devoir de français',
      'Interrogation d\'anglais',
      'Test de sciences',
      'Évaluation d\'histoire-géographie',
    ],
    class: [
      'Cours de mathématiques',
      'Cours de français',
      'Cours d\'anglais',
      'Cours de sciences',
      'Cours d\'histoire-géographie',
      'Éducation physique',
    ],
    event: [
      'Sortie scolaire au musée',
      'Journée portes ouvertes',
      'Conseil de classe',
      'Réunion parents-professeurs',
      'Fête de l\'école',
      'Spectacle de fin d\'année',
      'Concours d\'éloquence',
    ],
  };
  
  // Locations
  const locations = [
    'Salle 101',
    'Salle 202',
    'Salle 305',
    'Gymnase',
    'CDI',
    'Amphithéâtre',
    'Laboratoire de sciences',
    'Salle informatique',
  ];
  
  // For each of the next 3 months
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const month = new Date(currentYear, currentMonth + monthOffset, 1);
    const daysInMonth = getDaysInMonth(month);
    
    // Generate 20-30 events per month
    const eventCount = 20 + Math.floor(Math.random() * 11);
    
    for (let i = 0; i < eventCount; i++) {
      // Random day of month
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      
      // Random event type
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      // Random title based on type
      const title = eventTitles[type][Math.floor(Math.random() * eventTitles[type].length)];
      
      // Random start hour (8-16)
      const startHour = 8 + Math.floor(Math.random() * 9);
      
      // Random duration (1-3 hours)
      const duration = type === 'class' ? 1 : 1 + Math.floor(Math.random() * 3);
      
      // Random location
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Create event date
      const eventDate = new Date(currentYear, currentMonth + monthOffset, day, startHour);
      
      events.push({
        id: `event-${monthOffset}-${i}`,
        title,
        type,
        date: eventDate,
        startTime: `${startHour}:00`,
        endTime: `${startHour + duration}:00`,
        duration,
        location,
        description: type === 'exam' ? 'N\'oubliez pas de réviser !' : '',
      });
    }
  }
  
  return events;
};

// Mock data for events
const MOCK_EVENTS = generateEvents();

const StudentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    eventType: 'all',
  });
  
  // Get dates for the current month view
  const getDatesForCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    
    // Get day of week of the first day (0 = Sunday)
    let firstDay = getFirstDayOfMonth(currentDate);
    
    // Adjust to start week on Monday (0 = Monday)
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const daysArray = [];
    
    // Add previous month days to fill the first week
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = getDaysInMonth(prevMonth);
    
    for (let i = 0; i < firstDay; i++) {
      const day = prevMonthDays - (firstDay - i - 1);
      daysArray.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
      });
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Add next month days to complete the grid
    const remainingDays = 42 - daysArray.length; // 6 rows * 7 days = 42
    
    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return daysArray;
  };
  
  // Filter events based on selected date and filters
  const getEventsForDate = (date) => {
    return MOCK_EVENTS.filter((event) => {
      const eventDate = new Date(event.date);
      const sameDate = 
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
      
      const matchesType = 
        filters.eventType === 'all' || 
        event.type === filters.eventType;
      
      return sameDate && matchesType;
    });
  };
  
  // Get events for the selected date
  const selectedDateEvents = getEventsForDate(selectedDate);
  
  // Get dates for the calendar
  const calendarDates = getDatesForCalendar();
  
  // Navigation functions
  const goToPreviousDay = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1));
  };
  
  const goToNextDay = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1));
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };
  
  // Day names in French, starting with Monday
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Event type titles
  const eventTypeTitles = {
    exam: 'Examen',
    class: 'Cours',
    event: 'Événement',
  };

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousDay}
            className="inline-flex items-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-bold text-neutral-900">
            {formatDate(selectedDate)}
          </h2>
          
          <button
            onClick={goToNextDay}
            className="inline-flex items-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <button
            onClick={goToToday}
            className="ml-2 rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            Aujourd'hui
          </button>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          
          {showFilters && (
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-neutral-900">Filtres</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Type d'événement
                </label>
                <select
                  value={filters.eventType}
                  onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-neutral-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">Tous les types</option>
                  <option value="class">Cours</option>
                  <option value="exam">Examens</option>
                  <option value="event">Événements</option>
                </select>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilters({ eventType: 'all' });
                    setShowFilters(false);
                  }}
                  className="text-xs font-medium text-primary hover:text-primary-light"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Day view */}
        <div className="card lg:col-span-3">
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents
                .sort((a, b) => {
                  const aTime = Number(a.startTime.split(':')[0]);
                  const bTime = Number(b.startTime.split(':')[0]);
                  return aTime - bTime;
                })
                .map((event) => (
                  <div
                    key={event.id}
                    className={`flex rounded-md border-l-4 p-3 ${
                      event.type === 'exam'
                        ? 'border-warning bg-warning/5'
                        : event.type === 'class'
                        ? 'border-primary bg-primary/5'
                        : 'border-success bg-success/5'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-lg font-semibold text-neutral-900">{event.title}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            event.type === 'exam'
                              ? 'bg-warning/10 text-warning'
                              : event.type === 'class'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-success/10 text-success'
                          }`}
                        >
                          {eventTypeTitles[event.type]}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      {event.description && (
                        <p className="mt-2 text-sm text-neutral-600">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="rounded-md bg-neutral-50 p-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-lg font-medium text-neutral-900">
                Aucun événement ce jour
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Il n'y a pas d'événements programmés pour cette date.
              </p>
            </div>
          )}
        </div>
        
        {/* Mini calendar */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">Calendrier</h3>
            <div className="mb-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                  );
                }}
                className="inline-flex items-center rounded-md p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="text-sm font-medium capitalize text-neutral-900">
                {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              
              <button
                onClick={() => {
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                  );
                }}
                className="inline-flex items-center rounded-md p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mb-2 grid grid-cols-7 gap-1">
              {dayNames.map((day, index) => (
                <div
                  key={index}
                  className="pb-1 text-center text-xs font-medium text-neutral-500"
                >
                  {day.charAt(0)}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDates.map((item, index) => {
                const { date, isCurrentMonth } = item;
                const isToday =
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();
                
                const isSelected =
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear();
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`rounded-md p-1 text-center text-xs ${
                      isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
                    } ${isToday ? 'font-bold text-primary' : ''} ${
                      isSelected ? 'bg-primary text-white' : 'hover:bg-neutral-100'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
            
            <hr className="my-4 border-neutral-200" />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-neutral-900">Légende</h4>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-xs text-neutral-600">Cours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-warning"></div>
                <span className="text-xs text-neutral-600">Examens</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-success"></div>
                <span className="text-xs text-neutral-600">Événements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;