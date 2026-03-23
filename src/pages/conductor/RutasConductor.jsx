import { useEffect, useState, useCallback } from "react";
import { reportService } from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";
import { 
  RiMapPin2Line, 
  RiRouteLine, 
  RiCheckboxCircleFill, 
  RiPlayCircleLine, 
  RiLoader4Line,
  RiInformationLine,
  RiCompass3Line
} from "react-icons/ri";

const RutasConductor = () => {
  const { user } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarRutas = useCallback(async () => {
    if (!user?.email) return;
    try {
      setCargando(true);
      const tareas = await reportService.getTasksByEmail(user.email);
      setReportes(tareas);
    } catch (error) {
      console.error("❌ Error al cargar rutas de la DB:", error);
    } finally {
      setCargando(false);
    }
  }, [user]);

  useEffect(() => {
    cargarRutas();
  }, [cargarRutas]);

  const iniciar = async (id) => {
    try {
      await reportService.updateStatus(id, "En ruta");
      await cargarRutas();
    } catch (error) {
      alert("No se pudo iniciar la ruta");
    }
  };

  const completar = async (id) => {
    try {
      await reportService.updateStatus(id, "Completada");
      await cargarRutas();
    } catch (error) {
      alert("No se pudo finalizar la recolección");
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-pulse">
        <RiLoader4Line className="text-5xl text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Sincronizando Rutas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      
      {/* Header Informativo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <RiRouteLine size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Mis Rutas Asignadas</h1>
            <p className="text-xs text-gray-400 font-medium">Oracle Database Sync: Activo</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-100">
            <RiCompass3Line className="animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-wider">{reportes.length} Pendientes</span>
        </div>
      </div>

      {/* Listado de Rutas */}
      {reportes.length === 0 ? (
        <div className="bg-white p-16 rounded-[2rem] border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
          <RiInformationLine size={48} className="text-gray-200 mb-4" />
          <h2 className="text-gray-400 font-bold text-lg">No hay tareas para hoy</h2>
          <p className="text-gray-300 text-sm">Relájate, tu hoja de ruta está limpia.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reportes.map((r) => (
            <div
              key={r.id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                
                {/* Info de la Ruta */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg uppercase">
                      ID: #{r.id}
                    </span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider border ${
                        r.estado === 'En ruta' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                        {r.estado}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {r.tipo}
                    </h3>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-gray-500 font-medium italic text-sm">
                            <RiMapPin2Line className="text-indigo-500" />
                            {r.ubicacion}
                        </div>
                        {r.descripcion && (
                            <p className="text-xs text-gray-400 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                {r.descripcion}
                            </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Botón de Acción - Cambia dinámicamente */}
                <div className="flex items-center justify-center md:justify-end">
                  {r.estado === "Asignado" ? (
                    <button
                      onClick={() => iniciar(r.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95"
                    >
                      <RiPlayCircleLine size={24} /> Iniciar Recorrido
                    </button>
                  ) : (
                    <button
                      onClick={() => completar(r.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-95"
                    >
                      <RiCheckboxCircleFill size={24} /> Finalizar Tarea
                    </button>
                  )}
                </div>
              </div>

              {/* Barra decorativa inferior según el estado */}
              <div className={`h-1.5 w-full ${r.estado === 'En ruta' ? 'bg-purple-400' : 'bg-blue-400'}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RutasConductor;