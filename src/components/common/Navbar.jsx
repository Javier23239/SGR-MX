import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white shadow flex items-center justify-between px-6">
      <h1 className="font-semibold text-gray-700">
        Sistema de Gestión de Residuos
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.nombre}
        </span>

        <button
          onClick={logout}
          className="text-sm text-red-500 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;
