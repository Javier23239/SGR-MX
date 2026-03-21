import { useEffect, useState, useCallback } from "react";
import { reportService } from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";

const RutasConductor = () => {
  const { user } = useAuth();
  const [reportes, setReportes] = useState([]);

  const cargarRutas = useCallback(() => {
    if (!user?.email) return;

    const rutas = reportService
      .getAll()
      .filter(
        (r) =>
          (r.estado === "Asignado" || r.estado === "En ruta") &&
          r.conductor === user.email
      );

    setReportes(rutas);
  }, [user]);

  
  useEffect(() => {
    cargarRutas();
  }, [cargarRutas]);

  const iniciar = (id) => {
    reportService.startRoute(id);
    cargarRutas();
  };

  const completar = (id) => {
    const reporte = reportService
      .getAll()
      .find((r) => r.id === id);

    if (!reporte) return;

    reportService.completeReport(id);
    guardarEnHistorial(reporte);
    cargarRutas();
  };

  const guardarEnHistorial = (reporte) => {
    const nuevaRuta = {
      id: Date.now(),
      conductor: user.email,
      tipo: reporte.tipo,
      ubicacion: reporte.ubicacion,
      fecha: new Date().toISOString().split("T")[0],
      estado: "Completada",
    };

    const rutasGuardadas =
      JSON.parse(localStorage.getItem("rutasConductor")) || [];

    rutasGuardadas.push(nuevaRuta);

    localStorage.setItem(
      "rutasConductor",
      JSON.stringify(rutasGuardadas)
    );
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Mis rutas
      </h1>

      {reportes.length === 0 && (
        <p className="text-gray-500">
          No tienes rutas activas
        </p>
      )}

      {reportes.map((r) => (
        <div
          key={r.id}
          className="bg-white p-4 rounded shadow mb-3"
        >
          <p className="font-medium">{r.tipo}</p>
          <p className="text-sm">{r.ubicacion}</p>

          <p className="text-xs text-gray-500 mt-1">
            Estado: {r.estado}
          </p>

          {r.estado === "Asignado" && (
            <button
              onClick={() => iniciar(r.id)}
              className="bg-purple-600 text-white px-3 py-1 rounded mt-2 hover:bg-purple-700 transition"
            >
              Iniciar ruta
            </button>
          )}

          {r.estado === "En ruta" && (
            <button
              onClick={() => completar(r.id)}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700 transition"
            >
              Marcar como recolectado
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RutasConductor;