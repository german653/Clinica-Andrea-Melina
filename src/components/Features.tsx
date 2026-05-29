import { Stethoscope, Apple, MessageSquare, Dumbbell, HeartPulse, Scale, Check } from "lucide-react";

export default function Features() {
  const highlights = [
    {
      icon: <Stethoscope className="w-6 h-6 text-teal-600" />,
      title: "Consulta Médica Diagnóstica",
      description: "Liderada por la Dra. Andrea Piñeiro. Evaluación médica, clínica, cardiovascular y hormonal rigurosa para diseñar el abordaje correcto."
    },
    {
      icon: <Apple className="w-6 h-6 text-teal-600" />,
      title: "Consulta Nutricional y Bioimpedancia",
      description: "Análisis preciso de tu composición corporal (grasa visceral, masa muscular magra, agua extracelular) para trazar pautas efectivas."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-teal-600" />,
      title: "Seguimiento Diario por WhatsApp",
      description: "Resolución de dudas inmediatas y soporte continuo. No estás solo en el camino; el equipo te acompaña diariamente."
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-teal-600" />,
      title: "Análisis Integral de Biomarcadores",
      description: "Interpretamos en detalle tus estudios de laboratorio (lípidos, perfil hepático, tiroideo e insulina) para optimizar tu metabolismo de raíz."
    },
    {
      icon: <Apple className="w-6 h-6 text-teal-600" />,
      title: "Plan de Alimentación Adaptativo",
      description: "Esquema gourmet, flexible y saciante basado en crononutrición y densidad nutricional. Sin dietas de hambre ni efecto rebote."
    },
    {
      icon: <Dumbbell className="w-6 h-6 text-teal-600" />,
      title: "Entrenamiento de Preservación Muscular",
      description: "Diseñado por especialistas en readaptación física. Rutinas progresivas de fuerza para proteger tu masa magra y acelerar el gasto metabólico."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">CIENCIA &amp; MÉTODO</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Pilares estratégicos de la Transformación Integral
          </h2>
          <p className="text-slate-600 font-sans">
            Combinamos tres ciencias críticas para superar de forma definitiva el sobrepeso y la obesidad: medicina metabólica, nutrición de alta densidad y ejercicio físico inteligente.
          </p>
        </div>

        {/* Bento Grid layout representing columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6.5 border border-gray-200/60 hover:border-teal-300 transition-all hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Icon Capsule */}
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 tracking-tight">
                {item.title}
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Endorsement Statement */}
        <div className="mt-16 bg-white rounded-2xl p-6.5 sm:p-8 border border-teal-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium max-w-4xl mx-auto">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-serif text-lg font-bold text-slate-900">¿Por qué nuestro método funciona de verdad?</h4>
            <p className="text-sm text-slate-600 max-w-xl">
              Porque no recetamos planes genéricos. Cada paciente se analiza individualmente para regular la leptina, grelina e insulina, garantizando que el peso perdido sea grasa y no músculo.
            </p>
          </div>
          <div className="shrink-0 flex items-center space-x-1 font-mono text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2.5 rounded-lg border border-teal-100">
            <Check className="w-4 h-4 text-teal-600 shrink-0" />
            <span>METODOLOGÍA CLINICAMENTE CERTIFICADA</span>
          </div>
        </div>

      </div>
    </section>
  );
}
