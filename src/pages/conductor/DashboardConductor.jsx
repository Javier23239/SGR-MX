import { useEffect, useState, useCallback } from "react";
import { reportService } from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";

const DashboardConductor = () => {
  const { user } = useAuth();
  const [rutaActiva, setRutaActiva] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [reportes, setReportes] = useState([]);

  const cargarReportes = useCallback(() => {
    if (!user?.email) return;

    const asignados = reportService
      .getAll()
      .filter(
        (r) =>
          (r.estado === "Asignado" || r.estado === "En ruta") &&
          r.conductor === user.email
      );

    setReportes(asignados);
  }, [user]);

  useEffect(() => {
    cargarReportes();
  }, [cargarReportes]);

  const iniciarRuta = () => {
    setRutaActiva(true);
    setProgreso(10);
  };

  const avanzar = () => {
    setProgreso((prev) => Math.min(prev + 20, 100));
  };

  const finalizarRuta = () => {
    reportes.forEach((r) => {
      reportService.completeReport(r.id);
    });

    setRutaActiva(false);
    setProgreso(100);

    cargarReportes(); 
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Panel del conductor
      </h1>

      {/* Ruta activa */}
      <div className="bg-white p-6 rounded shadow">
        <p className="font-medium mb-2">
          Estado de la ruta
        </p>

        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-green-600 h-3 rounded"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <p className="text-sm mt-2">
          Progreso: {progreso}%
        </p>

        <div className="mt-4 space-x-2">
          {!rutaActiva && reportes.length > 0 && (
            <button
              onClick={iniciarRuta}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Iniciar ruta
            </button>
          )}

          {rutaActiva && progreso < 100 && (
            <button
              onClick={avanzar}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Avanzar
            </button>
          )}

          {rutaActiva && progreso >= 100 && (
            <button
              onClick={finalizarRuta}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Finalizar ruta
            </button>
          )}
        </div>
      </div>

      {/* Lista de reportes */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">
          Puntos de recolección
        </h2>

        {reportes.length === 0 ? (
          <p className="text-gray-500">
            No tienes rutas asignadas
          </p>
        ) : (
          <ul className="space-y-3">
            {reportes.map((r) => (
              <li
                key={r.id}
                className="border-b pb-2 flex justify-between"
              >
                <div>
                  <p className="font-medium">{r.tipo}</p>
                  <p className="text-sm text-gray-500">
                    {r.ubicacion}
                  </p>
                </div>

                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded">
                  {r.estado}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardConductor;