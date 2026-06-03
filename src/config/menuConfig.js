import { 
  RiNavigationFill,
  RiDashboardLine, 
  RiRouteLine, 
  RiHistoryLine,
  RiHome4Line,       
  RiFileList3Line,
  RiAddCircleLine,
  RiGroupLine,
  RiFileSettingsLine
} from "react-icons/ri";

export const menuConfig = {
  // --- ADMINISTRADOR ---
  ADMIN: [
    { label: "Dashboard", path: "/admin", icon: RiDashboardLine },
    { label: "Usuarios", path: "/admin/usuarios", icon: RiGroupLine },
    { label: "Reportes", path: "/admin/reportes", icon: RiFileSettingsLine },
  ],

  // --- CIUDADANO  ---
  CIUDADANO: [
    { label: "Dashboard", path: "/ciudadano", icon: RiHome4Line },
    { label: "Mis reportes", path: "/ciudadano/reportes", icon: RiFileList3Line },
    { label: "Nuevo reporte", path: "/ciudadano/reportes/nuevo", icon: RiAddCircleLine },
  ],

  // --- RECOLECTOR ---
  RECOLECTOR: [
    { 
      label: "Dashboard", 
      path: "/conductor", 
      icon: RiDashboardLine 
    },
    { 
      label: "Rutas asignadas", 
      path: "/conductor/rutas", 
      icon: RiRouteLine 
    },
    { 
      label: "Historial", 
      path: "/conductor/historial", 
      icon: RiHistoryLine 
    },
    {
      label: "Mapa de Ruta", 
      path: "/conductor/mapa", 
      icon: RiNavigationFill 
    },
  ],
};