import { useEffect, useState, useCallback } from "react";
import { reportService } from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";
import { 
  RiTruckLine, 
  RiMapPinRangeLine, 
  RiCheckboxCircleLine, 
  RiSteering2Line,
  RiPinDistanceLine,
  RiInformationLine,
  RiArrowRightSLine,
  RiHistoryLine
} from "react-icons/ri";

const DashboardConductor = () => {
  const { user } = useAuth();
  const [rutaActiva, setRutaActiva] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [reportes, setReportes] = useState([]);

  const cargarReportes = useCallback(async () => {
    if (!user?.email) return;
    try {
      const tareas = await reportService.getTasksByEmail(user.email);
      setReportes(tareas);
      
      const hayRutaEnCurso = tareas.some(t => t.estado === 'En ruta');
      if (hayRutaEnCurso) {
        setRutaActiva(true);
        if (progreso === 0) setProgreso(30); 
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  }, [user, progreso]);

  useEffect(() => {
    cargarReportes();
  }, [cargarReportes]);

  const iniciarRuta = async () => {
    try {
      for (const r of reportes) {
        await reportService.updateStatus(r.id, 'En ruta');
      }
      setRutaActiva(true);
      setProgreso(15);
      cargarReportes();
    } catch (error) {
      alert("Error al iniciar ruta");
    }
  };

  const avanzar = () => setProgreso((prev) => Math.min(prev + 25, 100));

  const finalizarRuta = async () => {
    try {
      for (const r of reportes) {
        await reportService.updateStatus(r.id, 'Completada');
      }
      setRutaActiva(false);
      setProgreso(0);
      alert("¡Misión cumplida! Ruta guardada en Oracle.");
      cargarReportes();
    } catch (error) {
      console.error("Error al finalizar:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      
      {/* Header Conductor */}
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <RiSteering2Line size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800">Panel de Ruta</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{user?.nombre || 'Operador'}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Estado de Conexión</p>
          <span className="text-emerald-500 font-bold text-sm flex items-center justify-end gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Online
          </span>
        </div>
      </header>

      {/* Control de Progreso */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <RiPinDistanceLine className="text-blue-600" /> Progreso del Recorrido
            </p>
            <p className="text-xs text-gray-400">Completa todos los puntos para finalizar</p>
          </div>
          <p className="text-2xl font-black text-blue-600">{progreso}%</p>
        </div>

        {/* Barra de Progreso Estilizada */}
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-50">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out shadow-inner"
            style={{ width: `${progreso}%` }}
          />
        </div>

        {/* Botonera de Acción */}
        <div className="mt-8 flex flex-wrap gap-4">
          {!rutaActiva && reportes.length > 0 ? (
            <button 
              onClick={iniciarRuta} 
              className="group flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              <RiTruckLine className="text-xl group-hover:animate-bounce" /> Iniciar Recolección
            </button>
          ) : rutaActiva && progreso < 100 ? (
            <button 
              onClick={avanzar} 
              className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              <RiMapPinRangeLine className="text-xl" /> Registrar punto visitado
            </button>
          ) : rutaActiva && progreso === 100 ? (
            <button 
              onClick={finalizarRuta} 
              className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 animate-pulse"
            >
              <RiCheckboxCircleLine className="text-xl" /> Confirmar Entrega Total
            </button>
          ) : null}
        </div>
      </section>

      {/* Lista de Puntos Asignados */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <RiHistoryLine className="text-blue-500" /> Hoja de Ruta Actual
          </h2>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-lg">
            {reportes.length} PUNTOS
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {reportes.length === 0 ? (
            <div className="p-12 text-center">
              <RiInformationLine size={40} className="mx-auto text-gray-200 mb-2" />
              <p className="text-gray-400 font-medium italic">No hay tareas pendientes en tu zona.</p>
            </div>
          ) : (
            reportes.map((r) => (
              <div key={r.id} className="p-5 flex items-start justify-between hover:bg-gray-50/50 transition-colors group">
                <div className="flex gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    r.estado === 'En ruta' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    <RiMapPinRangeLine size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-800 truncate text-sm">
                      {r.tipo || "Recolección General"}
                    </p>
                    <p className="text-xs text-blue-600 font-bold mt-0.5 flex items-center gap-1">
                      {r.ubicacion}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-1 italic">
                      {r.descripcion || 'Sin observaciones adicionales'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter border ${
                    r.estado === 'En ruta' 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {r.estado}
                  </span>
                  <RiArrowRightSLine className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardConductor;