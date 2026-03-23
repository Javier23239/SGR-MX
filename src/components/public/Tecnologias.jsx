import { 
  RiReactjsLine, 
  RiNodejsLine, 
  RiDatabase2Line, 
  RiMapPinRangeLine,
  RiShieldCheckLine,
  RiFlashlightLine 
} from "react-icons/ri";

const Tecnologias = () => {
  const techs = [
    {
      name: "React 18",
      desc: "Interfaz dinámica y reactiva para una gestión de residuos eficiente.",
      icon: <RiReactjsLine className="text-blue-500" />,
      color: "hover:border-blue-500"
    },
    {
      name: "Oracle DB",
      desc: "Base de datos empresarial para el manejo masivo de reportes y usuarios.",
      icon: <RiDatabase2Line className="text-red-600" />,
      color: "hover:border-red-600"
    },
    {
      name: "Node.js API",
      desc: "Backend escalable que conecta los servicios de limpieza con la ciudadanía.",
      icon: <RiNodejsLine className="text-green-600" />,
      color: "hover:border-green-600"
    },
    {
      name: "OpenStreet",
      desc: "Geolocalización en tiempo real para el seguimiento de rutas de recolección.",
      icon: <RiMapPinRangeLine className="text-orange-500" />,
      color: "hover:border-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Infraestructura Tecnológica
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            El <strong>Sistema de Gestión de Residuos</strong> utiliza tecnologías de grado industrial 
            para garantizar la seguridad de tus datos y la eficiencia en la recolección.
          </p>
        </div>

        {/* Grid de Tecnologías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techs.map((tech) => (
            <div
              key={tech.name}
              className={`group p-8 rounded-2xl border-2 border-gray-50 bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:bg-white ${tech.color}`}
            >
              <div className="text-5xl mb-6 inline-block p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                {tech.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{tech.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Features adicionales cortos */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-gray-100 pt-10">
          <div className="flex items-center gap-2 text-gray-400">
            <RiShieldCheckLine className="text-xl text-green-500" />
            <span className="text-sm font-medium">Seguridad Oracle SSL</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Tecnologias;