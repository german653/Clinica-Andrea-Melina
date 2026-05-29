import { Pack, Slot, Booking, Patient } from "./types";

// Dynamic Dates Generator starting on 2026-05-28 (tomorrow relative to system 2026-05-27)
export const getUpcomingDates = (daysCount = 7): string[] => {
  const dates: string[] = [];
  const baseDate = new Date("2026-05-27T20:00:00Z");
  
  for (let i = 1; i <= daysCount; i++) {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + i);
    // YYYY-MM-DD
    const yyyy = nextDate.getFullYear();
    const mm = String(nextDate.getMonth() + 1).padStart(2, "0");
    const dd = String(nextDate.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
};

// Formats YYYY-MM-DD into a beautiful spanish format: "Jueves 28 May"
export const formatSpanishDate = (dateStr: string): string => {
  const parts = dateStr.split("-");
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];
  return `${days[d.getDay()]} ${parts[2]} de ${months[d.getMonth()]}`;
};

export const INITIAL_PACKS: Pack[] = [
  {
    id: "pack-1",
    name: "Pack Inicial Clínico",
    price: 45000,
    description: "Evaluación diagnóstica integral para establecer bases sólidas y metas médicas viables.",
    features: [
      "Consulta Médica Diagnóstica completa",
      "Consulta Nutricional con Bioimpedancia",
      "Estudio de Laboratorio y Análisis de perfil",
      "Plan Alimenticio Inicial Personalizado",
      "Seguimiento por WhatsApp en semana 2"
    ],
    tier: "basic"
  },
  {
    id: "pack-2",
    name: "Pack Transformación Activa",
    price: 75000,
    description: "El programa más elegido. Combina nutrición, controles médicos y planes de entrenamiento.",
    features: [
      "Todo lo incluido en el Pack Inicial",
      "Seguimiento extendido bi-semanal online",
      "Plan de Entrenamiento diseñado por Trainer",
      "Acompañamiento nutricional de soporte continuo",
      "Guía de suplementación metabólica básica",
      "Acceso a la App de registro de comidas"
    ],
    popular: true,
    tier: "standard"
  },
  {
    id: "pack-premium",
    name: "Pack Elite Integral 360",
    price: 120000,
    description: "Tratamiento personalizado exclusivo de alta frecuencia para resultados acelerados y sostenibles.",
    features: [
      "Atención Prioritaria Premium",
      "Seguimiento médico-nutricional semanal directo",
      "Entrenamiento personalizado modular 1-on-1",
      "Línea de soporte VIP por WhatsApp directa con Andrea",
      "Ajustes semanales a la pauta alimentaria",
      "Optimización hormonal y análisis de biomarcadores VIP",
      "Talleres grupales exclusivos en vivo"
    ],
    tier: "premium"
  }
];

// Seed initial default slots for the generated upcoming dates
export const generateDefaultSlots = (): Slot[] => {
  const dates = getUpcomingDates(7);
  const hours = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  const slots: Slot[] = [];

  dates.forEach((date) => {
    // Determine day of week to skip weekends
    const parts = date.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    if (!isWeekend) {
      hours.forEach((time) => {
        // Pre-reserve some slots randomly to make it look active
        const randomHash = (date + time).charCodeAt(0) + (date + time).charCodeAt(3);
        const reserved = randomHash % 5 === 0; // index pseudo-random

        slots.push({
          id: `slot-${date}-${time.replace(":", "")}`,
          date,
          time,
          reserved,
          by: reserved ? "mock-patient-id" : undefined
        });
      });
    }
  });

  return slots;
};

// Seed initial patients
export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "pat-1",
    name: "Carlos Mendoza",
    age: 42,
    phone: "+54 9 11 5822-4411",
    email: "carlos.mendoza@email.com",
    weight: 104.5,
    objective: "Reducir grasa visceral y controlar niveles de glucemia.",
    notes: "Paciente con resistencia a la insulina y antecedentes de hipertensión.",
    registeredAt: "2026-05-10"
  },
  {
    id: "pat-2",
    name: "Mariana Silva",
    age: 35,
    phone: "+54 9 341 698-3544",
    email: "mariana.silva@email.com",
    weight: 88.2,
    objective: "Mejorar la relación con la comida, perder peso y ganar tono muscular.",
    notes: "Tiene intolerancia al gluten y prefiere entrenar al aire libre.",
    registeredAt: "2026-05-18"
  },
  {
    id: "pat-3",
    name: "Roberto Gómez",
    age: 51,
    phone: "+54 9 261 455-7788",
    email: "roberto.gomez@email.com",
    weight: 112.7,
    objective: "Preparación metabólica previa para evitar cirugía bariátrica.",
    notes: "Artritis leve en rodilla izquierda, requiere ejercicios de bajo impacto.",
    registeredAt: "2026-05-22"
  },
  {
    id: "pat-4",
    name: "Sofía Martínez",
    age: 28,
    phone: "+54 9 11 3022-9900",
    email: "sofia.martinez@email.com",
    weight: 79.1,
    objective: "Aumento de masa muscular magra y readecuación nutricional.",
    notes: "Paciente vegana. Requiere suplementación guiada especial de vitamina B12.",
    registeredAt: "2026-05-25"
  }
];

// Initial bookings database
export const INITIAL_BOOKINGS = (patients: Patient[], dates: string[]): Booking[] => {
  return [
    {
      id: "book-1",
      slotId: `slot-${dates[0]}-0900`,
      patient: patients[0],
      packId: "pack-2",
      packName: "Pack Transformación Activa",
      price: 75000,
      date: dates[0],
      time: "09:00",
      paymentMethod: "MercadoPago",
      paymentStatus: "Completado",
      createdAt: "2026-05-10T14:30:00Z"
    },
    {
      id: "book-2",
      slotId: `slot-${dates[1]}-1100`,
      patient: patients[1],
      packId: "pack-premium",
      packName: "Pack Elite Integral 360",
      price: 120000,
      date: dates[1],
      time: "11:00",
      paymentMethod: "Stripe",
      paymentStatus: "Completado",
      createdAt: "2026-05-18T10:15:00Z"
    },
    {
      id: "book-3",
      slotId: `slot-${dates[2]}-1400`,
      patient: patients[2],
      packId: "pack-1",
      packName: "Pack Inicial Clínico",
      price: 45000,
      date: dates[2],
      time: "14:00",
      paymentMethod: "Transferencia",
      paymentStatus: "Completado",
      createdAt: "2026-05-22T18:45:00Z"
    },
    {
      id: "book-4",
      slotId: `slot-${dates[3]}-1600`,
      patient: patients[3],
      packId: "pack-2",
      packName: "Pack Transformación Activa",
      price: 75000,
      date: dates[3],
      time: "16:00",
      paymentMethod: "MercadoPago",
      paymentStatus: "Pendiente",
      createdAt: "2026-05-25T09:00:00Z"
    }
  ];
};

export const FREQUENT_QUESTIONS = [
  {
    q: "¿El programa es de modalidad online o presencial?",
    a: "Ofrecemos una modalidad híbrida adaptable. Las consultas y seguimientos pueden realizarse presenciales en nuestro consultorio premium o 100% online por videollamada HD con acceso a nuestro portal, optimizando los tiempos de pacientes de cualquier locación."
  },
  {
    q: "¿Cómo se coordina el plan de entrenamiento?",
    a: "A partir del Pack 2, se realiza una evaluación de tu capacidad física actual. Nuestro preparador físico diseña rutinas adaptadas que puedes realizar en casa o en gimnasio, con videos explicativos de cada ejercicio y seguimiento de progresión de cargas."
  },
  {
    q: "¿Qué sucede si necesito reprogramar mi turno ya pagado?",
    a: "Puedes reprogramar tu turno sin cargo hasta 24 horas antes del mismo. Puedes gestionarlo contactándonos por WhatsApp o en la sección de administración de la plataforma. Tu pago queda totalmente acreditado."
  },
  {
    q: "¿Qué obra social o prepaga aceptan?",
    a: "Trabajamos de forma particular emitiendo facturas oficiales de reintegro médico y nutricional para que puedas presentarlas en prepagas de alta categoría (OSDE, Swiss Medical, Galeno, etc.) y recuperar la mayor parte del costo."
  },
  {
    q: "¿El plan incluye medicamentos o suplementación?",
    a: "Basándonos en tus estudios de laboratorio incluidos, la Dra. Andrea Piñeiro evalúa si eres candidato a medicamentos de última generación para el manejo de la saciedad (e.g., Liraglutida, Semaglutida) y suplementación cronobiológica personalizada para potenciar tus resultados."
  }
];
