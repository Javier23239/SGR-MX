import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { menuConfig } from "../../config/menuConfig";

const Sidebar = ({ open, close }) => {

  const { user } = useAuth();
  if (!user) return null;

  const menu = menuConfig[user.rol] || [];

  return (
    <>
      {/* Overlay móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`
        bg-white shadow w-64 flex-shrink-0

        fixed md:static
        top-14 md:top-0

        h-[calc(100vh-56px)] md:h-auto

        transform transition-transform duration-300

        z-40

        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >

        <nav className="p-4 space-y-2">

          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={close}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

        </nav>

      </aside>
    </>
  );
};

export default Sidebar;