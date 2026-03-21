import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/public/Home";

// Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GestionReportes from "../pages/admin/GestionReportes";
import Usuarios from "../pages/admin/Usuarios";

// Ciudadano
import DashboardCiudadano from "../pages/ciudadano/DashboardCiudadano";
import ReportesCiudadano from "../pages/ciudadano/ReportesCiudadano";
import NuevoReporte from "../pages/ciudadano/NuevoReporte";

// Conductor
import DashboardConductor from "../pages/conductor/DashboardConductor";
import RutasConductor from "../pages/conductor/RutasConductor";
import HistorialConductor from "../pages/conductor/HistorialConductor";

const AppRouter = () => {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
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
        <Route path="usuarios" element={<Usuarios/>} />
      </Route>

      {/* CIUDADANO */}
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

      {/* CONDUCTOR */}
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

    </Routes>
  );
};

export default AppRouter;