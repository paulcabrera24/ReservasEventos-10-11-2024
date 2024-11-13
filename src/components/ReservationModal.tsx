import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, Calendar, Clock, Users, Plus, Trash, AlertTriangle } from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import LoadingOverlay from './LoadingOverlay';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  availableSpots: number;
}

interface Participant {
  dni: string;
  instagram: string;
}

interface FormErrors {
  count?: string;
  participants?: { dni?: string; instagram?: string }[];
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  availableSpots
}) => {
  const { makeReservation, isLoading } = useReservations();
  const [participants, setParticipants] = useState<Participant[]>([{ dni: '', instagram: '' }]);
  const [errors, setErrors] = useState<FormErrors>({});

  const participantCount = participants.length;

  const handleAddParticipant = () => {
    if (participantCount < availableSpots) {
      setParticipants([...participants, { dni: '', instagram: '' }]);
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index: number, field: keyof Participant, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = {
      ...newParticipants[index],
      [field]: value
    };
    setParticipants(newParticipants);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validar cantidad de participantes
    if (participantCount < 1) {
      newErrors.count = 'Debe haber al menos 1 participante';
      isValid = false;
    } else if (participantCount > availableSpots) {
      newErrors.count = `No puede exceder los ${availableSpots} cupos disponibles`;
      isValid = false;
    }

    // Validar datos de participantes
    const participantErrors = participants.map(p => {
      const errors: { dni?: string; instagram?: string } = {};
      
      if (!p.dni) {
        errors.dni = 'DNI requerido';
        isValid = false;
      } else if (!/^\d{8}$/.test(p.dni)) {
        errors.dni = 'DNI debe tener 8 dígitos';
        isValid = false;
      }

      if (!p.instagram) {
        errors.instagram = 'Instagram requerido';
        isValid = false;
      } else {
        // Validar formato de Instagram (acepta @usuario o URL completa)
        const instagramRegex = /^(?:@[\w.]{1,30}|https?:\/\/(?:www\.)?instagram\.com\/[\w.]{1,30}\/?$)/;
        if (!instagramRegex.test(p.instagram)) {
          errors.instagram = 'Formato inválido. Use @usuario o URL de Instagram';
          isValid = false;
        }
      }

      return errors;
    });

    if (participantErrors.some(e => Object.keys(e).length > 0)) {
      newErrors.participants = participantErrors;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await makeReservation({
        eventDate: selectedDate.getTime(),
        participants
      });
      onClose();
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative overflow-hidden">
        <LoadingOverlay isLoading={isLoading}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Confirmar Reserva</h2>
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
            <div className="space-y-6">
              {/* Información del evento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fecha del Evento</p>
                    <p className="text-base font-semibold text-gray-900">
                      {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Horario</p>
                    <p className="text-base font-semibold text-gray-900">8:00 PM - 11:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cupos Disponibles</p>
                    <p className="text-base font-semibold text-gray-900">{availableSpots} cupos</p>
                  </div>
                </div>
              </div>

              {/* Formulario de participantes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Participantes</h3>
                  <button
                    onClick={handleAddParticipant}
                    disabled={participants.length >= availableSpots}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Participante
                  </button>
                </div>

                {/* Lista de participantes con scroll */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {participants.map((participant, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          Participante {index + 1}
                        </h4>
                        {participants.length > 1 && (
                          <button
                            onClick={() => handleRemoveParticipant(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            DNI
                          </label>
                          <input
                            type="text"
                            value={participant.dni}
                            onChange={(e) => handleParticipantChange(index, 'dni', e.target.value)}
                            maxLength={8}
                            className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                              errors.participants?.[index]?.dni
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                            placeholder="12345678"
                          />
                          {errors.participants?.[index]?.dni && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.participants[index].dni}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instagram
                          </label>
                          <input
                            type="text"
                            value={participant.instagram}
                            onChange={(e) => handleParticipantChange(index, 'instagram', e.target.value)}
                            className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                              errors.participants?.[index]?.instagram
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                            placeholder="@usuario"
                          />
                          {errors.participants?.[index]?.instagram && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.participants[index].instagram}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aviso */}
              <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Importante</p>
                  <p className="text-sm text-amber-700">
                    Al confirmar tu reserva, recibirás un email con los detalles del evento.
                    La reserva quedará pendiente de aprobación.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        </LoadingOverlay>
      </div>
    </div>
  );
};

export default ReservationModal;