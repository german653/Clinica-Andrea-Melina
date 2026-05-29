export interface Pack {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  tier: "basic" | "standard" | "premium";
}

export interface Slot {
  id: string; // e.g., "slot-2026-05-28-0900"
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reserved: boolean;
  by?: string; // patientId of the reserving user
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  weight: number; // in kg
  objective: string;
  notes?: string;
  registeredAt: string;
}

export interface Booking {
  id: string;
  slotId: string;
  patient: Patient;
  packId: string;
  packName: string;
  price: number;
  date: string; // Slot date
  time: string; // Slot time
  paymentMethod: "MercadoPago" | "Stripe" | "Transferencia" | "WhatsApp / Sin pago web";
  paymentStatus: "Pendiente" | "Completado";
  createdAt: string;
}

export interface AdminStats {
  totalMonthlyRevenue: number;
  totalBookingsCount: number;
  averagePatientWeight: number;
  packDistribution: { [key: string]: number };
}
