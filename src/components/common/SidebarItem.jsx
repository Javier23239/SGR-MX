import { NavLink } from "react-router-dom";
import { useState } from "react";

const SidebarItem = ({ to, label, children }) => {
  const [open, setOpen] = useState(false);

  if (children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left px-4 py-2 rounded text-sm hover:bg-green-600"
        >
          {label}
        </button>

        {open && (
          <div className="ml-4 mt-1 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded text-sm ${
          isActive ? "bg-green-800" : "hover:bg-green-600"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export default SidebarItem;
