import React, { useState, useEffect } from "react";
import { Pack, Slot, Patient, Booking } from "./types";
import { 
  INITIAL_PACKS, generateDefaultSlots, INITIAL_PATIENTS, 
  INITIAL_BOOKINGS, getUpcomingDates, FREQUENT_QUESTIONS 
} from "./data";

// Import Custom Healthcare Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Packs from "./components/Packs";
import BookingCalendar from "./components/BookingCalendar";
import BookingForm from "./components/BookingForm";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";

// Motion animations for native page transition feeling
import { motion, AnimatePresence } from "motion/react";

// Icons for interactive visual accents and routing structure
import { 
  ChevronDown, ChevronUp, Sparkles, AlertCircle, 
  CalendarRange, Shield, User, ArrowLeft, Search, HelpCircle, 
  ArrowRight, Phone, MessageSquare, ClipboardCheck, Lock
} from "lucide-react";

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return sessionStorage.getItem("pineiro_admin_auth") === "true";
  });
  const adminEmail = "dr.andrea.pineiro@cliniq.co";

  // Databases states synced with Local Storage
  const [packs, setPacks] = useState<Pack[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Selection states
  const [selectedPackId, setSelectedPackId] = useState("pack-2"); // Default popular standard plan
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // checkout trigger modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPatientForm, setPendingPatientForm] = useState<any | null>(null);

  // Routing state mapped to #/inicio, #/reservar, #/preguntas, #/admin
  const [currentRoute, setCurrentRoute] = useState<string>("inicio");

  // Accordion state for FAQs
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [faqQuery, setFaqQuery] = useState("");

  // Secret admin PIN login inline form values
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminPinError, setAdminPinError] = useState("");

  // ---------------------------------------------------------------------------
  // INITIAL SEEDING OR FETCHING FROM LOCALSTORAGE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // 1. Packs Catalog
    const storedPacks = localStorage.getItem("pineiro_packs");
    if (storedPacks) {
      setPacks(JSON.parse(storedPacks));
    } else {
      setPacks(INITIAL_PACKS);
      localStorage.setItem("pineiro_packs", JSON.stringify(INITIAL_PACKS));
    }

    // 2. Upcoming dates
    const dates = getUpcomingDates(7);
    setSelectedDate(dates[0]); // Tomorrow as default date selection

    // 3. Hourly slots calendar
    const storedSlots = localStorage.getItem("pineiro_slots");
    if (storedSlots) {
      setSlots(JSON.parse(storedSlots));
    } else {
      const generated = generateDefaultSlots();
      setSlots(generated);
      localStorage.setItem("pineiro_slots", JSON.stringify(generated));
    }

    // 4. Patients ledger database
    const storedPatients = localStorage.getItem("pineiro_patients");
    const parsedPatients = storedPatients ? JSON.parse(storedPatients) : INITIAL_PATIENTS;
    setPatients(parsedPatients);
    if (!storedPatients) {
      localStorage.setItem("pineiro_patients", JSON.stringify(INITIAL_PATIENTS));
    }

    // 5. Bookings Ledger database
    const storedBookings = localStorage.getItem("pineiro_bookings");
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      const initialBookingsList = INITIAL_BOOKINGS(parsedPatients, dates);
      setBookings(initialBookingsList);
      localStorage.setItem("pineiro_bookings", JSON.stringify(initialBookingsList));
    }
  }, []);

  // ---------------------------------------------------------------------------
  // ROUTE CHANGE LISTENER & CONTROLLER
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";

      if (hash.startsWith("#/admin")) {
        setCurrentRoute("admin");
      } else if (hash.startsWith("#/planes") || hash.startsWith("#/packs")) {
        setCurrentRoute("planes");
      } else if (hash.startsWith("#/reservar") || hash.startsWith("#/turno") || hash.startsWith("#/booking")) {
        setCurrentRoute("reservar");
      } else if (hash.startsWith("#/preguntas") || hash.startsWith("#/faq")) {
        setCurrentRoute("preguntas");
      } else {
        setCurrentRoute("inicio");
        
        // Handle scroll targets if navigating page internally
        if (hash === "#/features" || hash === "#features") {
          setTimeout(() => {
            document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 200);
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run initial lookup

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // ---------------------------------------------------------------------------
  // PERSISTENCE SYNC INJECTION WRAPPERS
  // ---------------------------------------------------------------------------
  const handleSetPacks = (newPacks: Pack[]) => {
    setPacks(newPacks);
    localStorage.setItem("pineiro_packs", JSON.stringify(newPacks));
  };

  const handleSetSlots = (newSlots: Slot[]) => {
    setSlots(newSlots);
    localStorage.setItem("pineiro_slots", JSON.stringify(newSlots));
  };

  const handleSetPatients = (newPatients: Patient[]) => {
    setPatients(newPatients);
    localStorage.setItem("pineiro_patients", JSON.stringify(newPatients));
  };

  const handleSetBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem("pineiro_bookings", JSON.stringify(newBookings));
  };

  // ---------------------------------------------------------------------------
  // EVENT COORDINATION HANDLERS
  // ---------------------------------------------------------------------------
  const handleScrollToSection = (elementId: string) => {
    const hash = window.location.hash || "#/";
    const isHome = hash === "" || hash === "#/" || hash === "#/inicio";
    
    if (!isHome) {
      window.location.hash = `#/inicio`;
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
    } else {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSelectPack = (packId: string) => {
    setSelectedPackId(packId);
    window.location.hash = "#/reservar"; // Switch view smoothly!
  };

  const handleDirectBookingSubmit = (formData: any) => {
    if (!selectedSlot) return;

    // 1. Create a custom patient model
    const newPatientId = "pat-" + Date.now();
    const newPatientRecord: Patient = {
      id: newPatientId,
      name: formData.name,
      age: formData.age,
      phone: formData.phone,
      email: formData.email,
      weight: formData.weight,
      objective: formData.objective,
      notes: formData.notes,
      registeredAt: new Date().toISOString().split("T")[0]
    };

    // 2. Assign and lock schedule slot in real-time
    const updatedSlots = slots.map((s) => {
      if (s.id === selectedSlot.id) {
        return { ...s, reserved: true, by: newPatientId };
      }
      return s;
    });

    // 3. Keep a pristine booking metadata ledger
    const activePack = packs.find((p) => p.id === selectedPackId) || packs[1] || packs[0];
    const newBookingId = "book-" + Math.floor(10000 + Math.random() * 90000);
    const newBookingRecord: Booking = {
      id: newBookingId,
      slotId: selectedSlot.id,
      patient: newPatientRecord,
      packId: activePack.id,
      packName: activePack.name,
      price: activePack.price,
      date: selectedSlot.date,
      time: selectedSlot.time,
      paymentMethod: "WhatsApp / Sin pago web",
      paymentStatus: "Pendiente",
      createdAt: new Date().toISOString()
    };

    // 4. Batch update states and save to local storage
    const nextPatients = [newPatientRecord, ...patients];
    const nextBookings = [newBookingRecord, ...bookings];

    handleSetPatients(nextPatients);
    handleSetSlots(updatedSlots);
    handleSetBookings(nextBookings);

    // 5. Build prefilled professional template for WhatsApp message
    const formattedPrice = new Intl.NumberFormat("es-AR", { 
      style: "currency", 
      currency: "ARS", 
      minimumFractionDigits: 0 
    }).format(activePack.price);

    const messageText = `Hola *${formData.name}*, ¡tu turno ha sido registrado con éxito!

🏥 *CLÍNICA ANDREA PIÑEIRO METABOLIC*
⚕️ _Dra. Andrea Piñeiro (M.N. 142.822)_
━━━━━━━━━━━━━━━━━━━━━━
📅 *Fecha:* ${selectedSlot.date}
⏰ *Hora:* ${selectedSlot.time} hs
🏷️ *Plan:* ${activePack.name}
💵 *Valor:* ${formattedPrice}
📌 *Código:* ${newBookingId}
📍 *Lugar:* Consultorios Premium, Av. del Libertador 4200, Palermo, CABA.

Para completar el alta de tu ficha médica y coordinar las indicaciones previas, conserva este mensaje o presiona enviar. Nos pondremos en contacto contigo a la brevedad. ¡Muchas gracias!`;

    // Clean phone number for WhatsApp api
    let cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length === 10 && !cleanPhone.startsWith("54")) {
      cleanPhone = "549" + cleanPhone;
    }
    if (!cleanPhone) cleanPhone = "5491158224411"; // Dra's WA fallback

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

    alert(`¡Turno Reservado con éxito! Se agendó tu cita para el ${selectedSlot.date} a las ${selectedSlot.time} hs. Se abrirá WhatsApp para enviarle la confirmación del turno.`);
    
    // Clear selections & redirect smoothly
    setSelectedSlot(null);
    setPendingPatientForm(formData);
    window.location.hash = "#/inicio";
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  const onToggleAdminMode = (active: boolean) => {
    setIsAdminMode(active);
    if (active) {
      sessionStorage.setItem("pineiro_admin_auth", "true");
      window.location.hash = "#/admin";
    } else {
      sessionStorage.removeItem("pineiro_admin_auth");
      window.location.hash = "#/inicio";
    }
  };

  const handleAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === "2026" || adminPinInput === "admin") {
      onToggleAdminMode(true);
      setAdminPinInput("");
      setAdminPinError("");
    } else {
      setAdminPinError("Código PIN de clínica incorrecto. Intente '2026' para la demo.");
    }
  };

  const activePackForPayment = packs.find((p) => p.id === selectedPackId) || packs[1] || packs[0];

  // Filters for FAQ queries
  const filteredFaqs = FREQUENT_QUESTIONS.filter((faq) => {
    const q = faq.q.toLowerCase();
    const a = faq.a.toLowerCase();
    const query = faqQuery.toLowerCase();
    return q.includes(query) || a.includes(query);
  });

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      
      {/* Clinician Active Helper alert strip */}
      {isAdminMode && currentRoute === "admin" && (
        <div className="bg-teal-900 border-b border-teal-800 text-white text-[11px] font-bold py-2 px-4 flex items-center justify-between font-mono uppercase tracking-wider select-none">
          <div className="flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>Consola de Administración Activa — Dra. Andrea Piñeiro</span>
          </div>
          <button 
            onClick={() => onToggleAdminMode(false)}
            className="text-teal-300 hover:text-white decoration-none hover:underline cursor-pointer"
          >
            [Salir al Portal Público]
          </button>
        </div>
      )}

      {/* Main Medical Header bar */}
      <Header
        isAdminMode={isAdminMode}
        onToggleAdminMode={onToggleAdminMode}
        onScrollTo={handleScrollToSection}
        adminEmail={adminEmail}
        currentRoute={currentRoute}
      />

      {/* Primary Workspace Sections with Route Transition AnimatePresence */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentRoute === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {isAdminMode ? (
                /* Secure Clinical Administration Dashboard Panel */
                <AdminPanel
                  packs={packs}
                  setPacks={handleSetPacks}
                  slots={slots}
                  setSlots={handleSetSlots}
                  bookings={bookings}
                  setBookings={handleSetBookings}
                  patients={patients}
                  setPatients={handleSetPatients}
                />
              ) : (
                /* Beautiful Inline Authorization Entry Card if route is admin but unauthorized */
                <div className="max-w-md mx-auto px-4 py-20">
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 to-teal-700" />
                    
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="w-7 h-7" />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                      Acceso Autorizado
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                      Ingrese el PIN de seguridad asignado para Dra. Andrea Piñeiro y socios.
                    </p>

                    <form onSubmit={handleAdminPinSubmit} className="mt-8 space-y-4">
                      <div>
                        <label className="block text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                          PIN Clínico de Acceso
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Ingrese PIN (ej: 2026)"
                          value={adminPinInput}
                          onChange={(e) => setAdminPinInput(e.target.value)}
                          className="w-full text-center text-xl tracking-widest font-mono font-bold bg-gray-50 border border-gray-200 rounded-2xl py-3.5 focus:bg-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
                          autoFocus
                        />
                      </div>

                      {adminPinError && (
                        <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl">
                          {adminPinError}
                        </p>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => { window.location.hash = "#/inicio"; }}
                          className="w-1/2 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-all"
                        >
                          Ir al Inicio
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md shadow-teal-600/10 cursor-pointer transition-all"
                        >
                          Autorizar
                        </button>
                      </div>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-[11px] text-gray-400 font-mono">
                      PIN Demo: <span className="text-teal-600 font-bold">2026</span> o <span className="text-teal-600 font-bold">admin</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentRoute === "reservar" && (
            <motion.div
              key="reservar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="py-12 bg-slate-50 border-t border-b border-gray-100 min-h-[70vh]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Link removed */}

                {/* Reservation specific Header bar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 border-b border-gray-200 pb-8">
                  <div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block font-mono">AGENDAMIENTO OFICIAL</span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                      Agenda tu admisión médica
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                      Regula tu sobrepeso y metabolismo coordinando directamente con el equipo de la <strong>Dra. Andrea Piñeiro</strong>. No requiere derivación previa.
                    </p>
                  </div>

                  {/* Summary of Chosen Offer */}
                  <div className="bg-white rounded-2xl p-4.5 border border-teal-100/60 shadow-sm flex items-center space-x-4 max-w-xs shrink-0 self-start md:self-auto">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                      <ClipboardCheck className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold text-teal-600 uppercase">TIER SELECCIONADO</div>
                      <div className="text-sm font-extrabold text-slate-900 leading-tight">
                        {activePackForPayment.name}
                      </div>
                      <div className="text-xs font-semibold text-gray-500 mt-0.5">
                        {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(activePackForPayment.price)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress helper pipeline tracking for mobile/desktop clarity */}
                <div className="grid grid-cols-2 md:max-w-md gap-4 mb-8">
                  <div className={`p-3 rounded-xl border flex items-center space-x-3.5 transition-all duration-300 ${
                    !selectedSlot
                      ? "bg-teal-50 border-teal-200 text-teal-900"
                      : "bg-white border-green-200 text-green-900 shadow-sm"
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      !selectedSlot ? "bg-teal-600 text-white" : "bg-green-600 text-white"
                    }`}>
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wide">Paso 1: Fecha</h4>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {selectedSlot ? `Reservado ${selectedSlot.time} hs` : "Elegir horario"}
                      </p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center space-x-3.5 transition-all duration-300 ${
                    selectedSlot
                      ? "bg-teal-50 border-teal-200 text-teal-900 animate-pulse-subtle"
                      : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      selectedSlot ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wide">Paso 2: Datos</h4>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {selectedSlot ? "Completar ficha" : "Pendiente paso 1"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Interactive calendar + Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Clinical Calendar slots */}
                  <div className="lg:col-span-6">
                    <BookingCalendar
                      slots={slots}
                      selectedDate={selectedDate}
                      selectedSlot={selectedSlot}
                      onSelectDate={setSelectedDate}
                      onSelectSlot={setSelectedSlot}
                    />
                  </div>

                  {/* Right Column: intake Patient medical form */}
                  <div className="lg:col-span-6">
                    <BookingForm
                      packs={packs}
                      selectedPackId={selectedPackId}
                      onSelectPack={setSelectedPackId}
                      selectedSlot={selectedSlot}
                      onSubmit={handleDirectBookingSubmit}
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {currentRoute === "planes" && (
            <motion.div
              key="planes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="py-12 bg-slate-50 border-t border-b border-gray-100 min-h-[75vh]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link removed */}

                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                  <span className="text-[10px] font-extrabold text-teal-650 tracking-widest uppercase block font-mono">SERVICIOS CLÍNICOS</span>
                  <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Nuestros Packs y Planes
                  </h1>
                  <p className="text-sm text-slate-500 max-w-xl mx-auto">
                    Selecciona el plan metabólico que mejor se adapta a tu situación clínica para iniciar tu cambio integral con la Dra. Andrea Piñeiro.
                  </p>
                </div>

                <Packs
                  packs={packs}
                  selectedPackId={selectedPackId}
                  onSelectPack={handleSelectPack}
                />
              </div>
            </motion.div>
          )}

          {currentRoute === "preguntas" && (
            <motion.div
              key="preguntas"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="py-16 bg-white min-h-[70vh]"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header FAQ headings */}
                <div className="text-center max-w-2xl mx-auto mb-10 space-y-3.5">
                  <span className="text-[10px] font-extrabold text-teal-600 tracking-widest uppercase block font-mono">DUDAS CLÍNICAS Y SOPORTE</span>
                  <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Biblioteca de Respuestas
                  </h1>
                  <p className="text-sm text-slate-500">
                    Despeja tus dudas de forma transparente sobre el programa de 12 semanas, reintegros médicos, fármacos saciantes y planes.
                  </p>
                </div>

                {/* Interactive Search Bar input for Desktop/Mobile comfort */}
                <div className="relative max-w-md mx-auto mb-12 shadow-sm rounded-2xl overflow-hidden border border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por palabra clave (ej: metformina, prepaga, pagos)..."
                    value={faqQuery}
                    onChange={(e) => setFaqQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm bg-gray-50 focus:bg-white outline-none"
                  />
                  {faqQuery && (
                    <button
                      onClick={() => setFaqQuery("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-teal-600 hover:text-teal-800"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* FAQ Cards Blocks */}
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12 px-6 bg-slate-50 rounded-2xl border border-gray-200">
                    <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="font-serif text-base font-bold text-slate-900">No encontramos resultados</h3>
                    <p className="text-xs text-gray-500 mt-1">Intente buscar con otro término u comuníquese con secretaría.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => {
                      // Lookup original index in absolute list to preserve unique states
                      const originalIndex = FREQUENT_QUESTIONS.findIndex((originalItem) => originalItem.q === faq.q);
                      const isOpen = faqOpenIndex === originalIndex;
                      
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm bg-white"
                        >
                          <button
                            onClick={() => setFaqOpenIndex(isOpen ? null : originalIndex)}
                            className="w-full flex items-center justify-between px-6 py-5 text-left font-serif font-bold text-slate-900 group cursor-pointer hover:bg-slate-50/50"
                          >
                            <span className="text-sm sm:text-base leading-snug group-hover:text-teal-700 transition-colors">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-teal-600 shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <div className="px-6 pb-6 pt-0 animate-fadeIn text-sm text-slate-600 leading-relaxed font-sans bg-slate-50/20 border-t border-slate-50">
                              <p className="pt-4">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Secondary Assist Card details for direct WhatsApp support */}
                <div className="mt-14 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-teal-100/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center justify-center sm:justify-start space-x-2">
                      <MessageSquare className="w-5 h-5 text-teal-600" />
                      <span>¿Aún tienes dudas particulares?</span>
                    </h3>
                    <p className="text-xs text-slate-600 font-sans max-w-md">
                      Ponte en contacto directo con secretaría o con Dra. Andrea Piñeiro. Te responderemos personalmente en el día.
                    </p>
                  </div>
                  <a
                    href="https://api.whatsapp.com/send?phone=5491158224411&text=Hola%20Dra.%20Andrea%20Pi%C3%B1eiro%2C%20deseo%20hacer%20una%20consulta%20metab%C3%B3lica..."
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-3.5 px-6 rounded-xl shrink-0 shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>Secretaría Directa</span>
                  </a>
                </div>

              </div>
            </motion.div>
          )}

          {currentRoute === "inicio" && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* HERO HERO SECTION */}
              <Hero onScrollTo={handleScrollToSection} />

              {/* WHAT'S INCLUDED BENTO FEATURES */}
              <div id="features">
                <Features />
              </div>

              {/* Quick Onboarding Funnel Badge */}
              <section className="py-16 bg-slate-950 text-white relative overflow-hidden select-none">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl -z-10" />
                <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
                  <span className="text-[10px] font-mono tracking-widest text-teal-400 font-bold uppercase block">
                    AGENDA TU ADMISIÓN ONLINE DESDE EL CELULAR EN 2 MINUTOS
                  </span>
                  <h2 className="font-serif text-3xl font-bold tracking-tight text-white max-w-xl mx-auto leading-tight">
                    Comienza hoy tu restauración metabólica con método médico
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Evita largas llamadas telefónicas. Nuestro calendario en tiempo real coordina la cita y te otorga tu clave de admisión al instante.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => { window.location.hash = "#/reservar"; }}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer inline-flex items-center space-x-2"
                    >
                      <span>Comenzar Agendamiento</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER FOOTER CREDENTIALS */}
      <Footer onScrollTo={handleScrollToSection} patientPhone={pendingPatientForm?.phone} />



    </div>
  );
}
