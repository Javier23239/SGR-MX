import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DashboardCiudadano = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reportes")) || [];
    setReportes(data);
  }, []);

  const total = reportes.length;
  const pendientes = reportes.filter(r => r.estado === "Pendiente").length;
  const asignados = reportes.filter(r => r.estado === "Asignado").length;
  const enRuta = reportes.filter(r => r.estado === "En ruta").length;
  const completados = reportes.filter(r => r.estado === "Recolectado").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Panel del ciudadano
        </h1>

        <Link
          to="/ciudadano/reportes/nuevo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nuevo reporte
        </Link>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total" value={total} />
        <Card title="Pendientes" value={pendientes} />
        <Card title="En proceso" value={asignados + enRuta} />
        <Card title="Completados" value={completados} />
      </div>

      {/* Últimos reportes */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">Últimos reportes</h2>

        {reportes.length === 0 ? (
          <p className="text-gray-500">
            Aún no has creado reportes
          </p>
        ) : (
          <ul className="space-y-3">
            {reportes.slice(-5).reverse().map((r, i) => (
              <li
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{r.tipo}</p>
                  <p className="text-sm text-gray-500">
                    {r.ubicacion}
                  </p>
                </div>

                <EstadoBadge estado={r.estado} />
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/ciudadano/reportes"
          className="text-green-600 text-sm mt-4 inline-block"
        >
          Ver todos los reportes →
        </Link>
      </div>
    </div>
  );
};

export default DashboardCiudadano;

/* 🔹 Componentes internos */

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const EstadoBadge = ({ estado }) => {
  const styles = {
    Pendiente: "bg-yellow-100 text-yellow-700",
    Asignado: "bg-blue-100 text-blue-700",
    "En ruta": "bg-purple-100 text-purple-700",
    Recolectado: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded ${styles[estado]}`}
    >
      {estado}
    </span>
  );
};
