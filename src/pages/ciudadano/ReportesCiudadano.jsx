import { useEffect, useState } from "react";

const ReportesCiudadano = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("reportes")) || [];
    setReportes(data);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Mis reportes
      </h2>

      {reportes.length === 0 ? (
        <p className="text-gray-500">
          No hay reportes aún
        </p>
      ) : (
        <div className="space-y-4">
          {reportes.map((r, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded shadow"
            >
              <p className="font-semibold">{r.tipo}</p>
              <p className="text-sm text-gray-600">
                {r.descripcion}
              </p>
              <p className="text-sm">{r.ubicacion}</p>
              <span className="text-xs text-green-600">
                {r.estado}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportesCiudadano;
