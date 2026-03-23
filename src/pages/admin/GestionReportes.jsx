import { useEffect, useState } from "react";
import { 
  RiFileList3Line, 
  RiSearchLine, 
  RiUserReceived2Line, 
  RiTruckLine, 
  RiCheckboxCircleLine, 
  RiTimeLine,
  RiDatabase2Line,
  RiMapPinLine
} from "react-icons/ri";

const GestionReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resRep = await fetch("http://localhost:5000/admin/reportes");
      const dataRep = await resRep.json();
      setReportes(Array.isArray(dataRep) ? dataRep : []);

      const resUser = await fetch("http://localhost:5000/usuarios");
      const dataUser = await resUser.json();
      
      if (Array.isArray(dataUser)) {
        const soloConductores = dataUser.filter(u => 
          (u.ROL || u.rol) === "RECOLECTOR"
        );
        setConductores(soloConductores);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const asignar = async (idSolicitud, idRecolector) => {
    try {
      const response = await fetch("http://localhost:5000/admin/asignar-reporte", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id_solicitud: idSolicitud, 
          id_recolector: idRecolector 
        }),
      });

      if (response.ok) {
        cargarDatos(); 
      }
    } catch (error) {
      alert("Error al asignar conductor");
    }
  };

  const reportesFiltrados = reportes.filter((r) => {
    const desc = (r.DESCRIPCION || r.descripcion || "").toLowerCase();
    const ciudad = (r.CIUDADANO || r.ciudadano || "").toLowerCase();
    const search = busqueda.toLowerCase();
    return desc.includes(search) || ciudad.includes(search);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <RiDatabase2Line className="text-5xl text-emerald-500 animate-pulse mb-4" />
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sincronizando con Oracle Cloud...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <RiFileList3Line className="text-emerald-600" /> Control de Reportes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Asigna rutas y monitorea el estado de recolección en tiempo real.</p>
        </div>
        
        {/* Barra de Búsqueda Integrada */}
        <div className="relative w-full md:w-96 group">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" />
          <input
            type="text"
            placeholder="Buscar por descripción o ciudadano..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 border-2 rounded-2xl outline-none transition-all font-medium text-gray-700"
          />
        </div>
      </div>

      {/* Grid de Reportes */}
      <div className="grid grid-cols-1 gap-4">
        {reportesFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
             <p className="text-gray-400 font-bold italic">No hay reportes que coincidan con la búsqueda.</p>
          </div>
        ) : (
          reportesFiltrados.map((r) => {
            const id = r.ID_SOLICITUD || r.id;
            const desc = r.DESCRIPCION || r.descripcion;
            const ciudad = r.CIUDADANO || r.ciudadano;
            const estado = r.ESTADO || r.estado;
            const conductor = r.RECOLECTOR || r.conductor;

            return (
              <div
                key={id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md hover:border-emerald-100 transition-all gap-6 group"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg uppercase">
                      ID: #{id}
                    </span>
                    <EstadoBadge estado={estado} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-emerald-700 transition-colors">
                      {desc}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <RiUserReceived2Line className="text-emerald-500" /> {ciudad || "Anónimo"}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 font-medium uppercase tracking-tighter">
                        <RiTimeLine /> {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {conductor && (
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold">
                      <RiTruckLine /> Asignado a: {conductor}
                    </div>
                  )}
                </div>

                {/* Acciones de Asignación */}
                {estado === "Pendiente" ? (
                  <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Asignar Personal</label>
                    <div className="relative w-full">
                        <select
                        onChange={(e) => asignar(id, e.target.value)}
                        defaultValue=""
                        className="w-full md:w-56 appearance-none bg-white border border-gray-200 p-3 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-sm"
                        >
                        <option value="" disabled>Seleccionar Recolector...</option>
                        {conductores.map((c) => (
                            <option key={c.ID_RECOLECTOR || c.id} value={c.ID_RECOLECTOR || c.id}>
                            {c.NOMBRE || c.nombre}
                            </option>
                        ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 font-bold">↓</div>
                    </div>
                  </div>
                ) : (
                    <div className="hidden md:flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
                        <RiCheckboxCircleLine className="text-lg" /> Reporte en curso
                    </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/* Badge de Estado Reutilizable */
const EstadoBadge = ({ estado }) => {
  const config = {
    Pendiente: "bg-amber-100 text-amber-700 border-amber-200",
    "En ruta": "bg-purple-100 text-purple-700 border-purple-200",
    Asignado: "bg-blue-100 text-blue-700 border-blue-200",
    Completada: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Recolectado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${config[estado] || "bg-gray-100 text-gray-500"}`}>
      {estado}
    </span>
  );
};

export default GestionReportes;