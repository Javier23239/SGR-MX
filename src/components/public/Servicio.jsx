import { 
  RiUserVoiceLine, 
  RiTruckLine, 
  RiDashboard3Line, 
  RiArrowRightLine 
} from "react-icons/ri";

const Servicio = () => {
  const servicios = [
    {
      title: "Ciudadanos",
      desc: "Generan reportes de acumulación de residuos y consultan su estado en tiempo real.",
      icon: <RiUserVoiceLine className="text-emerald-600" />,
      tag: "Reporte",
      bgColor: "bg-emerald-50",
      borderColor: "group-hover:border-emerald-500"
    },
    {
      title: "Conductores",
      desc: "Visualizan rutas óptimas y atienden los reportes asignados desde la plataforma.",
      icon: <RiTruckLine className="text-blue-600" />,
      tag: "Logística",
      bgColor: "bg-blue-50",
      borderColor: "group-hover:border-blue-500"
    },
    {
      title: "Administración",
      desc: "Supervisa usuarios, rutas y reportes mediante un panel de control centralizado.",
      icon: <RiDashboard3Line className="text-purple-600" />,
      tag: "Control",
      bgColor: "bg-purple-50",
      borderColor: "group-hover:border-purple-500"
    }
  ];

  return (
    <section id="servicio" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Cabecera con diseño moderno */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm">
            Ecosistema SGR-MX
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            Nuestro Servicio
          </h2>
          <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            El sistema integra a todos los actores involucrados en la gestión de 
            residuos para lograr un proceso eficiente y transparente.
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid md:grid-cols-3 gap-8">
          {servicios.map((s, index) => (
            <div 
              key={index}
              className={`group bg-white p-8 rounded-3xl border-2 border-transparent shadow-sm transition-all duration-300 hover:shadow-xl ${s.borderColor}`}
            >
              {/* Icono con fondo dinámico */}
              <div className={`w-16 h-16 ${s.bgColor} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>

              {/* Tag pequeño */}
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {s.tag}
              </span>

              <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3">
                {s.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {s.desc}
              </p>

              {/* Decoración inferior interactiva */}
              <div className="flex items-center text-gray-400 group-hover:text-gray-900 transition-colors text-xs font-bold gap-2">
                SABER MÁS <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Nota al pie opcional */}
        <div className="mt-16 bg-white border border-gray-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm">
          <p className="text-gray-500 text-sm italic">
            "Tecnología aplicada para una ciudad más limpia y sostenible."
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Servicio;