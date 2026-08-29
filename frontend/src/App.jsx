import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ChangePassword } from './pages/ChangePassword';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminStores } from './pages/admin/AdminStores';
import { UserDashboard } from './pages/user/UserDashboard';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { Navbar } from './components/Navbar';

export const App = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-300">Loading RateHub...</p>
        </div>
      </div>
    );
  }

  const getDefaultRedirect = () => {
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    if (user.role === 'SYSTEM_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={getDefaultRedirect()} />

      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? getDefaultRedirect() : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? getDefaultRedirect() : <Signup />
        }
      />

      {/* Authenticated Routes (All Roles) */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* System Administrator Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
            <div className="min-h-screen bg-slate-50 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <AdminUsers />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
            <div className="min-h-screen bg-slate-50 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <AdminStores />
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Normal User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={['NORMAL_USER', 'SYSTEM_ADMIN']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Store Owner Routes */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STORE_OWNER', 'SYSTEM_ADMIN']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={getDefaultRedirect()} />
    </Routes>
  );
};

export default App;
