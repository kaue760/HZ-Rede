
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import AdminPage from './pages/AdminPage';
import GroupPage from './pages/GroupPage';
import Header from './components/layout/Header';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAdmin } = useAuth();
    if (!isAdmin) {
      return <Navigate to="/" />;
    }
    return <>{children}</>;
};


function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/payment/:packageId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/group" element={<GroupPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
