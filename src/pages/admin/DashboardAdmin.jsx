import { useEffect, useState } from "react";
import { reportService } from "../../services/report.service";
import axios from "axios";
import { 
  RiUserSettingsLine, 
  RiFileList3Line, 
  RiTruckLine, 
  RiCheckboxCircleLine,
  RiDashboard3Line,
  RiLoader3Line,
  RiTimeLine,
  RiShieldUserLine
} from "react-icons/ri";

const DashboardAdmin = () => {
  const [stats, setStats] = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const reportes = await reportService.getAll();
        const resUsuarios = await axios.get("http://localhost:5000/usuarios");
        const usuarios = resUsuarios.data || [];

        const activos = reportes.filter(
          r => ["Asignado", "En ruta"].includes(r.ESTADO || r.estado)
        );
        const recolectados = reportes.filter(
          r => ["Completada", "Recolectado"].includes(r.ESTADO || r.estado)
        );
        const rutasProceso = reportes.filter(
          r => (r.ESTADO || r.estado) === "En ruta"
        );

        setStats([
          { title: "Usuarios Registrados", value: usuarios.length, icon: <RiShieldUserLine/>, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Reportes Activos", value: activos.length, icon: <RiFileList3Line/>, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Rutas en Proceso", value: rutasProceso.length, icon: <RiTruckLine/>, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Completados", value: recolectados.length, icon: <RiCheckboxCircleLine/>, color: "text-emerald-600", bg: "bg-emerald-50" },
        ]);

        const ultimosCinco = [...reportes].reverse().slice(0, 5);
        setRecientes(ultimosCinco);

      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-emerald-600">
        <RiLoader3Line className="text-5xl animate-spin mb-4" />
        <span className="font-black uppercase tracking-widest text-xs">Sincronizando con Oracle Cloud...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <RiUserSettingsLine className="text-emerald-600" /> Panel de Administración
          </h2>
          <p className="text-gray-500 text-sm mt-1">Monitoreo global del Sistema de Gestión de Residuos.</p>
        </div>
      </div>

      {/* Grid de Stats Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform duration-300">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner`}>
              {stat.icon}
            </div>
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{stat.title}</p>
            <p className="text-4xl font-black text-gray-800 mt-1 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Actividad Reciente Responsiva */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-8">
          <RiDashboard3Line className="text-emerald-600 text-2xl" />
          <h3 className="text-xl font-black text-gray-800">Actividad en Tiempo Real</h3>
        </div>

        <div className="space-y-4">
          {recientes.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-bold italic">No hay actividad registrada en la base de datos.</p>
            </div>
          ) : (
            recientes.map((r, i) => (
              <div 
                key={i} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 truncate text-sm md:text-base">
                      {(r.DESCRIPCION || r.descripcion || "Sin descripción").split('|')[0]}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg font-black uppercase">
                       {r.CIUDADANO || r.ciudadano || "Anónimo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-gray-400">
                    <span className="text-[10px] font-mono font-bold bg-gray-100 px-2 py-0.5 rounded">
                      ID: #{r.ID_SOLICITUD || r.id}
                    </span>
                    <span className="text-[10px] flex items-center gap-1 font-bold uppercase tracking-tighter">
                      <RiTimeLine /> {new Date(r.FECHA_SOLICITUD || r.fecha_solicitud).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                   <AdminEstadoBadge estado={r.ESTADO || r.estado} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* 🔹 Badge de Estado para Admin */
const AdminEstadoBadge = ({ estado }) => {
  const styles = {
    Pendiente: "bg-amber-100 text-amber-700 border-amber-200",
    Asignado: "bg-blue-100 text-blue-700 border-blue-200",
    "En ruta": "bg-purple-100 text-purple-700 border-purple-200",
    Recolectado: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Completada: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border whitespace-nowrap ${styles[estado] || "bg-gray-100 text-gray-500"}`}>
      {estado || "Desconocido"}
    </span>
  );
};

export default DashboardAdmin;