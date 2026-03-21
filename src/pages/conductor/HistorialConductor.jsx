import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const HistorialConductor = () => {
  const [rutas, setRutas] = useState([]);


  const { user } = useAuth();

    useEffect(() => {
    const data =
        JSON.parse(localStorage.getItem("rutasConductor")) || [];

    const rutasDelConductor = data.filter(
        (r) => r.conductor === user.email
    );

    setRutas(rutasDelConductor);
    }, [user]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Historial de rutas
      </h2>

      {rutas.length === 0 ? (
        <p className="text-gray-500">
          No hay rutas registradas aún
        </p>
      ) : (
        <div className="space-y-4">
          {rutas.map((r, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded shadow"
            >
              <p className="font-semibold">
                {r.zona}
              </p>

              <p className="text-sm text-gray-600">
                Fecha: {r.fecha}
              </p>

              <p className="text-sm">
                Incidencias atendidas: {r.totalIncidencias}
              </p>

              <span
                className={`text-xs ${
                  r.estado === "Completada"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {r.estado}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default HistorialConductor;