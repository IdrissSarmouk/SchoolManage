import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarDays, 
  ClipboardList, 
  FileText, 
  Clock, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';

type NavigationItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigationItems: NavigationItem[] = [
    // Admin navigation
    { 
      name: 'Tableau de bord', 
      path: '/admin/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      roles: ['admin'] 
    },
    { 
      name: 'Enseignants', 
      path: '/admin/teachers', 
      icon: <Users className="h-5 w-5" />, 
      roles: ['admin'] 
    },
    { 
      name: 'Élèves', 
      path: '/admin/students', 
      icon: <GraduationCap className="h-5 w-5" />, 
      roles: ['admin'] 
    },

    
    // Teacher navigation
    { 
      name: 'Tableau de bord', 
      path: '/teacher/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      roles: ['teacher'] 
    },
    { 
      name: 'Notes', 
      path: '/teacher/grades', 
      icon: <FileText className="h-5 w-5" />, 
      roles: ['teacher'] 
    },
    { 
      name: 'Présences', 
      path: '/teacher/attendance', 
      icon: <Clock className="h-5 w-5" />, 
      roles: ['teacher'] 
    },
    { 
      name: 'Historique des élèves', 
      path: '/teacher/student-history', 
      icon: <ClipboardList className="h-5 w-5" />, 
      roles: ['teacher'] 
    },
    
    // Student navigation
    { 
      name: 'Tableau de bord', 
      path: '/student/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      roles: ['student'] 
    },
    { 
      name: 'Bulletin', 
      path: '/student/grades', 
      icon: <FileText className="h-5 w-5" />, 
      roles: ['student'] 
    },
    { 
      name: 'Calendrier', 
      path: '/student/calendar', 
      icon: <CalendarDays className="h-5 w-5" />, 
      roles: ['student'] 
    },
    { 
      name: 'Présences', 
      path: '/student/attendance', 
      icon: <Clock className="h-5 w-5" />, 
      roles: ['student'] 
    },
  ];

  const filteredNavigation = navigationItems.filter(
    item => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentRoute = filteredNavigation.find(item => location.pathname === item.path);
    return currentRoute ? currentRoute.name : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar - desktop */}
      <div className="fixed hidden h-full w-64 bg-white shadow-sm lg:block">
        <div className="flex h-16 items-center justify-center border-b border-neutral-200">
          <h1 className="text-xl font-bold text-primary">SchoolManager</h1>
        </div>
        
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full border-t border-neutral-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </div>
      
      {/* Header - mobile */}
      <header className="fixed z-20 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="mr-4 rounded-md p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className="text-lg font-bold text-primary">SchoolManager</h1>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-10 bg-neutral-900/50 lg:hidden" onClick={toggleMobileMenu}>
          <div 
            className="absolute h-full w-64 bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="rounded-md p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 p-2">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-200">
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-600">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-neutral-500">
                    {user?.role === 'admin' 
                      ? 'Administrateur' 
                      : user?.role === 'teacher'
                        ? 'Enseignant'
                        : 'Élève'}
                  </p>
                </div>
              </div>
            </div>
            
            <nav className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      toggleMobileMenu();
                    }}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </button>
                );
              })}
            </nav>
            
            <div className="absolute bottom-0 left-0 w-full border-t border-neutral-200 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="pt-16 lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900">{getCurrentPageTitle()}</h1>
          </div>
          
          {/* Page content */}
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;