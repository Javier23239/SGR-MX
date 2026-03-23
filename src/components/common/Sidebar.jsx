import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { menuConfig } from "../../config/menuConfig";
import { RiLeafLine, RiUserLine } from "react-icons/ri";

const Sidebar = ({ open, close }) => {
  const { user } = useAuth();
  if (!user) return null;

  const menu = menuConfig[user.rol] || [];

  return (
    <>
      {/* Overlay móvil con desenfoque */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={close}
        />
      )}

      <aside
        className={`
          bg-white w-72 flex-shrink-0
          fixed md:static
          top-0 left-0
          h-full md:h-[calc(100vh-64px)] 
          border-r border-gray-100
          transform transition-all duration-300 ease-in-out
          z-40 shadow-2xl md:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header del Sidebar (Solo visible en móvil para cerrar) */}
        <div className="p-6 flex items-center gap-3 md:hidden">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <RiLeafLine className="text-xl" />
          </div>
          <span className="font-black text-gray-800 tracking-tighter uppercase">SGR-MX</span>
        </div>

        <div className="px-4 py-6">
          {/* Badge de Rol del Usuario */}
          <div className="mb-8 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-emerald-600">
                <RiUserLine />
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Acceso</p>
                <p className="text-xs font-bold text-gray-700">{user.rol}</p>
             </div>
          </div>

          <nav className="space-y-1">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Menú Principal</p>
            
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={close}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {/* Si tu menuConfig tiene iconos, se renderizarán aquí */}
                {item.icon && (
                  <item.icon className={`text-xl transition-transform group-hover:scale-110`} />
                )}
                <span>{item.label}</span>
                
                {/* Indicador activo visual */}
                <div className="ml-auto">
                   <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 transition-opacity active-dot`} />
                </div>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer del Sidebar (Opcional) */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-50">
           <p className="text-[10px] text-gray-300 font-bold text-center uppercase tracking-widest">Oracle Cloud Infrastructure</p>
        </div>
      </aside>
      
      {/* Estilos CSS adicionales para el punto activo */}
      <style dangerouslySetInnerHTML={{ __html: `
        .active.group .active-dot { opacity: 1 !important; }
      `}} />
    </>
  );
};

export default Sidebar;