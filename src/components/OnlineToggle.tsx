import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const OnlineToggle = () => {
  const { isOnline, toggleOnline } = useAuth();

  return (
    <button
      onClick={toggleOnline}
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg z-50 transition-all ${
        isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
      }`}
      title={isOnline ? 'Cambiar a modo offline' : 'Cambiar a modo online'}
    >
      {isOnline ? (
        <Wifi className="w-6 h-6 text-white" />
      ) : (
        <WifiOff className="w-6 h-6 text-white" />
      )}
      <span className="sr-only">
        {isOnline ? 'Modo Online' : 'Modo Offline'}
      </span>
    </button>
  );
};

export default OnlineToggle;