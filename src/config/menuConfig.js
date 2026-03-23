import { 
  RiNavigationFill,
  RiDashboardLine, 
  RiRouteLine, 
  RiHistoryLine 
} from "react-icons/ri";

export const menuConfig = {
  ADMIN: [
    { label: "Dashboard", path: "/admin" },
    { label: "Usuarios", path: "/admin/usuarios" },
    { label: "Reportes", path: "/admin/reportes" },
  ],

  CIUDADANO: [
    { label: "Dashboard", path: "/ciudadano" },
    { label: "Mis reportes", path: "/ciudadano/reportes" },
    { label: "Nuevo reporte", path: "/ciudadano/reportes/nuevo" },
  ],


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