import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Event {
  id: number;
  date: string;
  capacity: number;
  availableSpots: number;
  isFull: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateEventData {
  date: string;
  capacity: number;
}

interface EventsState {
  isLoading: boolean;
  error: string | null;
  createEvent: (data: CreateEventData) => Promise<void>;
  clearError: () => void;
}

export const useEvents = create<EventsState>((set) => ({
  isLoading: false,
  error: null,

  createEvent: async (data: CreateEventData) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      await axios.post(
        'http://localhost:3000/api/events',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success('Evento creado exitosamente');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error al crear el evento';
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