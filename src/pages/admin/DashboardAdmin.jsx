import { useEffect, useState } from "react";
import { reportService } from "../../services/report.service";

const DashboardAdmin = () => {

  const [stats, setStats] = useState([]);

  useEffect(() => {

    const reportes = reportService.getAll();
    const usuarios =
      JSON.parse(localStorage.getItem("users")) || [];

    const activos = reportes.filter(
      r => r.estado === "Asignado" || r.estado === "En ruta"
    );

    const recolectados = reportes.filter(
      r => r.estado === "Recolectado"
    );

    const rutasProceso = reportes.filter(
      r => r.estado === "En ruta"
    );

    setStats([
      {
        title: "Usuarios registrados",
        value: usuarios.length,
        color: "bg-blue-500",
      },
      {
        title: "Reportes activos",
        value: activos.length,
        color: "bg-yellow-500",
      },
      {
        title: "Rutas en proceso",
        value: rutasProceso.length,
        color: "bg-purple-500",
      },
      {
        title: "Recolectados",
        value: recolectados.length,
        color: "bg-green-500",
      },
    ]);

  }, []);

  return (
    <div>

      <h2 className="text-2xl font-semibold mb-6">
        Dashboard Administrador
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} text-white p-6 rounded-xl shadow`}
          >
            <p className="text-sm opacity-80">
              {stat.title}
            </p>

            <p className="text-3xl font-bold mt-2">
              {stat.value}
            </p>

          </div>
        ))}

      </div>

      {/* Actividad reciente */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">

        <h3 className="text-lg font-semibold mb-4">
          Actividad reciente
        </h3>

        <ul className="space-y-2 text-sm text-gray-600">

          {reportService
            .getAll()
            .slice(-5)
            .reverse()
            .map((r, i) => (
              <li key={i} className="border-b pb-2">
                {r.tipo} - {r.ubicacion} ({r.estado})
              </li>
            ))}

        </ul>

      </div>

    </div>
  );
};

export default DashboardAdmin;