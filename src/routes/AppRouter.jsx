import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layout/MainLayout";

// Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GestionReportes from "../pages/admin/GestionReportes";

// Ciudadano
import DashboardCiudadano from "../pages/ciudadano/DashboardCiudadano";
import ReportesCiudadano from "../pages/ciudadano/ReportesCiudadano";
import NuevoReporte from "../pages/ciudadano/NuevoReporte";

// Conductor
import DashboardConductor from "../pages/conductor/DashboardConductor";
import RutasConductor from "../pages/conductor/RutasConductor";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
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
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
