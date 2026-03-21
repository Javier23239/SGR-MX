import { useEffect, useState } from "react";
import { reportService } from "../../services/report.service";

const GestionReportes = () => {

  const [reportes, setReportes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [conductores, setConductores] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {

    const data = reportService.getAll();
    setReportes(data);

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // obtener solo conductores
    const soloConductores = users.filter(
      (u) => u.rol === "CONDUCTOR"
    );

    setConductores(soloConductores);
  };

  const asignar = (id, conductorEmail) => {

    reportService.assignReport(id, conductorEmail);

    cargarDatos();
  };

  const reportesFiltrados = reportes.filter((r) =>
    r.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>

      <h1 className="text-xl font-semibold mb-4">
        Gestión de reportes
      </h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por tipo o ubicación..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <div className="space-y-3">

        {reportesFiltrados.length === 0 && (
          <p className="text-gray-500">
            No hay reportes
          </p>
        )}

        {reportesFiltrados.map((r) => (

          <div
            key={r.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >

            <div>

              <p className="font-medium">
                {r.tipo}
              </p>

              <p className="text-sm text-gray-500">
                {r.ubicacion}
              </p>

              <p className="text-xs mt-1">
                Estado:{" "}
                <span className="font-semibold">
                  {r.estado}
                </span>
              </p>

              {r.conductor && (
                <p className="text-xs text-gray-500">
                  Conductor: {r.conductor}
                </p>
              )}

            </div>

            {/* asignar conductor */}
            {r.estado === "Pendiente" && (

              <select
                onChange={(e) =>
                  asignar(r.id, e.target.value)
                }
                defaultValue=""
                className="border p-2 rounded"
              >

                <option value="" disabled>
                  Asignar conductor
                </option>

                {conductores.map((c) => (

                  <option
                    key={c.id}
                    value={c.email}
                  >
                    {c.nombre}
                  </option>

                ))}

              </select>

            )}

          </div>

        ))}

      </div>

    </div>
  );
};

export default GestionReportes;