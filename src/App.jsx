import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import FindDoctor from './pages/FindDoctor';
import FindClinic from './pages/FindClinic';
import Chat from './pages/Chat';
import Marketplace from './pages/Marketplace';
import FindPharmacy from './pages/FindPharmacy';
import Dependents from './pages/Dependents';
import MyAccount from './pages/MyAccount';
import Settings from './pages/Settings';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<Navigate to="/login" replace />} />

            {/* Protected dashboard routes */}
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="find-doctor" element={<FindDoctor />} />
              <Route path="find-clinic" element={<FindClinic />} />
              <Route path="chat" element={<Chat />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="find-pharmacy" element={<FindPharmacy />} />
              <Route path="dependents" element={<Dependents />} />
              <Route path="account" element={<MyAccount />} />
              <Route path="settings" element={<Settings />} />
              <Route path="support" element={<Support />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
