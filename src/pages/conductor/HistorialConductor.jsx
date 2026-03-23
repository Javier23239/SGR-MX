import { useEffect, useState } from "react";
import { reportService } from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";
import { 
  RiHistoryLine, 
  RiCheckboxCircleLine, 
  RiMapPinLine, 
  RiCalendarEventLine,
  RiHashtag,
  RiFileShield2Line,
  RiLoader3Line
} from "react-icons/ri";

const HistorialConductor = () => {
  const [rutas, setRutas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const cargarHistorial = async () => {
      if (!user?.email) return;
      try {
        setCargando(true);
        const data = await reportService.getHistoryByEmail(user.email);
        setRutas(data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, [user]);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <RiLoader3Line className="text-4xl text-emerald-500 animate-spin mb-2" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Recuperando Bitácora...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      
      {/* Header del Historial */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <RiHistoryLine className="text-emerald-600" /> Historial de Trabajo
          </h2>
          <p className="text-gray-500 text-sm mt-1">Registro detallado de recolecciones finalizadas con éxito.</p>
        </div>
        <div className="relative z-10 bg-emerald-50 px-6 py-2 rounded-2xl border border-emerald-100">
            <p className="text-[10px] font-black text-emerald-600 uppercase">Completadas</p>
            <p className="text-2xl font-black text-emerald-700">{rutas.length}</p>
        </div>
        {/* Decoración de fondo */}
        <RiFileShield2Line className="absolute -right-4 -bottom-4 text-emerald-500/5 size-32" />
      </div>

      {/* Listado de Registros */}
      {rutas.length === 0 ? (
        <div className="bg-white p-16 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiHistoryLine className="text-gray-300 text-3xl" />
          </div>
          <h3 className="text-gray-400 font-bold text-lg">Sin registros previos</h3>
          <p className="text-gray-300 text-sm max-w-xs mx-auto">Las rutas que completes aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {rutas.map((r) => (
            <div
              key={r.id}
              className="group bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Indicador lateral de éxito */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase flex items-center gap-1">
                      <RiCheckboxCircleLine size={14} /> {r.estado || 'Completado'}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <RiHashtag /> {r.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-gray-800 text-lg leading-tight">
                      {r.descripcion || 'Sin descripción del reporte'}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm font-medium">
                      <RiMapPinLine className="text-emerald-500" />
                      {r.ubicacion}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-end items-start md:items-end border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                    <RiCalendarEventLine className="text-emerald-500 text-sm" />
                    {new Date(r.fecha).toLocaleDateString('es-MX', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialConductor;