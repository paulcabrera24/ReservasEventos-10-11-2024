import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, setDefaultOptions, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock, Users, ChevronLeft, ChevronRight, Bell, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Configurar locale español
setDefaultOptions({ locale: es });

const AdminCalendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Función para generar la cuadrícula del calendario
  const generateCalendarGrid = () => {
    const start = startOfWeek(monthStart);
    const weeks = [];
    let currentWeek = [];
    let currentDay = start;

    while (currentDay <= monthEnd) {
      currentWeek.push(currentDay);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDay = addDays(currentDay, 1);
    }

    while (currentWeek.length < 7) {
      currentWeek.push(addDays(currentDay, 1));
      currentDay = addDays(currentDay, 1);
    }
    weeks.push(currentWeek);

    return weeks;
  };

  const isWeekendDay = (date: Date) => {
    return date.getDay() === 5 || date.getDay() === 6; // 5 = Viernes, 6 = Sábado
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const calendarGrid = generateCalendarGrid();

  return (
    <div className="space-y-6">
      {/* Header con información del administrador */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{user.firstName[0]}</span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-sm text-white/80">{user.roleDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <div className="flex items-center justify-between text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Gestión de Eventos
            </h2>
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Nota informativa */}
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">
              <strong>Nota:</strong> Los eventos están programados automáticamente para todos los viernes y sábados.
              Cada evento tiene una capacidad fija de 20 personas.
            </p>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}

            {calendarGrid.map((week, weekIndex) => 
              week.map((day, dayIndex) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isWeekend = isWeekendDay(day);
                const isPast = day < new Date();
                const dayId = format(day, 'yyyy-MM-dd');
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      p-3 rounded-lg text-center transition-all relative
                      ${!isCurrentMonth ? 'opacity-25' : ''}
                      ${isPast ? 'bg-gray-50 opacity-50' : ''}
                      ${isWeekend && !isPast ? 'bg-indigo-50' : ''}
                    `}
                  >
                    <span className={`text-base font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                      {format(day, 'd')}
                    </span>
                    {isWeekend && !isPast && isCurrentMonth && (
                      <div className="mt-1">
                        <div className="flex items-center justify-center gap-1 text-xs font-medium text-indigo-600">
                          <Users className="w-3 h-3" />
                          <span>20 cupos</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 
        Funcionalidad de creación de eventos comentada
        Para rehabilitar la creación manual de eventos:
        1. Descomentar el estado isCreateModalOpen y su setter
        2. Descomentar el botón "Crear Evento"
        3. Descomentar el componente CreateEventModal
        4. Descomentar las rutas y controladores relacionados en el backend
      */}
      {/* <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        selectedDate={selectedDate}
      /> */}
    </div>
  );
};

export default AdminCalendar;