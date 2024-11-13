import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Participant {
  dni: string;
  instagram: string;
}

interface ReservationData {
  eventDate: number;
  participants: Participant[];
}

interface ReservationState {
  isLoading: boolean;
  error: string | null;
  makeReservation: (data: ReservationData) => Promise<void>;
  clearError: () => void;
}

export const useReservations = create<ReservationState>((set) => ({
  isLoading: false,
  error: null,

  makeReservation: async (data: ReservationData) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      await axios.post(
        'http://localhost:3000/api/reservations',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success('¡Reserva enviada! Te hemos enviado un email con los detalles.');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error al realizar la reserva';
        set({ error: message });
        toast.error(message);
        throw new Error(message);
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));