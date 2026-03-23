import { useEffect, useState } from "react";
import RegistrarUsuario from "./RegistrarUsuario"; 
import { 
  RiUserSettingsLine, 
  RiMailLine, 
  RiMapPinLine, 
  RiDeleteBin7Line, 
  RiUserAddLine,
  RiDatabase2Line,
  RiSearchLine,
  RiGroupLine
} from "react-icons/ri";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const response = await fetch("http://localhost:5000/usuarios"); 
      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarUsuario = async (id, rol) => {
    if (!window.confirm(`¿Eliminar a este ${rol}?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/usuarios/${id}/${rol}`, { method: 'DELETE' });
      if (response.ok) cargarUsuarios();
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const term = filtro.toLowerCase();
    const nombre = (u.NOMBRE || u.nombre || "").toLowerCase();
    const email = (u.CORREO || u.email || u.USUARIO || "").toLowerCase();
    return nombre.includes(term) || email.includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <RiUserSettingsLine className="text-emerald-600" /> Gestión de Usuarios
          </h1>
          <p className="text-gray-500 text-sm mt-1">Panel de control de acceso y perfiles SGR-MX.</p>
        </div>
        <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
            <RiGroupLine className="text-2xl text-emerald-600" />
            <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Registrados</p>
                <p className="text-2xl font-black text-emerald-700 leading-none">{usuarios.length}</p>
            </div>
        </div>
      </div>

      {/* FILA 1: FORMULARIO DE REGISTRO (Ancho completo) */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-8 text-emerald-600">
          <RiUserAddLine className="text-2xl" />
          <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Usuario</h2>
        </div>
        <div className="max-w-4xl"> {/* Centramos un poco el form para que no se estire demasiado */}
          <RegistrarUsuario onUsuarioRegistrado={cargarUsuarios} />
        </div>
        {/* Decoración sutil de fondo */}
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
          <RiUserAddLine size={120} />
        </div>
      </section>

      {/* FILA 2: LISTADO DE USUARIOS (Ancho completo) */}
      <section className="space-y-4">
        {/* Buscador Integrado */}
        <div className="relative group max-w-md">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo o usuario..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700"
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {/* Tabla Pro */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Perfil de Usuario</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Datos de Contacto</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Nivel de Acceso</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-12">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cargando ? (
                  <tr>
                    <td colSpan="4" className="py-24 text-center">
                      <RiDatabase2Line className="text-5xl text-emerald-100 mx-auto animate-bounce mb-4" />
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Consultando Oracle Cloud...</span>
                    </td>
                  </tr>
                ) : usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-400 font-medium">No se encontraron coincidencias en la base de datos.</td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((u, i) => {
                    const rol = u.ROL || u.rol || "VECINO";
                    return (
                      <tr key={i} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-emerald-600 flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                              {(u.NOMBRE || "U").charAt(0)}{(u.APELLIDO || "").charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-800 text-base">
                                {u.NOMBRE || u.nombre} {u.APELLIDO || u.apellido}
                              </p>
                              <p className="text-[10px] font-mono text-gray-400">ID_SYS: {u.ID_CIUDADANO || u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                              <RiMailLine className="text-emerald-500 text-sm" /> {u.CORREO || u.email || u.USUARIO}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <RiMapPinLine className="text-sm" /> {u.DIRECCION || 'Ubicación no registrada'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest shadow-sm ${
                            rol === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                            rol === 'RECOLECTOR' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                            {rol}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right pr-10">
                          <button 
                            onClick={() => eliminarUsuario(u.ID_CIUDADANO || u.id, rol)}
                            className="p-3 text-gray-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-sm active:scale-90"
                            title="Eliminar registro"
                          >
                            <RiDeleteBin7Line className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Usuarios;