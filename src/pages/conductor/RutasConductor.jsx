import { useEffect, useState, useCallback } from "react";
import { reportService } from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; 
import { 
  RiMapPin2Line, 
  RiRouteLine, 
  RiCheckboxCircleFill, 
  RiPlayCircleLine, 
  RiLoader4Line,
  RiInformationLine,
  RiCompass3Line,
  RiMap2Line
} from "react-icons/ri";

const RutasConductor = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarRutas = useCallback(async () => {
    if (!user?.email) return;
    try {
      setCargando(true);
      const tareas = await reportService.getTasksByEmail(user.email);
      setReportes(tareas);
    } catch (error) {
      console.error("Error al cargar rutas:", error);
    } finally {
      setCargando(false);
    }
  }, [user]);

  useEffect(() => {
    cargarRutas();
  }, [cargarRutas]);

  const iniciarRuta = async (reporte) => {
    try {
      await reportService.updateStatus(reporte.ID_SOLICITUD, "En ruta");
      
      navigate('/conductor/mapa', { 
        state: { 
          latDestino: reporte.LATITUD, 
          lngDestino: reporte.LONGITUD,
          descripcion: reporte.DESCRIPCION
        } 
      });
    } catch (error) {
      alert("Error al iniciar el recorrido");
    }
  };

  const completar = async (id) => {
    if (!window.confirm("¿Confirmas que has finalizado la recolección?")) return;
    try {
      await reportService.updateStatus(id, "Completada");
      await cargarRutas();
    } catch (error) {
      alert("No se pudo finalizar la recolección");
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <RiLoader4Line className="text-5xl text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Sincronizando Hoja de Ruta...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      
      {/* Header  */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <RiRouteLine size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Mi Jornada</h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">Unidad: {user?.email.split('@')[0]}</p>
          </div>
        </div>
        <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3">
            <RiCompass3Line className="text-indigo-400 animate-spin-slow" size={20} />
            <span className="text-xs font-black uppercase">{reportes.length} Pendientes</span>
        </div>
      </div>

      {/* Listado  */}
      {reportes.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
          <RiInformationLine size={60} className="text-gray-100 mx-auto mb-4" />
          <h2 className="text-gray-400 font-bold text-xl">Ruta Despejada</h2>
          <p className="text-gray-300 text-sm mt-1">No tienes recolecciones asignadas por ahora.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reportes.map((r) => (
            <div
              key={r.ID_SOLICITUD}
              className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="p-8 flex flex-col md:flex-row justify-between gap-8">
                
                <div className="space-y-5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg">
                      #{r.ID_SOLICITUD}
                    </span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase border ${
                        r.ESTADO === 'En ruta' 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'bg-white text-gray-400 border-gray-200'
                    }`}>
                        {r.ESTADO}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-start gap-3 bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                        <RiMapPin2Line className="text-indigo-500 mt-1 flex-shrink-0" size={22} />
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dirección de Recolección</span>
                            <p className="text-gray-800 font-black text-lg leading-tight mt-1">{r.DIRECCION || "Ubicación por GPS"}</p>
                        </div>
                    </div>
                    
                    {r.DESCRIPCION && (
                        <p className="mt-4 text-sm text-gray-400 font-medium pl-2 border-l-2 border-indigo-100">
                           {r.DESCRIPCION.split('|')[0].replace(/[[\]]/g, '')}
                        </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                  {r.ESTADO === "Asignado" ? (
                    <button
                      onClick={() => iniciarRuta(r)}
                      className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-gray-900 text-white font-black px-10 py-5 rounded-[1.5rem] transition-all shadow-xl shadow-indigo-100 active:scale-95"
                    >
                      <RiPlayCircleLine size={24} /> Iniciar Ruta
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate('/conductor/mapa', { state: { latDestino: r.LATITUD, lngDestino: r.LONGITUD, descripcion: r.DESCRIPCION }})}
                        className="flex items-center justify-center gap-3 bg-white border-2 border-indigo-600 text-indigo-600 font-black px-10 py-4 rounded-[1.5rem] hover:bg-indigo-50 transition-all"
                      >
                        <RiMap2Line size={24} /> Ver Mapa
                      </button>
                      <button
                        onClick={() => completar(r.ID_SOLICITUD)}
                        className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-10 py-5 rounded-[1.5rem] transition-all shadow-xl shadow-emerald-100 active:scale-95"
                      >
                        <RiCheckboxCircleFill size={24} /> Finalizar
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="h-1.5 w-full bg-gray-50">
                <div 
                  className={`h-full transition-all duration-700 ${r.ESTADO === 'En ruta' ? 'w-full bg-amber-500' : 'w-1/4 bg-indigo-600'}`} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RutasConductor;