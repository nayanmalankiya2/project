import React from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import './App.css';

const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return <Login />;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <Login />;
  }
};

function App() {
  return (
    <AuthProvider>
      <DashboardRouter />
    </AuthProvider>
  );
}

export default App;
