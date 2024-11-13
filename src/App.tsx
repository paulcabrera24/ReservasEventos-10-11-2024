import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Calendar from './pages/Calendar';
import AdminCalendar from './pages/admin/AdminCalendar';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import OnlineToggle from './components/OnlineToggle';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <OnlineToggle />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Rutas de usuario normal */}
            <Route path="/calendar" element={<Calendar />} />
            
            {/* Rutas de administrador */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Navigate to="/admin/calendar" replace />} />
              <Route path="/admin/calendar" element={<AdminCalendar />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;