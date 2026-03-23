import { NavLink } from "react-router-dom";
import { useState } from "react";
import { RiArrowRightSLine, RiRecordCircleLine } from "react-icons/ri";

const SidebarItem = ({ to, label, children, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Si tiene hijos, renderizamos el componente tipo Acordeón
  if (children) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group
            ${isOpen 
              ? "bg-gray-50 text-emerald-700" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
          `}
        >
          <div className="flex items-center gap-3">
            {/* Renderiza el icono si existe */}
            {Icon && <Icon className={`text-xl ${isOpen ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />}
            <span>{label}</span>
          </div>
          
          {/* Flecha con rotación */}
          <RiArrowRightSLine 
            className={`text-lg transition-transform duration-300 ${isOpen ? "rotate-90 text-emerald-600" : "text-gray-400"}`} 
          />
        </button>

        {/* Contenedor de sub-menús con animación de entrada */}
        <div 
          className={`
            ml-6 mt-1 space-y-1 border-l-2 border-emerald-50 overflow-hidden transition-all duration-300
            ${isOpen ? "max-h-96 opacity-100 py-1" : "max-h-0 opacity-0"}
          `}
        >
          {children}
        </div>
      </div>
    );
  }

  // Si es un link simple
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group mb-1
        ${
          isActive
            ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      {/* Icono para links simples o punto sutil para sub-items */}
      {Icon ? (
        <Icon className="text-xl group-hover:scale-110 transition-transform" />
      ) : (
        <RiRecordCircleLine className="text-[10px] ml-1 opacity-40 group-hover:opacity-100" />
      )}
      
      <span>{label}</span>

      {/* Indicador de activo (opcional) */}
      <NavLink
        to={to}
        className={({ isActive }) => 
          `ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`
        }
      />
    </NavLink>
  );
};

export default SidebarItem;