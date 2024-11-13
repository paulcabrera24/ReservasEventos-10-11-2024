import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, setDefaultOptions, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock, Users, ChevronLeft, ChevronRight, Bell, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ReservationModal from '../components/ReservationModal';
import toast from 'react-hot-toast';

// Configurar locale español
setDefaultOptions({ locale: es });

interface UserHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    roleDescription: string;
    profileImage?: string;
  };
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
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
        <div className="text-right">
          <p className="text-sm text-white/80">Hora actual</p>
          <p className="text-lg font-medium">{format(currentTime, 'HH:mm')}</p>
        </div>
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fullDates, setFullDates] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

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

    // Rellenar la última semana si es necesario
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

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isAvailableDay = (date: Date) => {
    if (isPastDate(date)) return false;
    if (!isWeekendDay(date)) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return !fullDates.includes(dateStr);
  };

  const handleDateClick = (date: Date) => {
    if (!isAvailableDay(date)) return;
    setSelectedDate(date);
    setIsReservationModalOpen(true);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  useEffect(() => {
    const simulatedFullDates = days
      .filter(day => isWeekendDay(day))
      .filter(() => Math.random() > 0.7)
      .map(date => format(date, 'yyyy-MM-dd'));
    
    setFullDates(simulatedFullDates);
  }, [currentDate]);

  if (!user) return null;

  const calendarGrid = generateCalendarGrid();
  const availableEvents = days.filter(day => isAvailableDay(day)).length;
  const totalReservations = Math.floor(Math.random() * 50); // Simulación de reservaciones totales

  return (
    <div className="space-y-6">
      {/* Header con información del usuario */}
      <UserHeader user={user} />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/90">Eventos Disponibles</p>
              <p className="text-2xl font-bold">{availableEvents}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-blue-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/90">Reservaciones Totales</p>
              <p className="text-2xl font-bold">{totalReservations}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-orange-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/90">Notificaciones</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <Bell className="w-5 h-5" />
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
              Calendario de Eventos
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
                const isAvailable = isAvailableDay(day);
                const isFull = fullDates.includes(format(day, 'yyyy-MM-dd'));
                const isPast = isPastDate(day);
                const dayId = format(day, 'yyyy-MM-dd');
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => (!isWeekend || isPast) && setShowTooltip(dayId)}
                    onMouseLeave={() => setShowTooltip(null)}
                    disabled={!isWeekend || isFull || isPast || !isCurrentMonth}
                    className={`
                      p-3 rounded-lg text-center transition-all relative
                      ${!isCurrentMonth ? 'opacity-25' : ''}
                      ${!isWeekend || isPast ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''}
                      ${isAvailable && isCurrentMonth
                        ? 'hover:bg-indigo-50 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md' 
                        : ''}
                      ${isFull ? 'bg-red-50 cursor-not-allowed' : ''}
                      ${selectedDate?.toDateString() === day.toDateString()
                        ? 'bg-indigo-100 ring-2 ring-indigo-600 ring-opacity-50'
                        : ''}
                    `}
                  >
                    <span className={`text-base font-medium ${isWeekend && !isPast && isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                      {format(day, 'd')}
                    </span>
                    {isWeekend && !isPast && isCurrentMonth && (
                      <div className="mt-1">
                        {!isFull ? (
                          <>
                            <div className="flex items-center justify-center gap-1 text-sm font-medium text-green-600">
                              <Clock className="w-4 h-4" />
                              <span>Disponible</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600">
                              <Users className="w-4 h-4" />
                              <span>20 cupos</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm font-medium text-red-500">
                            Lleno
                          </div>
                        )}
                      </div>
                    )}
                    
                    {showTooltip === dayId && (!isWeekend || isPast) && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                        {isPast ? 'Fecha pasada' : 'Solo disponible viernes y sábados'}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {selectedDate && (
        <ReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          selectedDate={selectedDate}
          availableSpots={20}
        />
      )}
    </div>
  );
};

export default Calendar;