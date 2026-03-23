import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import RegistroCiudadano from "../pages/auth/RegistroCiudadano"; 
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/public/Home";

// --- SECCION ADMIN ---
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GestionReportes from "../pages/admin/GestionReportes";
import Usuarios from "../pages/admin/Usuarios"; 

// --- SECCION CIUDADANO ---
import DashboardCiudadano from "../pages/ciudadano/DashboardCiudadano";
import ReportesCiudadano from "../pages/ciudadano/ReportesCiudadano";
import NuevoReporte from "../pages/ciudadano/NuevoReporte";

// --- SECCION CONDUCTOR ---
import DashboardConductor from "../pages/conductor/DashboardConductor";
import RutasConductor from "../pages/conductor/RutasConductor";
import HistorialConductor from "../pages/conductor/HistorialConductor";

const AppRouter = () => {
  return (
    <Routes>
      {/* 1. RUTAS PÚBLICAS (Sin protección) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro-ciudadano" element={<RegistroCiudadano />} /> {/* <-- Nueva Ruta para vecinos */}

      {/* 2. RUTAS DE ADMINISTRADOR (Protegidas) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAdmin />} />
        <Route path="reportes" element={<GestionReportes />} />
        <Route path="usuarios" element={<Usuarios />} />
      </Route>

      {/* 3. RUTAS DE CIUDADANO (Protegidas) */}
      <Route
        path="/ciudadano"
        element={
          <ProtectedRoute role="CIUDADANO">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardCiudadano />} />
        <Route path="reportes" element={<ReportesCiudadano />} />
        <Route path="reportes/nuevo" element={<NuevoReporte />} />
      </Route>

      {/* 4. RUTAS DE CONDUCTOR (Protegidas) */}
      <Route
        path="/conductor"
        element={
          <ProtectedRoute role="CONDUCTOR">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardConductor />} />
        <Route path="rutas" element={<RutasConductor />} />
        <Route path="historial" element={<HistorialConductor />} />
      </Route>

      {/* 5. RUTA 404 */}
      <Route path="*" element={<div className="p-10 text-center"><h1>404 - Página no encontrada</h1></div>} />
    </Routes>
  );
};

export default AppRouter;