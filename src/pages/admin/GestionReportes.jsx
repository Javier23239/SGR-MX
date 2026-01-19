import { useEffect, useState } from "react";
import { reportService } from "../../services/report.service";

const GestionReportes = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    setReportes(reportService.getAll());
  }, []);

  const asignar = (id) => {
    reportService.assignReport(id, "Juan Pérez");
    setReportes(reportService.getAll());
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Gestión de reportes
      </h1>

      <div className="space-y-3">
        {reportes.map((r, i) => (
          <div key={i} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <p className="font-medium">{r.tipo}</p>
              <p className="text-sm text-gray-500">{r.ubicacion}</p>
              <p className="text-xs">{r.estado}</p>
            </div>

            {r.estado === "Pendiente" && (
              <button
                onClick={() => asignar(i)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Asignar conductor
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionReportes;
