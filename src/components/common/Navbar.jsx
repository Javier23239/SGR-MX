import { useAuth } from "../../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="h-14 bg-white shadow flex items-center justify-between px-6">

      <div className="flex items-center gap-4">

        {/* BOTON HAMBURGUESA */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <h1 className="font-semibold text-gray-700">
          Sistema de Gestión de Residuos
        </h1>

      </div>

      <div className="flex items-center gap-4">

        <span className="text-sm text-gray-600">
          {user?.nombre}
        </span>

        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Cerrar sesión
        </button>

      </div>

    </header>
  );
};

export default Navbar;