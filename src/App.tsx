import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTeachers from './pages/admin/Teachers';
import AdminStudents from './pages/admin/Students';
import AdminClassAssignment from './pages/admin/ClassAssignment';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherGrades from './pages/teacher/Grades';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherStudentHistory from './pages/teacher/StudentHistory';
import StudentDashboard from './pages/student/Dashboard';
import StudentGrades from './pages/student/Grades';
import StudentCalendar from './pages/student/Calendar';
import StudentAttendance from './pages/student/Attendance';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Signup />} />

          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute 
                element={<Layout><AdminDashboard /></Layout>} 
                allowedRoles={['admin']} 
              />
            } 
          />
          <Route 
            path="/admin/teachers" 
            element={
              <ProtectedRoute 
                element={<Layout><AdminTeachers /></Layout>} 
                allowedRoles={['admin']} 
              />
            } 
          />
          <Route 
            path="/admin/students" 
            element={
              <ProtectedRoute 
                element={<Layout><AdminStudents /></Layout>} 
                allowedRoles={['admin']} 
              />
            } 
          />
          <Route 
            path="/admin/class-assignment" 
            element={
              <ProtectedRoute 
                element={<Layout><AdminClassAssignment /></Layout>} 
                allowedRoles={['admin']} 
              />
            } 
          />
          
          {/* Teacher Routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute 
                element={<Layout><TeacherDashboard /></Layout>} 
                allowedRoles={['teacher']} 
              />
            } 
          />
          <Route 
            path="/teacher/grades" 
            element={
              <ProtectedRoute 
                element={<Layout><TeacherGrades /></Layout>} 
                allowedRoles={['teacher']} 
              />
            } 
          />
          <Route 
            path="/teacher/attendance" 
            element={
              <ProtectedRoute 
                element={<Layout><TeacherAttendance /></Layout>} 
                allowedRoles={['teacher']} 
              />
            } 
          />
          <Route 
            path="/teacher/student-history" 
            element={
              <ProtectedRoute 
                element={<Layout><TeacherStudentHistory /></Layout>} 
                allowedRoles={['teacher']} 
              />
            } 
          />
          
          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute 
                element={<Layout><StudentDashboard /></Layout>} 
                allowedRoles={['student']} 
              />
            } 
          />
          <Route 
            path="/student/grades" 
            element={
              <ProtectedRoute 
                element={<Layout><StudentGrades /></Layout>} 
                allowedRoles={['student']} 
              />
            } 
          />
          <Route 
            path="/student/calendar" 
            element={
              <ProtectedRoute 
                element={<Layout><StudentCalendar /></Layout>} 
                allowedRoles={['student']} 
              />
            } 
          />
          <Route 
            path="/student/attendance" 
            element={
              <ProtectedRoute 
                element={<Layout><StudentAttendance /></Layout>} 
                allowedRoles={['student']} 
              />
            } 
          />
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;