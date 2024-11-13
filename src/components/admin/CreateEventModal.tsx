import React, { useState } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { format, isAfter, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEvents } from '../../hooks/useEvents';
import LoadingOverlay from '../LoadingOverlay';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  selectedDate
}) => {
  const { createEvent, isLoading } = useEvents();
  const [date, setDate] = useState(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
  const [capacity, setCapacity] = useState('20');
  const [errors, setErrors] = useState<{ date?: string; capacity?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { date?: string; capacity?: string } = {};
    let isValid = true;

    // Validar fecha
    if (!date) {
      newErrors.date = 'La fecha es requerida';
      isValid = false;
    } else {
      const selectedDate = new Date(date);
      if (!isAfter(selectedDate, startOfToday())) {
        newErrors.date = 'La fecha debe ser posterior a hoy';
        isValid = false;
      }
    }

    // Validar capacidad
    const capacityNum = parseInt(capacity);
    if (!capacity || isNaN(capacityNum)) {
      newErrors.capacity = 'La capacidad debe ser un número válido';
      isValid = false;
    } else if (capacityNum < 1) {
      newErrors.capacity = 'La capacidad debe ser mayor a 0';
      isValid = false;
    } else if (capacityNum > 100) {
      newErrors.capacity = 'La capacidad máxima es 100';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createEvent({
        date,
        capacity: parseInt(capacity)
      });
      onClose();
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
        <LoadingOverlay isLoading={isLoading}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Crear Nuevo Evento</h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Fecha del Evento
                  </div>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    Capacidad
                  </div>
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  max="100"
                  className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Número de cupos disponibles"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Crear Evento
                </button>
              </div>
            </form>
          </div>
        </LoadingOverlay>
      </div>
    </div>
  );
};

export default CreateEventModal;