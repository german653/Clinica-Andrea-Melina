import React, { useState } from "react";
import { 
  Stethoscope, MessageSquare, Phone, Mail, MapPin, 
  Clock, Shield, ArrowUp, Send, Check
} from "lucide-react";

interface FooterProps {
  onScrollTo: (elementId: string) => void;
  patientPhone?: string;
}

export default function Footer({ onScrollTo, patientPhone }: FooterProps) {
  const [showWaDrawer, setShowWaDrawer] = useState(false);
  const [waMessage, setWaMessage] = useState("");
  const [sentMessage, setSentMessage] = useState(false);

  const handleSendWa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waMessage.trim()) return;

    // Prefill beautiful clinical consult text
    const textMsg = encodeURIComponent(`Hola Dra. Andrea Piñeiro, deseo hacer una consulta sobre el Programa Metabólico Integral de Obesidad: ${waMessage}`);
    const officialClinicPhone = "5491158224411"; // Andrea's mock phone number

    window.open(`https://api.whatsapp.com/send?phone=${officialClinicPhone}&text=${textMsg}`, "_blank");
    setSentMessage(true);
    setTimeout(() => {
      setWaMessage("");
      setSentMessage(false);
      setShowWaDrawer(false);
    }, 2000);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 relative border-t border-slate-800">
      
      {/* Container foot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1 Brand column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Stethoscope className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-white block">Piñeiro Metabolic</span>
                <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Clínica &amp; Bienestar</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Tratamiento integral de la obesidad y metabolismo. Matriculadas y habilitadas oficialmente para la prescripción de esquemas nutricionales modernos y fármacos saciantes de última generación.
            </p>

            <div className="space-y-2 text-xs text-slate-300 font-mono pt-2">
              <p className="flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Dra. Andrea Piñeiro (M.N. 142.822)</span>
              </p>
              <p className="flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Colegio Médico Distrital I</span>
              </p>
            </div>
          </div>

          {/* Col 2 Program details links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-teal-400">Tratamientos</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>• Sobrepeso G1, G2 y Obesidad Mórbida</li>
              <li>• Tratamiento de Insulinoresistencia</li>
              <li>• Reprogramación Nutricional Cronobiológica</li>
              <li>• Preservación Muscular y Fuerza</li>
              <li>• Sostenimiento Metabólico Post-Metformina</li>
              <li>• Optimización de Microbiota Intestinal</li>
            </ul>
          </div>

          {/* Col 3 Navigation links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-teal-400">Secciones</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <button onClick={() => onScrollTo("features")} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  ¿Qué incluye el programa 12-Semanas?
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo("packs")} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  Packs de Inscripción y Valores
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo("booking")} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  Reservar Turno o Cita Médica
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo("faq")} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  Dudas y Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 Clinic Contact details */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-teal-400">Consultas Médicas</h4>
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Consultorios Premium, Av. del Libertador 4200, Palermo, CABA.</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+54 9 11 5822-4411</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>hola@pineirometabolic.com</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Lunes a Viernes de 09 a 18 hs.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            &copy; 2026. Diseñado y Desarrollado para <strong>Dra. Andrea Piñeiro &amp; Socio</strong>. Reservados todos los derechos.
          </p>
          
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-mono tracking-widest text-slate-500">COD: MP-V3-HEALTH</span>
            <button
              onClick={handleScrollTop}
              className="p-1 px-2.5 flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-[11px] font-bold cursor-pointer border border-slate-700 hover:border-slate-600"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------- WHATSAPP FLOTANTE INTEGRADO --------------------------- */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3 font-sans">
        
        {/* Floating whatsapp drawer drawer */}
        {showWaDrawer && (
          <div className="bg-white text-slate-900 rounded-2xl w-72 sm:w-80 shadow-2xl border border-gray-100 overflow-hidden text-sm flex flex-col transition-all">
            {/* Drawer top banner */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Stethoscope className="w-5 h-5 text-teal-100" />
                </div>
                <div>
                  <h5 className="font-serif font-bold text-sm">Consultorio Andrea Piñeiro</h5>
                  <span className="text-[10px] text-teal-100 leading-none">● En línea — Soporte oficial</span>
                </div>
              </div>
              <button
                onClick={() => setShowWaDrawer(false)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-teal-50/30 space-y-3">
              <div className="bg-white rounded-2xl p-3 text-slate-700 text-xs border border-teal-100/50 leading-relaxed shadow-sm">
                Hola! 👋 ¿Tienes alguna duda sobre nuestros packs o necesitas un horario que no encuentras disponible en el calendario?
                <p className="mt-1 font-semibold text-teal-800">Escríbenos directamente aquí.</p>
              </div>
            </div>

            {/* Chat input form */}
            <form onSubmit={handleSendWa} className="p-3 bg-white border-t border-gray-100 flex space-x-2">
              <input
                type="text"
                placeholder="Escribe tu consulta médica..."
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-2.5 flex items-center justify-center cursor-pointer transition-all shrink-0 shadow-md"
              >
                {sentMessage ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Send className="w-4 h-4 fill-current" />
                )}
              </button>
            </form>
          </div>
        )}

        {/* Pulse circular WhatsApp Button */}
        <button
          onClick={() => setShowWaDrawer(!showWaDrawer)}
          title="Consulta clínica directa por WhatsApp"
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-2xl flex items-center justify-center transition-all cursor-pointer transform hover:scale-108 relative group select-none focus:outline-none ring-4 ring-green-400/20 active:bg-green-700 shrink-0"
        >
          {/* Radial animated ring ripples */}
          <span className="absolute inset-0 rounded-full border-4 border-green-500 opacity-75 animate-ping -z-10 group-hover:block" />
          <MessageSquare className="w-6 h-6 fill-current" />
          
          {/* Quick notification bubble */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center leading-none">
            1
          </span>
        </button>

      </div>
    </footer>
  );
}
