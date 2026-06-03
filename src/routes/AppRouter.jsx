import { Routes, Route } from "react-router-dom";

// ==============================
// PAGINAS PUBLICAS
// ==============================
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import RegistroCiudadano from "../pages/auth/RegistroCiudadano";
import VerificarOTP from "../pages/auth/VerificarOTP";

// ==============================
// COMPONENTES
// ==============================
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layout/MainLayout";

// ==============================
// ADMIN
// ==============================
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GestionReportes from "../pages/admin/GestionReportes";
import Usuarios from "../pages/admin/Usuarios";

// ==============================
// CIUDADANO
// ==============================
import DashboardCiudadano from "../pages/ciudadano/DashboardCiudadano";
import ReportesCiudadano from "../pages/ciudadano/ReportesCiudadano";
import NuevoReporte from "../pages/ciudadano/NuevoReporte";

// ==============================
// CONDUCTOR / RECOLECTOR
// ==============================
import DashboardConductor from "../pages/conductor/DashboardConductor";
import RutasConductor from "../pages/conductor/RutasConductor";
import HistorialConductor from "../pages/conductor/HistorialConductor";
import MapaRuta from "../pages/conductor/MapaRuta";

const AppRouter = () => {

  return (

    <Routes>

      {/* ========================================= */}
      {/* RUTAS PUBLICAS */}
      {/* ========================================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/registro-ciudadano"
        element={<RegistroCiudadano />}
      />

      <Route
        path="/verificar-otp"
        element={<VerificarOTP />}
      />

      {/* ========================================= */}
      {/* ADMIN */}
      {/* ========================================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<DashboardAdmin />}
        />

        <Route
          path="reportes"
          element={<GestionReportes />}
        />

        <Route
          path="usuarios"
          element={<Usuarios />}
        />

      </Route>

      {/* RUTAS DE CIUDADANO */}
      <Route
        path="/ciudadano"
        element={
          <ProtectedRoute role="CIUDADANO"> 
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<DashboardCiudadano />}
        />

        <Route
          path="reportes"
          element={<ReportesCiudadano />}
        />

        <Route
          path="reportes/nuevo"
          element={<NuevoReporte />}
        />

      </Route>

      {/* ========================================= */}
      {/* RECOLECTOR */}
      {/* ========================================= */}

      <Route
        path="/conductor"
        element={
          <ProtectedRoute role="RECOLECTOR">
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<DashboardConductor />}
        />

        <Route
          path="rutas"
          element={<RutasConductor />}
        />

        <Route
          path="historial"
          element={<HistorialConductor />}
        />

        <Route
          path="mapa"
          element={<MapaRuta />}
        />

      </Route>

      <Route path="*" element={<div className="p-10 text-center"><h1>404 - Página no encontrada</h1></div>} />
    </Routes>

  );

};

export default AppRouter;