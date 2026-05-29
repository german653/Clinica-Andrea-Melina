import { Pack } from "../types";
import { Check, Flame, Trophy, Star } from "lucide-react";

interface PacksProps {
  packs: Pack[];
  selectedPackId: string;
  onSelectPack: (packId: string) => void;
}

export default function Packs({ packs, selectedPackId, onSelectPack }: PacksProps) {
  
  // Format prices nicely in ARS Currency
  const formatARS = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <section id="packs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">NUESTROS PACKS</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Planes diseñados para cada etapa de tu cambio
          </h2>
          <p className="text-slate-600 font-sans">
            Elige el nivel de acompañamiento que mejor se ajuste a tus objetivos médicos. Todos los packs incluyen historia clínica digital y acceso de por vida a nuestro material educativo preventivo.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packs.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            
            return (
              <div
                key={pack.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  pack.popular
                    ? "bg-slate-900 text-white shadow-2xl scale-100 lg:scale-[1.03] ring-4 ring-teal-500/30"
                    : "bg-white text-slate-900 shadow-premium border border-gray-200 hover:border-teal-200"
                } ${isSelected ? "ring-2 ring-teal-600 border-teal-600" : ""}`}
              >
                {/* Popular Pill badge */}
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1 shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>EL MÁS ELEGIDO</span>
                  </div>
                )}

                {/* Premium exclusive badge */}
                {pack.tier === "premium" && !pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1 shadow-md">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>ALTA GAMA VIP</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Desc */}
                  <div>
                    <h3 className={`font-serif text-2xl font-bold ${pack.popular ? "text-white" : "text-slate-900"}`}>
                      {pack.name}
                    </h3>
                    <p className={`text-sm mt-2 font-sans ${pack.popular ? "text-slate-300" : "text-slate-600"}`}>
                      {pack.description}
                    </p>
                  </div>

                  {/* Price Plate */}
                  <div className="py-4 border-t border-b border-gray-200/20">
                    <span className="text-[12px] uppercase font-bold tracking-widest block opacity-70 mb-1">
                      Pago único / Programa completo
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {formatARS(pack.price)}
                      </span>
                      <span className="text-sm opacity-80 font-medium">ARS</span>
                    </div>
                    <p className={`text-xs mt-1.5 ${pack.popular ? "text-teal-400" : "text-teal-600"} font-semibold flex items-center space-x-1`}>
                      <Star className="w-3 h-3 fill-current" />
                      <span>Financiación disponible por transferencia</span>
                    </p>
                  </div>

                  {/* Features bullet list */}
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-wider font-extrabold opacity-70">
                      ¿Qué incluye tu inversión?
                    </p>
                    <ul className="space-y-3">
                      {pack.features.map((feat, index) => (
                        <li key={index} className="flex items-start space-x-3 text-sm">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            pack.popular ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-600"
                          }`}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className={pack.popular ? "text-slate-200" : "text-slate-700 font-medium"}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call-to-action button */}
                <div className="mt-8">
                  <button
                    onClick={() => onSelectPack(pack.id)}
                    className={`w-full py-4.5 px-6 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md ${
                      isSelected
                        ? "bg-teal-500 text-white shadow-teal-500/20"
                        : pack.popular
                        ? "bg-white text-slate-950 hover:bg-slate-100"
                        : "bg-teal-600 hover:bg-teal-700 text-white hover:text-white"
                    }`}
                  >
                    {isSelected ? "✓ Plan Seleccionado" : "Elegir este Plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
