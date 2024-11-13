import React from 'react';
import { Outlet } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-lg mb-4">
              <PartyPopper className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">EventHub Pro</h1>
            <p className="text-white/80 mt-2">Sistema de Reserva de Eventos</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;