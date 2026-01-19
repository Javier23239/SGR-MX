import { useEffect, useState } from "react";
import { reportService } from "../../services/report.service";

const RutasConductor = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    setReportes(
      reportService.getAll().filter(
        r => r.estado === "Asignado" || r.estado === "En ruta"
      )
    );
  }, []);

  const iniciar = (id) => {
    reportService.startRoute(id);
    setReportes(reportService.getAll());
  };

  const completar = (id) => {
    reportService.completeReport(id);
    setReportes(reportService.getAll());
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Mis rutas
      </h1>

      {reportes.map((r, i) => (
        <div key={i} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-medium">{r.tipo}</p>
          <p className="text-sm">{r.ubicacion}</p>

          {r.estado === "Asignado" && (
            <button
              onClick={() => iniciar(i)}
              className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
            >
              Iniciar ruta
            </button>
          )}

          {r.estado === "En ruta" && (
            <button
              onClick={() => completar(i)}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
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
