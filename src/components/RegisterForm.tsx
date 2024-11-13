import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onToggle: () => void;
}

function RegisterForm({ onToggle }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, isOnline } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      toast.error('Registro no disponible en modo offline');
      return;
    }

    try {
      await register(email, password, name);
      toast.success('Registro exitoso');
      onToggle();
    } catch (error) {
      toast.error('Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Cargando...' : 'Registrarse'}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Inicia Sesión
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;