import { ShieldCheck, Activity, Users, Award, ChevronRight } from "lucide-react";

interface HeroProps {
  onScrollTo: (elementId: string) => void;
}

export default function Hero({ onScrollTo }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/20 to-white pt-10 pb-16 md:py-24">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-teal-100/40 blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/10 w-96 h-96 rounded-full bg-indigo-100/30 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Tagline */}
            <div className="inline-flex items-center space-x-2 bg-teal-100/60 text-teal-900 text-xs px-3.5 py-1.5 rounded-full font-semibold tracking-wide border border-teal-200/50">
              <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>PROGRAMA MÉDICO NUTRICIONAL 100% PERSONALIZADO</span>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Un paso real hacia tu <span className="text-gradient">bienestar integral</span> y metabólico
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
                Supera el sobrepeso con un método científico duradero que regula tus hormonas, diseña tu alimentación ideal y reestructura tu salud física. Creado por la <strong>Dra. Andrea Piñeiro</strong> y su equipo especialista.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => { window.location.hash = "#/reservar"; }}
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-teal-600/15 hover:shadow-teal-600/30 transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
              >
                <span>Saber más y Reservar Turno</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => { window.location.hash = "#/planes"; }}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-slate-800 font-semibold text-base px-8 py-4 rounded-xl border border-gray-200 transition-all shadow-premium flex items-center justify-center cursor-pointer"
              >
                Ver costo de Planes
              </button>
            </div>

            {/* Quick Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2.5 justify-center lg:justify-start">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Médicas Matriculadas</span>
              </div>
              <div className="flex items-center space-x-2.5 justify-center lg:justify-start">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Estudios de Laboratorio</span>
              </div>
              <div className="flex items-center space-x-2.5 justify-center lg:justify-start">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">WhatsApp Directo</span>
              </div>
            </div>
          </div>

          {/* Interactive Stat Visuals & Badge Mockup */}
          <div className="mt-12 lg:mt-0 lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md pt-6">
              
              {/* Premium Card Display representing active support */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -mr-6 -mt-6" />
                
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-ping" />
                  <span>Resultados del Programa 2026</span>
                </h3>

                <div className="space-y-5">
                  {/* Stat block 1 */}
                  <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 leading-none">1,250+</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">Pacientes dados de alta sanos</p>
                    </div>
                  </div>

                  {/* Stat block 2 */}
                  <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100/50 flex items-center justify-center text-teal-700 shrink-0">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 leading-none">14.5 kg</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">Pérdida de peso promedio en 12 semanas</p>
                    </div>
                  </div>

                  {/* Stat block 3 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 leading-none">96.8%</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">Sostenibilidad metabólica a largo plazo</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-2xl p-4.5 text-center shadow-md">
                  <p className="text-xs text-teal-100 font-bold uppercase tracking-wider">Acompañamiento Premium</p>
                  <p className="text-sm font-semibold mt-1">Médica de cabecera y nutricionista en un mismo lugar.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
