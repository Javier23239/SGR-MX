import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  RiHistoryLine, 
  RiMapPin2Line, 
  RiTimeLine, 
  RiFileList3Line,
  RiCheckboxCircleLine,
  RiLoader3Line
} from "react-icons/ri";

const ReportesCiudadano = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/solicitudes/${user?.email}`);
        const data = await response.json();
        setReportes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar el historial:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchHistorial();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-emerald-600">
        <RiLoader3Line className="text-5xl animate-spin mb-4" />
        <span className="font-black uppercase tracking-widest text-xs">Cargando Historial...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Encabezado de Sección */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <RiHistoryLine className="text-emerald-600" /> Mis Reportes
          </h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona y revisa el estado de tus solicitudes de recolección.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 shadow-sm">
          <RiFileList3Line />
          <span className="font-bold text-sm">Total: {reportes.length}</span>
        </div>
      </div>

      {reportes.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-sm text-center border-2 border-dashed border-gray-200">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiFileList3Line className="text-4xl text-gray-300" />
          </div>
          <h3 className="text-gray-800 font-bold text-lg">No hay reportes aún</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
            Cuando realices una solicitud de recolección, aparecerá en esta lista.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportes.map((r) => {
            // Soporte para Oracle (Mayúsculas) y Node (Minúsculas)
            const descRaw = r.DESCRIPCION || r.descripcion || "";
            const fechaRaw = r.FECHA_SOLICITUD || r.fecha_solicitud;
            const idRaw = r.ID_SOLICITUD || r.id;
            const estadoRaw = r.ESTADO || r.estado;

            const partes = descRaw.includes('|') ? descRaw.split('|') : [descRaw, "Sin detalles extra"];
            
            return (
              <div
                key={idRaw}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div className="p-6">
                  {/* Badge de ID y Estado */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-400 px-2 py-1 rounded-md">
                      #{idRaw}
                    </span>
                    <EstadoBadge estado={estadoRaw} />
                  </div>

                  {/* Título (Tipo de residuo) */}
                  <h3 className="font-black text-gray-800 text-xl leading-tight mb-4 group-hover:text-emerald-600 transition-colors">
                    {partes[0].replace('[', '').replace(']', '') || "Reporte General"}
                  </h3>

                  {/* Info Detallada */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <RiMapPin2Line className="text-emerald-500 mt-1 text-lg flex-shrink-0" />
                      <p className="leading-snug">
                        <span className="font-bold text-gray-800 block text-xs uppercase tracking-tighter">Ubicación</span>
                        {partes[1]?.replace('Ubicación:', '').trim() || "No especificada"}
                      </p>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <RiTimeLine className="text-emerald-500 mt-1 text-lg flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-800 block text-xs uppercase tracking-tighter">Fecha de Solicitud</span>
                        <p className="text-gray-600 font-medium">
                          {fechaRaw ? (
                            new Date(fechaRaw).toLocaleString('es-MX', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          ) : (
                            "Fecha no disponible"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer de la tarjeta */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SGR-MX System</span>
                  {(estadoRaw === 'Recolectado' || estadoRaw === 'Completada') && (
                    <RiCheckboxCircleLine className="text-emerald-500 text-xl" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const EstadoBadge = ({ estado }) => {
  const styles = {
    Pendiente: "bg-yellow-50 text-yellow-600 border-yellow-100",
    Asignado: "bg-blue-50 text-blue-600 border-blue-100",
    "En ruta": "bg-purple-50 text-purple-600 border-purple-100",
    Recolectado: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Completada: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border shadow-sm ${styles[estado] || "bg-gray-50 text-gray-400"}`}>
      {estado || "Desconocido"}
    </span>
  );
};

export default ReportesCiudadano;