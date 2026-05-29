import React, { useState } from "react";
import { Pack, Slot, Patient, Booking, AdminStats } from "../types";
import { formatSpanishDate, getUpcomingDates } from "../data";
import { 
  TrendingUp, Coins, Users, Scale, Calendar, Sliders, 
  Plus, Trash2, Search, Check, RotateCcw, Clock, Shield, Star, RefreshCw
} from "lucide-react";

interface AdminPanelProps {
  packs: Pack[];
  setPacks: (packs: Pack[]) => void;
  slots: Slot[];
  setSlots: (slots: Slot[]) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
}

type AdminTab = "dashboard" | "bookings" | "patients" | "slots" | "packs";

export default function AdminPanel({
  packs,
  setPacks,
  slots,
  setSlots,
  bookings,
  setBookings,
  patients,
  setPatients,
}: AdminPanelProps) {
  const [activeTab, setActiveTab2] = useState<AdminTab>("dashboard");
  const [patientSearch, setPatientSearch] = useState("");

  // Safety confirmation states bypassing window.confirm iframe blocks
  const [confirmDeleteSlotId, setConfirmDeleteSlotId] = useState<string | null>(null);
  const [confirmDeleteBookingId, setConfirmDeleteBookingId] = useState<string | null>(null);
  const [confirmDeletePackId, setConfirmDeletePackId] = useState<string | null>(null);
  
  // Create New Pack Local states
  const [newPackName, setNewPackName] = useState("");
  const [newPackDesc, setNewPackDesc] = useState("");
  const [newPackPrice, setNewPackPrice] = useState("");
  const [newPackFeatures, setNewPackFeatures] = useState("");
  const [newPackTier, setNewPackTier] = useState<"basic" | "standard" | "premium">("standard");

  // Create New Slot Local states
  const [newSlotDate, setNewSlotDate] = useState(getUpcomingDates(7)[0]);
  const [newSlotTime, setNewSlotTime] = useState("08:00");

  const formatARS = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0
    }).format(price);
  };

  // ---------------------------------------------------------------------------
  // Calculations
  // ---------------------------------------------------------------------------
  const totalMonthlyRevenue = bookings
    .filter((b) => b.paymentStatus === "Completado")
    .reduce((sum, b) => sum + b.price, 0);

  const averagePatientWeight = patients.length > 0 
    ? Math.round((patients.reduce((sum, p) => sum + p.weight, 0) / patients.length) * 10) / 10
    : 0;

  // Distribution chart parameters
  const packCounts: { [key: string]: number } = {};
  packs.forEach((p) => { packCounts[p.name] = 0; });
  bookings.forEach((b) => {
    if (packCounts[b.packName] !== undefined) {
      packCounts[b.packName] += 1;
    } else {
      packCounts[b.packName] = 1;
    }
  });

  // ---------------------------------------------------------------------------
  // Slot Configuration Controls
  // ---------------------------------------------------------------------------
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime) return;

    const formattedTime = newSlotTime.trim();
    const id = `slot-${newSlotDate}-${formattedTime.replace(":", "")}`;

    // Avoid duplicate slot adding
    if (slots.some((s) => s.id === id)) {
      alert("Este horario ya existe para el día seleccionado.");
      return;
    }

    const newSlotItem: Slot = {
      id,
      date: newSlotDate,
      time: formattedTime,
      reserved: false,
    };

    setSlots([newSlotItem, ...slots]);
    alert(`Se agregó el horario clínico ${formattedTime} para el día ${newSlotDate}.`);
  };

  const handleRemoveSlot = (slotId: string) => {
    const slotObj = slots.find((s) => s.id === slotId);
    if (!slotObj) return;

    if (slotObj.reserved) {
      if (!confirm("Atención: El turno está reservado por un paciente. ¿Estás seguro de que deseas cancelarlo?")) {
        return;
      }
      // Also delete relevant booking if we drop the slot
      setBookings(bookings.filter((b) => b.slotId !== slotId));
    }

    setSlots(slots.filter((s) => s.id !== slotId));
  };

  // ---------------------------------------------------------------------------
  // Pack Configuration Controls
  // ---------------------------------------------------------------------------
  const handleAddPack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackName.trim() || !newPackPrice) {
      alert("Debe completar nombre y precio del pack.");
      return;
    }

    const featsArray = newPackFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const newPackItem: Pack = {
      id: "pack-" + Date.now(),
      name: newPackName,
      price: Number(newPackPrice),
      description: newPackDesc,
      features: featsArray.length > 0 ? featsArray : ["Consulta médica nutricional"],
      tier: newPackTier,
    };

    setPacks([...packs, newPackItem]);
    alert(`Se ha creado el plan "${newPackName}" de forma exitosa.`);
    
    // reset states
    setNewPackName("");
    setNewPackDesc("");
    setNewPackPrice("");
    setNewPackFeatures("");
  };

  const handleRemovePack = (packId: string) => {
    if (packs.length <= 1) {
      alert("Debe existir al menos un plan activo de consulta.");
      return;
    }
    if (confirm("¿Estás seguro de quitar permanentemente este Pack? No aparecerá más para contratación.")) {
      setPacks(packs.filter((p) => p.id !== packId));
    }
  };

  // Toggle pricing inline
  const handleEditPackPrice = (packId: string, newPriceStr: string) => {
    const updated = packs.map((p) => {
      if (p.id === packId) {
        return { ...p, price: Number(newPriceStr) || p.price };
      }
      return p;
    });
    setPacks(updated);
  };

  // ---------------------------------------------------------------------------
  // Bookings/Citas Control Actions
  // ---------------------------------------------------------------------------
  const handleTogglePayment = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        const nextStatus = b.paymentStatus === "Completado" ? "Pendiente" : "Completado";
        return { ...b, paymentStatus: nextStatus as any };
      }
      return b;
    });
    setBookings(updated);
  };

  const handleCancelBooking = (bookingId: string) => {
    const bookingObj = bookings.find((b) => b.id === bookingId);
    if (!bookingObj) return;

    if (confirm(`¿Clínica Andrea Piñeiro desea CANCELAR la cita del paciente ${bookingObj.patient.name}? Esto liberará el horario de forma pública.`)) {
      // 1. Release slot
      const updatedSlots = slots.map((s) => {
        if (s.id === bookingObj.slotId) {
          return { ...s, reserved: false, by: undefined };
        }
        return s;
      });
      setSlots(updatedSlots);

      // 2. Erase booking
      setBookings(bookings.filter((b) => b.id !== bookingId));
    }
  };

  const filteredPatients = patients.filter((p) => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.phone.includes(patientSearch)
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Admin bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">Consola de Control Clínico</h2>
              <p className="text-xs text-slate-400 mt-1">
                Monitoreo comercial, agenda médica y pacientes de Andrea Piñeiro &amp; Socio.
              </p>
            </div>
          </div>

          {/* Quick Stats Summary badges at Top */}
          <div className="flex items-center space-x-4 text-xs font-mono bg-slate-800 px-5 py-3 rounded-2xl border border-slate-700">
            <div>
              <span className="text-gray-400 block lowercase">Acreditación Real:</span>
              <span className="text-teal-400 font-bold text-sm tracking-wide">
                {formatARS(totalMonthlyRevenue)}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <span className="text-gray-400 block lowercase">Turnos Activos:</span>
              <span className="text-teal-400 font-bold text-sm">
                {bookings.length} reservados
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selector Row */}
        <div className="flex space-x-2 border-b border-gray-200 pb-px mb-8 overflow-x-auto scrollbar-custom">
          {[
            { id: "dashboard", label: "Estadísticas & KPIs", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "bookings", label: "Gestión de Turnos", icon: <Calendar className="w-4 h-4" /> },
            { id: "patients", label: "Registro de Pacientes", icon: <Users className="w-4 h-4" /> },
            { id: "slots", label: "Configurar Agenda", icon: <Clock className="w-4 h-4" /> },
            { id: "packs", label: "Planes & Costos", icon: <Sliders className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab2(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-3.5 rounded-t-2xl font-bold text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-teal-700 border-t border-x border-gray-200 shadow-sm relative -bottom-px"
                  : "text-gray-500 hover:text-teal-600 hover:bg-gray-100/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Modules Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-premium min-h-[500px]">
          
          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Metric Card 1 */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider opacity-80 block">Facturación Mensual</span>
                    <span className="text-3xl font-extrabold tracking-tight block mt-1">
                      {formatARS(totalMonthlyRevenue)}
                    </span>
                    <p className="text-[11px] mt-2 opacity-80">Ingresos netos por turnos confirmados</p>
                  </div>
                  <Coins className="w-10 h-10 opacity-30 shrink-0" />
                </div>

                {/* Metric Card 2 */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider opacity-80 block">Pacientes Registrados</span>
                    <span className="text-3xl font-extrabold tracking-tight block mt-1">
                      {patients.length} integrantes
                    </span>
                    <p className="text-[11px] mt-2 opacity-80">En proceso de cambio metabólico</p>
                  </div>
                  <Users className="w-10 h-10 opacity-30 shrink-0" />
                </div>

                {/* Metric Card 3 */}
                <div className="bg-teal-50 border border-teal-100 text-slate-800 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-teal-800 block">Pesaje Promedio</span>
                    <span className="text-3xl font-extrabold tracking-tight block text-teal-900 mt-1">
                      {averagePatientWeight} kg
                    </span>
                    <p className="text-[11px] text-gray-500 mt-2">Diagnóstico inicial de masa promedio</p>
                  </div>
                  <Scale className="w-10 h-10 text-teal-600 opacity-20 shrink-0" />
                </div>
              </div>

              {/* Graphic Chart representation (custom SVG) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                
                {/* SVG Revenue Graph Representation */}
                <div className="border border-gray-255/10 rounded-2xl p-5 bg-slate-50 border-gray-200">
                  <h4 className="font-serif font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    <span>Progreso de Pacientes & Citas</span>
                  </h4>
                  
                  {/* Real responsive SVG line diagram */}
                  <div className="h-44 w-full bg-white rounded-xl border border-gray-100 p-2 relative flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="65" x2="400" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      {/* Interactive Smooth Chart spline */}
                      <path
                        d="M 10,95 Q 80,65 150,85 T 280,40 T 400,15"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <g fill="#0f766e">
                        <circle cx="10" cy="95" r="4" />
                        <circle cx="150" cy="85" r="4" />
                        <circle cx="280" cy="40" r="4" />
                        <circle cx="400" cy="15" r="4" />
                      </g>
                    </svg>
                    <div className="absolute top-2 left-3 text-[10px] text-gray-400 font-mono">Conversión de Citas (94%)</div>
                    <div className="absolute bottom-1.5 left-2 right-2 flex justify-between text-[9px] font-bold text-gray-500 font-mono uppercase">
                      <span>Semana 1</span>
                      <span>Semana 2</span>
                      <span>Semana 3</span>
                      <span>Actual</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2 text-center">
                    Crecimiento exponencial en reservas gracias al nuevo embudo premium.
                  </p>
                </div>

                {/* Pack distribution table representation */}
                <div className="border border-gray-255/10 rounded-2xl p-5 bg-slate-50 border-gray-200 flex flex-col justify-between">
                  <h4 className="font-serif font-bold text-slate-900 text-base mb-4">
                    Distribución de Planes Contratados
                  </h4>

                  <div className="space-y-4 shrink-1">
                    {packs.map((pk) => {
                      const count = bookings.filter((b) => b.packName === pk.name).length;
                      const percentage = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;
                      
                      return (
                        <div key={pk.id} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-800">{pk.name}</span>
                            <span className="font-bold text-teal-700">{count} ( {percentage}% )</span>
                          </div>
                          {/* Segment bar */}
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-600 rounded-full transition-all"
                              style={{ width: `${Math.max(percentage, 3)}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-gray-400 font-mono text-center mt-4">
                    * El Pack Transformación Activa continúa liderando las conversiones.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* 2. MANAGE BOOKINGS/CITAS */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h4 className="font-serif font-bold text-slate-900 text-lg">Historial de Turnos de Consulta</h4>
                <p className="text-xs bg-teal-50 text-teal-800 border border-teal-100 font-semibold px-3 py-1.5 rounded-xl">
                  {bookings.length} turnos reservados totales
                </p>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  No hay reservas de pacientes registradas.
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-custom -mx-6 sm:mx-0">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-extrabold uppercase tracking-wider">
                        <th className="py-4.5 px-4 rounded-l-xl">Cita / Código</th>
                        <th className="py-4.5 px-4">Paciente</th>
                        <th className="py-4.5 px-4">Pack Contratado</th>
                        <th className="py-4.5 px-4">Pago / Estado</th>
                        <th className="py-4.5 px-4 rounded-r-xl text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((book) => {
                        return (
                          <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4">
                              <span className="font-mono text-[10px] uppercase bg-slate-900 text-white font-extrabold px-2 py-0.5 rounded block w-max">
                                {book.id}
                              </span>
                              <span className="text-slate-900 font-bold block mt-1.5 font-sans">
                                {book.date}
                              </span>
                              <span className="text-teal-600 font-medium font-mono text-[11px] block mt-0.5">
                                {book.time} hs
                              </span>
                            </td>
                            <td className="py-4 px-4 font-sans">
                              <div className="font-semibold text-slate-900">{book.patient.name}</div>
                              <div className="text-gray-400 text-[11px] mt-0.5">{book.patient.phone}</div>
                              <div className="text-gray-400 text-[11px]">{book.patient.email}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-slate-800">{book.packName}</div>
                              <div className="text-teal-700 font-bold mt-1 text-[11px]">
                                {formatARS(book.price)}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col space-y-1">
                                <span className={`w-max px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                                  book.paymentStatus === "Completado" 
                                    ? "bg-teal-100 text-teal-800" 
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                  {book.paymentStatus}
                                </span>
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wide">
                                  {book.paymentMethod}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-3">
                                {/* Toggle cash validation with beautiful clear and explicit status action messages */}
                                <button
                                  onClick={() => handleTogglePayment(book.id)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border flex items-center space-x-1 cursor-pointer ${
                                    book.paymentStatus === "Completado"
                                      ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                                      : "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100"
                                  }`}
                                >
                                  {book.paymentStatus === "Completado" ? (
                                    <>
                                      <RotateCcw className="w-3 h-3 text-amber-600" />
                                      <span>Marcar como Pendiente</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3 h-3 text-teal-600 font-extrabold" />
                                      <span>Marcar como Cobrado</span>
                                    </>
                                  )}
                                </button>
                                
                                {/* Non-blocking Sandbox-Safe Cita Deletion Confirmation */}
                                {confirmDeleteBookingId === book.id ? (
                                  <div className="flex items-center space-x-1 bg-rose-50 border border-rose-100 p-1 rounded-xl">
                                    <span className="text-[9px] text-rose-800 font-bold px-1 select-none">¿Eliminar?</span>
                                    <button
                                      onClick={() => {
                                        // 1. Release slot
                                        const updatedSlots = slots.map((s) => {
                                          if (s.id === book.slotId) {
                                            return { ...s, reserved: false, by: undefined };
                                          }
                                          return s;
                                        });
                                        setSlots(updatedSlots);
                                        // 2. Erase booking
                                        setBookings(bookings.filter((b) => b.id !== book.id));
                                        setConfirmDeleteBookingId(null);
                                      }}
                                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[9px] px-2 py-1 rounded cursor-pointer transition-all"
                                    >
                                      Sí
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteBookingId(null)}
                                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-extrabold text-[9px] px-2 py-1 rounded cursor-pointer"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDeleteBookingId(book.id)}
                                    title="Cancelar cita médica"
                                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 cursor-pointer transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. PATIENT MANAGEMENT INDEX */}
          {activeTab === "patients" && (
            <div className="space-y-6">
              
              {/* Search Block bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar pacientes por nombre o mail..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <p className="text-xs text-gray-500 font-mono tracking-wide">
                  Mostrando {filteredPatients.length} pacientes diagnostidados clínicamente
                </p>
              </div>

              {filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  Ningún paciente coincide con los términos de búsqueda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPatients.map((p) => (
                    <div key={p.id} className="border border-gray-200 rounded-2xl p-5 hover:border-teal-300 transition-all bg-slate-50/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-serif font-bold text-slate-900 text-base">{p.name}</h5>
                          <span className="text-[10px] font-mono text-gray-400 block mt-0.5">Paciente ID: {p.id}</span>
                        </div>
                        <span className="bg-teal-50 text-teal-800 border border-teal-100 font-mono text-xs px-2.5 py-1 rounded-lg font-bold">
                          {p.weight} kg
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 my-4 pt-4 border-t border-gray-200/60 text-xs">
                        <div>
                          <span className="text-gray-400 block uppercase font-bold text-[9px]">Correo:</span>
                          <span className="text-slate-800 font-semibold">{p.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase font-bold text-[9px]">Edad:</span>
                          <span className="text-slate-800 font-semibold">{p.age} años</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase font-bold text-[9px]">Teléfono (WA):</span>
                          <span className="text-slate-800 font-semibold">{p.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase font-bold text-[9px]">Fecha Registro:</span>
                          <span className="text-slate-800 font-semibold">{p.registeredAt}</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-gray-150 text-xs space-y-2">
                        <div>
                          <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-widest block">Objetivo Clínico:</span>
                          <span className="text-slate-700 leading-relaxed block mt-0.5 italic">{p.objective}</span>
                        </div>
                        {p.notes && (
                          <div className="pt-2 border-t border-gray-100">
                            <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-widest block">Observaciones Médicas:</span>
                            <p className="text-slate-600 leading-relaxed block mt-0.5 text-[11px]">{p.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* 4. CLINIC SLOT SCHEDULER AGENDA */}
          {activeTab === "slots" && (
            <div className="space-y-8">
              <div className="border border-gray-200 rounded-2xl p-5 bg-slate-50">
                <h4 className="font-serif font-bold text-slate-900 text-base mb-4">Agregar Nuevo Bloque de Cuentas a la Agenda</h4>
                
                <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Fecha Disponible</label>
                    <select
                      value={newSlotDate}
                      onChange={(e) => setNewSlotDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 border border-gray-300 rounded-xl bg-white outline-none"
                    >
                      {getUpcomingDates(7).map((date) => (
                        <option key={date} value={date}>
                          {formatSpanishDate(date)} ({date})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Hora (Formato HH:MM)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 08:30"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 border border-gray-300 rounded-xl bg-white outline-none font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar a la Agenda</span>
                  </button>
                </form>
              </div>

              {/* Display slots aggregated by dates */}
              <div className="space-y-6">
                <h4 className="font-serif font-bold text-slate-900 text-lg">Distribución Actual de Bloques Horarios</h4>

                <div className="space-y-6">
                  {getUpcomingDates(7).map((dateStr) => {
                    const sameDaySlots = slots.filter((s) => s.date === dateStr);
                    
                    return (
                      <div key={dateStr} className="border border-gray-200 rounded-2xl p-4.5 bg-white space-y-3 shadow-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="font-serif font-bold text-slate-900 text-sm">
                            {formatSpanishDate(dateStr)}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                            {sameDaySlots.length} horas configuradas
                          </span>
                        </div>

                        {sameDaySlots.length === 0 ? (
                          <div className="text-[11px] text-gray-400 italic py-2">
                            No hay turnos disponibles para recibir reservas en este día laboral. Agregue un horario en la consola superior.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {sameDaySlots.map((s) => (
                              <div
                                key={s.id}
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs text-slate-800 ${
                                  s.reserved 
                                    ? "bg-amber-50 border-amber-200 text-amber-900 font-semibold" 
                                    : "bg-teal-50/50 border-teal-200/50"
                                }`}
                              >
                                <span className="font-mono">{s.time}</span>
                                {s.reserved ? (
                                  <span className="text-[8px] bg-amber-200 text-amber-800 px-1 rounded uppercase tracking-wider font-extrabold">Ocupado</span>
                                ) : (
                                  <span className="text-[8px] bg-teal-100 text-teal-800 px-1 rounded uppercase tracking-wider font-extrabold">Libre</span>
                                )}
                                {confirmDeleteSlotId === s.id ? (
                                  <div className="flex items-center space-x-1 ml-1.5 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const slotObj = slots.find((obj) => obj.id === s.id);
                                        if (slotObj) {
                                          if (slotObj.reserved) {
                                            setBookings(bookings.filter((b) => b.slotId !== s.id));
                                          }
                                          setSlots(slots.filter((item) => item.id !== s.id));
                                        }
                                        setConfirmDeleteSlotId(null);
                                      }}
                                      className="bg-rose-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase hover:bg-rose-700 transition cursor-pointer"
                                    >
                                      Sí
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteSlotId(null)}
                                      className="bg-gray-200 text-slate-700 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase hover:bg-gray-300 transition cursor-pointer"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteSlotId(s.id)}
                                    className="text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded p-0.5 ml-1.5 transition-all cursor-pointer"
                                    title="Quitar de la agenda pública"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. GESTION DE PACKS / CATALOG */}
          {activeTab === "packs" && (
            <div className="space-y-8">
              
              {/* Add New Plan Panel */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-slate-50">
                <h4 className="font-serif font-bold text-slate-900 text-base mb-4">Agregar Nuevo Plan de Consultas al Catálogo</h4>
                
                <form onSubmit={handleAddPack} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-slate-500 font-semibold mb-1.5 uppercase tracking-wider">Nombre del Pack</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Pack Retorno Intensivo"
                        value={newPackName}
                        onChange={(e) => setNewPackName(e.target.value)}
                        className="w-full text-xs px-3.5 py-3 border border-gray-300 rounded-xl bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1.5 uppercase tracking-wider">Precio en Pesos (ARS)</label>
                      <input
                        type="number"
                        required
                        placeholder="Ej: 50000"
                        value={newPackPrice}
                        onChange={(e) => setNewPackPrice(e.target.value)}
                        className="w-full text-xs px-3.5 py-3 border border-gray-300 rounded-xl bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1.5 uppercase tracking-wider font-extrabold">Categoría / Rango</label>
                      <select
                        value={newPackTier}
                        onChange={(e) => setNewPackTier(e.target.value as any)}
                        className="w-full text-xs px-3.5 py-3 border border-gray-300 rounded-xl bg-white outline-none"
                      >
                        <option value="basic">Basic (Consulta Inicial)</option>
                        <option value="standard">Standard (Integral)</option>
                        <option value="premium">Premium Elite (VIP)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1.5 uppercase tracking-wider">Breve descripción emocional</label>
                    <input
                      type="text"
                      placeholder="Ej: Plan para el paciente que cuenta con poco tiempo pero prioriza consultas nutricionales."
                      value={newPackDesc}
                      onChange={(e) => setNewPackDesc(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 border border-gray-300 rounded-xl bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1.5 uppercase tracking-wider">
                      Benficios y Prestaciones (Uno por línea)
                    </label>
                    <textarea
                      placeholder="Ej:&#13;Consulta Médica Diagnóstica&#13;Consulta nutricional por Bioimpedancia&#13;Soporte vía WhatsApp por 2 semanas"
                      rows={3}
                      value={newPackFeatures}
                      onChange={(e) => setNewPackFeatures(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 border border-gray-300 rounded-xl bg-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Nuevo Pack de Consulta</span>
                  </button>
                </form>
              </div>

              {/* Current Packs listing */}
              <div className="space-y-6">
                <h4 className="font-serif font-bold text-slate-900 text-lg">Catálogo de Venta de Planes Activos</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packs.map((pk) => (
                    <div key={pk.id} className="border border-gray-200 rounded-2xl p-5 bg-white relative flex flex-col justify-between">
                      {pk.popular && (
                        <span className="absolute top-3 right-3 bg-teal-100 text-teal-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Exclusivo
                        </span>
                      )}

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-serif font-bold text-slate-900 text-[15px]">{pk.name}</h5>
                            <span className="text-[9px] font-mono bg-teal-50 text-teal-800 font-bold px-1.5 rounded uppercase">
                              {pk.tier}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-1 italic">{pk.description}</p>
                        </div>

                        {/* Fast Price Editor */}
                        <div className="border-t border-b border-gray-100 py-3 text-xs">
                          <label className="block text-gray-400 font-bold uppercase text-[9px] mb-1">EDITAR COSTO DE PARTICIPACIÓN</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 font-semibold font-mono">$</span>
                            <input
                              type="number"
                              defaultValue={pk.price}
                              onBlur={(e) => handleEditPackPrice(pk.id, e.target.value)}
                              className="w-full text-xs font-bold font-mono text-slate-900 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:bg-white"
                              title="Toca fuera para guardar precio"
                            />
                            <span className="text-gray-400 text-[9px] uppercase font-bold">ARS</span>
                          </div>
                        </div>

                        {/* List items representation */}
                        <div className="text-[11px] space-y-1.5 pt-1.5">
                          <p className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Prestaciones:</p>
                          {pk.features.map((feat, i) => (
                            <span key={i} className="block text-slate-600 font-medium pl-3 relative">
                              <span className="absolute left-0 top-1 w-1 h-1 bg-teal-600 rounded-full" />
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {confirmDeletePackId === pk.id ? (
                        <div className="mt-6 p-2 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-rose-800 font-bold select-none text-[11px]">¿Quitar Plan?</span>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (packs.length <= 1) {
                                  alert("Debe existir al menos un plan activo de consulta.");
                                  setConfirmDeletePackId(null);
                                  return;
                                }
                                setPacks(packs.filter((p) => p.id !== pk.id));
                                setConfirmDeletePackId(null);
                              }}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] px-2.5 py-1 rounded cursor-pointer animate-pulse"
                            >
                              Sí, borrar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePackId(null)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-extrabold text-[10px] px-2.5 py-1 rounded cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeletePackId(pk.id)}
                          className="w-full mt-6 py-2 border border-gray-200 hover:border-rose-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl cursor-pointer transition-all flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Quitar Plan</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
