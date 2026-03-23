import { 
  RiTeamLine, 
  RiCodeSSlashLine, 
  RiGitBranchLine, 
  RiHandHeartLine 
} from "react-icons/ri";

const Nosotros = () => {
  // Estos pilares resumen visualmente tu texto sin cambiarlo
  const pilares = [
    {
      icon: <RiTeamLine className="text-blue-600" />,
      title: "Equipo Integral",
      desc: "Análisis, diseño e implementación.",
      color: "border-blue-100 bg-blue-50/50"
    },
    {
      icon: <RiCodeSSlashLine className="text-green-600" />,
      title: "Full-Stack",
      desc: "Frontend, Backend y Desarrollo Móvil.",
      color: "border-green-100 bg-green-50/50"
    },
    {
      icon: <RiGitBranchLine className="text-purple-600" />,
      title: "Mejora Continua",
      desc: "Buenas prácticas de ingeniería de software.",
      color: "border-purple-100 bg-purple-50/50"
    },
    {
      icon: <RiHandHeartLine className="text-orange-600" />,
      title: "Compromiso Social",
      desc: "Soluciones a problemáticas reales.",
      color: "border-orange-100 bg-orange-50/50"
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda: Texto Original */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block p-3 rounded-2xl bg-white shadow-sm border border-gray-100">
              <RiTeamLine className="text-4xl text-blue-600" />
            </div>
            
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              ¿Quiénes somos?
            </h2>
            
            <p className="text-gray-700 text-lg leading-relaxed antialiased">
              Somos un equipo de desarrollo de software comprometido con la creación de
              soluciones tecnológicas que respondan a problemáticas reales de la comunidad.
              Participamos de manera integral en las áreas de frontend, backend y desarrollo
              móvil, colaborando activamente en el análisis, diseño e implementación del sistema
              de gestión de recolección de residuos. Nuestro enfoque se basa en el trabajo en
              equipo, la mejora continua y la aplicación de buenas prácticas de ingeniería de
              software.
            </p>
          </div>

          {/* Columna Derecha: Pilares Visuales */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pilares.map((pilar, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border ${pilar.color} shadow-sm group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl p-3 bg-white rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                    {pilar.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {pilar.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pilar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Nosotros;