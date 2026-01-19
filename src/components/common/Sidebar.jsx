import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { menuConfig } from "../../config/menuConfig";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const menu = menuConfig[user.rol] || [];

  return (
    <aside className="w-64 bg-white shadow h-full">
      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
  );
};

export default Sidebar;
