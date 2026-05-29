import React, { useState } from "react";
import { Pack, Slot } from "../types";
import { UserCheck, HelpCircle, Activity, ChevronRight, Sparkles } from "lucide-react";

interface BookingFormProps {
  packs: Pack[];
  selectedPackId: string;
  onSelectPack: (packId: string) => void;
  selectedSlot: Slot | null;
  onSubmit: (formData: {
    name: string;
    age: number;
    phone: string;
    email: string;
    weight: number;
    objective: string;
    notes: string;
  }) => void;
}

export default function BookingForm({
  packs,
  selectedPackId,
  onSelectPack,
  selectedSlot,
  onSubmit,
}: BookingFormProps) {
  // Local state for the intake form fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [weight, setWeight] = useState("");
  const [objective, setObjective] = useState("Pérdida de peso grasa / Recomposición corporal");
  const [notes, setNotes] = useState("");

  const [formErrorStr, setFormErrorStr] = useState("");

  const activePack = packs.find((p) => p.id === selectedPackId) || packs[1] || packs[0] || {
    id: "loading",
    name: "Cargando plan...",
    tier: "Cargando...",
    description: "Por favor espere un momento...",
    price: 0,
    features: [],
    popular: false
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorStr("");

    if (!name.trim()) return setFormErrorStr("Por favor, ingrese su nombre completo.");
    if (!age || Number(age) <= 0) return setFormErrorStr("Por favor, indique una edad válida.");
    if (!phone.trim()) return setFormErrorStr("Por favor, complete su número telefónico de contacto.");
    if (!email.trim() || !email.includes("@")) return setFormErrorStr("Por favor, ingrese un correo electrónico válido.");
    if (!weight || Number(weight) <= 0) return setFormErrorStr("Por favor, indique su peso corporal aproximado en kg.");

    onSubmit({
      name,
      age: Number(age),
      phone,
      email,
      weight: Number(weight),
      objective,
      notes,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-premium">
      
      {/* Banner Title */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
          2
        </div>
        <div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Paso 2: Plan Integral &amp; Historial</h3>
          <p className="text-xs text-gray-500 font-medium">Información clínica preliminar para Andrea &amp; Socio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Pack Selection Inside the form as fallback */}
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200/60">
          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">
            Pack de Tratamiento Seleccionado
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">{activePack.name}</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  {activePack.tier}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{activePack.description}</p>
            </div>
            
            {/* Direct selector dropdown */}
            <select
              value={selectedPackId}
              onChange={(e) => onSelectPack(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold text-teal-900 bg-white border border-teal-200/50 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none cursor-pointer self-start sm:self-auto"
            >
              {packs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(p.price)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Nombre Completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Marcelo Benítez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
            />
          </div>

          {/* Edad */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Edad (Años) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="12"
              max="110"
              placeholder="Ej: 41"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
            />
          </div>

          {/* Telefono */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Número de Teléfono (WhatsApp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Ej: +54 9 11 5040-1234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="marcelo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
            />
          </div>

          {/* Peso */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Peso Corporal Aproximado (kg) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              step="0.1"
              placeholder="Ej: 94.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
            />
          </div>

          {/* Objetivo principal */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Objetivo Principal Metabólico
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all cursor-pointer"
            >
              <option value="Pérdida de peso grasa / Recomposición corporal">
                Pérdida de peso grasa / Recomposición corporal
              </option>
              <option value="Control de insulinoresistencia o diabetes tipo 2">
                Control de insulinoresistencia / glucemia
              </option>
              <option value="Mejora de valores lipídicos (Colesterol/Triglicéridos)">
                Regularizar perfil lipídico (colesterol/triglicéridos)
              </option>
              <option value="Aumento de tono muscular y vitalidad">
                Aumento de tono muscular y vitalidad
              </option>
              <option value="Tratamiento de obesidad de alto impacto quirúrgico">
                Preparación pre-quirúrgica metabólica
              </option>
            </select>
          </div>

        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Observaciones o Antecedentes Clínicos Relevantes
          </label>
          <textarea
            placeholder="Menciona enfermedades preexistentes, medicamentos en uso, cirugías previas, alergias alimentarias, dolores de rodilla/columna, etc."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
          />
        </div>

        {/* Form Error Banner */}
        {formErrorStr && (
          <p className="p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl font-medium">
            {formErrorStr}
          </p>
        )}

        {/* Complete booking CTA */}
        <button
          type="submit"
          disabled={!selectedSlot}
          className={`w-full py-4.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center space-x-2.5 shadow-lg ${
            selectedSlot
              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/15 group cursor-pointer"
              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
          }`}
        >
          <span>Confirmar Turno y Notificar por WhatsApp</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform animate-pulse" />
        </button>

        {!selectedSlot && (
          <p className="text-[11px] text-center text-rose-500 font-medium">
            * Para proceder, primero debes seleccionar un Horario Libre en el Paso 1.
          </p>
        )}

      </form>
    </div>
  );
}
