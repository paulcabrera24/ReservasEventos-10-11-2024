import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onToggle: () => void;
}

function LoginForm({ onToggle }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, isOnline } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      if (email === 'demo@example.com' && password === 'password123') {
        toast.success('Modo offline: Inicio de sesión exitoso');
      } else {
        toast.error('Credenciales inválidas en modo offline');
      }
      return;
    }

    try {
      await login(email, password);
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-8">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Ingresar
        </button>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Regístrate aquí
          </button>
        </p>
      </form>
    </>
  );
}

export default LoginForm;