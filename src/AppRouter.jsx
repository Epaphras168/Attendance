import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AttendanceScanner from './pages/AttendanceScanner';
import Reports from './pages/Reports';
import ManageStudents from './pages/ManageStudents';
import Layout from './components/ui/Layout';
import { Hash } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If role not allowed, redirect to default dashboard
    return (
      <Navigate
        to={currentUser.role === 'admin' ? '/admin' : '/teacher'}
        replace
      />
    );
  }

  return children;
};

export function AppRouter() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Root Route: redirect based on role */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate
                to={currentUser?.role === 'admin' ? '/admin' : '/teacher'}
                replace
              />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Teacher Dashboard */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout>
                <TeacherDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Attendance Scanner */}
        <Route
          path="/attendance-scanner"
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Layout>
                <AttendanceScanner />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Manage Students */}
        <Route
          path="/manage-students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <ManageStudents />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
