import { useAuth } from "../../context/AuthContext";
import { 
  RiMenu2Line, 
  RiLogoutCircleRLine, 
  RiUser3Line, 
  RiNotification3Line,
  RiSettings4Line
} from "react-icons/ri";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const formatRole = (role) => {
    if (!role) return "CIUDADANO";
    if (role === "VECINO") return "CIUDADANO"; 
    return role;
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 md:hidden"
        >
          <RiMenu2Line className="text-2xl" />
        </button>

        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-100">
            <span className="text-white font-black text-xs">SGR</span>
          </div>
          <h1 className="font-black text-gray-800 tracking-tight text-sm uppercase">
            Sistema de Gestión de Residuos
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        
        <div className="hidden sm:flex items-center gap-1 border-r border-gray-100 pr-3 mr-1">
          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
            <RiNotification3Line className="text-xl" />
          </button>
          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
            <RiSettings4Line className="text-xl" />
          </button>
        </div>

        {/* Perfil  */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-gray-800 leading-none">
              {user?.nombre || "Usuario"}
            </p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
              {formatRole(user?.rol)}
            </p>
          </div>

          <div className="group relative">
            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm group-hover:border-emerald-200 transition-all overflow-hidden">
              {user?.foto ? (
                <img src={user.foto} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <RiUser3Line className="text-gray-400 text-xl" />
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="ml-2 p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <RiLogoutCircleRLine className="text-xl" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;