import { Slot } from "../types";
import { getUpcomingDates, formatSpanishDate } from "../data";
import { CalendarDays, Clock, Lock, CheckCircle2 } from "lucide-react";

interface BookingCalendarProps {
  slots: Slot[];
  selectedDate: string;
  selectedSlot: Slot | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: Slot | null) => void;
}

export default function BookingCalendar({
  slots,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}: BookingCalendarProps) {
  
  // Seven upcoming customizable business days
  const upcomingDays = getUpcomingDates(7);

  // Group slots or filter slots for current selected date
  const dailySlots = slots.filter((s) => s.date === selectedDate);
  
  // Format day bubble labels
  const getDayInfo = (dateStr: string) => {
    const parts = dateStr.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const daysShort = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
    const monthsShort = [
      "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", 
      "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
    ];
    return {
      dayOfWeek: daysShort[d.getDay()],
      dayNumber: parts[2],
      month: monthsShort[d.getMonth()]
    };
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-premium">
      
      {/* Step Banner */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
          1
        </div>
        <div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Paso 1: Selecciona Día y Horario</h3>
          <p className="text-xs text-gray-500 font-medium">Agenda en tiempo real sincronizada clínicamente</p>
        </div>
      </div>

      {/* Date Horizontal Selector */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center space-x-2">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Días Laborales Disponibles</span>
        </label>
        
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 overflow-x-auto pb-1 scrollbar-custom">
          {upcomingDays.map((dateStr) => {
            const isActive = selectedDate === dateStr;
            const { dayOfWeek, dayNumber, month } = getDayInfo(dateStr);
            
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => {
                  onSelectDate(dateStr);
                  onSelectSlot(null); // Reset slot choice when date alters
                }}
                className={`flex flex-col items-center justify-center py-3.5 px-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/10 scale-102"
                    : "bg-gray-50 border-gray-200 text-slate-800 hover:border-teal-300 hover:bg-teal-50/50"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${isActive ? "text-teal-100" : "text-gray-400 font-mono"}`}>
                  {dayOfWeek}
                </span>
                <span className="text-2xl font-extrabold leading-none my-1">
                  {dayNumber}
                </span>
                <span className={`text-[9px] font-extrabold tracking-wider ${isActive ? "text-white" : "text-slate-500"}`}>
                  {month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hourly Slots Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Horas Disponibles ({formatSpanishDate(selectedDate)})</span>
        </label>

        {dailySlots.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No hay horarios disponibles configurados para este día.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dailySlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              
              if (slot.reserved) {
                return (
                  <div
                    key={slot.id}
                    title="Horario reservado por otro paciente"
                    className="flex items-center justify-center space-x-1.5 py-4 px-3 bg-gray-100 text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed select-none opacity-60"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span className="font-mono text-sm font-semibold line-through">
                      {slot.time}
                    </span>
                    <span className="text-[9px] font-bold font-sans tracking-wide bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase">
                      Bloqueado
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-600"
                      : "bg-white border-gray-200 text-slate-800 hover:border-teal-500 hover:text-teal-700"
                  }`}
                >
                  <span className="font-mono text-base font-bold">
                    {slot.time} hs
                  </span>
                  {isSelected ? (
                    <span className="text-[9px] text-teal-700 font-bold uppercase tracking-wider flex items-center mt-1">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 fill-teal-100 text-teal-700" />
                      Seleccionado
                    </span>
                  ) : (
                    <span className="text-[9px] text-teal-600 font-bold uppercase tracking-wider mt-1 opacity-0 hover:opacity-100">
                      Reservar
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Helper instruction */}
      <div className="mt-6 p-4 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs text-teal-950 flex items-start space-x-3">
        <div className="shrink-0 w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 animate-ping" />
        <p className="leading-relaxed">
          <strong>Bloqueo Inmediato:</strong> Al proceder con el siguiente paso, este turno queda temporalmente apartado para ti para asegurar que ningún otro paciente reserve la misma cita.
        </p>
      </div>

    </div>
  );
}
