import { 
  RiFacebookCircleLine, 
  RiTwitterXLine, 
  RiGithubLine, 
  RiInstagramLine,
  RiMailLine,
  RiMapPinLine,
  RiDatabaseLine
} from "react-icons/ri";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Branding */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white text-2xl font-black tracking-tighter mb-4">
              SGR<span className="text-emerald-500">-</span>MX
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              Sistema inteligente para la gestión de residuos urbanos. 
              Impulsando ciudades más limpias a través de la tecnología y la participación ciudadana.
            </p>
            <div className="flex gap-4">
              <RiFacebookCircleLine className="text-xl hover:text-emerald-500 cursor-pointer transition-colors" />
              <RiTwitterXLine className="text-xl hover:text-emerald-500 cursor-pointer transition-colors" />
              <RiGithubLine className="text-xl hover:text-emerald-500 cursor-pointer transition-colors" />
              <RiInstagramLine className="text-xl hover:text-emerald-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Navegación</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#inicio" className="hover:text-emerald-500 transition-colors">Inicio</a></li>
              <li><a href="#servicio" className="hover:text-emerald-500 transition-colors">Servicios</a></li>
              <li><a href="#nosotros" className="hover:text-emerald-500 transition-colors">Nosotros</a></li>
              <li><a href="#tecnologias" className="hover:text-emerald-500 transition-colors">Tecnología</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <RiMailLine className="text-emerald-500" /> soporte@sgr-mx.com
              </li>
              <li className="flex items-center gap-3">
                <RiMapPinLine className="text-emerald-500" /> Ciudad de México, MX
              </li>
              <li className="flex items-center gap-2 mt-4 p-2 bg-gray-900 rounded-lg border border-gray-800 inline-block">
                <RiDatabaseLine className="text-orange-500" />
                <span className="text-[10px] font-mono">Oracle DB Connected</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter / Info Académica */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Proyecto</h4>
            <p className="text-xs leading-relaxed italic">
              Este es un proyecto académico desarrollado para la optimización de procesos 
              de recolección de residuos sólidos urbanos mediante arquitecturas web modernas.
            </p>
          </div>

        </div>

        {/* Línea Final */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {currentYear} SGR-MX · Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
            <span className="hover:text-white cursor-pointer transition-colors">Términos</span>
            <span className="text-gray-600 font-medium">Versión 2.0 (Oracle Engine)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;