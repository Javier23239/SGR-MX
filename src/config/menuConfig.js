export const menuConfig = {
  ADMIN: [
    { label: "Dashboard", path: "/admin" },
    { label: "Usuarios", path: "/admin/usuarios" },
    { label: "Reportes", path: "/admin/reportes" },
    { label: "Rutas", path: "/admin/rutas" },
  ],

  CIUDADANO: [
    { label: "Dashboard", path: "/ciudadano" },
    { label: "Mis reportes", path: "/ciudadano/reportes" },
    { label: "Nuevo reporte", path: "/ciudadano/reportes/nuevo" },
  ],

  CONDUCTOR: [
    { label: "Dashboard", path: "/conductor" },
    { label: "Rutas asignadas", path: "/conductor/rutas" },
    { label: "Historial", path: "/conductor/historial" },
  ],
};
