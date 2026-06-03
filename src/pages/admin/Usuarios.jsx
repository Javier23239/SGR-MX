import { useEffect, useState, useCallback } from "react";
import RegistrarUsuario from "./RegistrarUsuario"; 
import { useAuth } from "../../context/AuthContext"; 
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
  const { user } = useAuth(); 

  const cargarUsuarios = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      setCargando(true);
      const response = await fetch("http://localhost:5000/usuarios", {
        headers: {
          "Authorization": `Bearer ${user.token}` 
        }
      }); 
      
      if (response.status === 403) {
        console.error("Acceso denegado: Token inválido o expirado");
        return;
      }

      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setCargando(false);
    }
  }, [user?.token]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const eliminarUsuario = async (u) => {
    const rol = u.ROL || u.rol;
    const id = u.ID || u.id; 

    if (!id) {
      alert("No se pudo obtener el ID del usuario.");
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar a este ${rol}?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/usuarios/${id}/${rol}`, { 
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${user.token}` 
        }
      });
      
      const data = await response.json();

      if (response.ok) {
        cargarUsuarios();
      } else {
        alert(data.error || "No se pudo eliminar el registro");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const term = filtro.toLowerCase();
    const nombre = (u.NOMBRE || "").toLowerCase();
    const apellido = (u.APELLIDO || "").toLowerCase();
    const email = (u.CORREO || "").toLowerCase();
    return nombre.includes(term) || apellido.includes(term) || email.includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
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

      {/* Formulario */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-8 text-emerald-600">
          <RiUserAddLine className="text-2xl" />
          <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Usuario</h2>
        </div>
        <div className="max-w-4xl"> 
          <RegistrarUsuario onUsuarioRegistrado={cargarUsuarios} />
        </div>
      </section>

      {/* Lista de usuarios */}
      <section className="space-y-4">
        <div className="relative group max-w-md">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700"
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Perfil</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Rol</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-12">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cargando ? (
                  <tr>
                    <td colSpan="4" className="py-24 text-center">
                      <RiDatabase2Line className="text-5xl text-emerald-100 mx-auto animate-bounce mb-4" />
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sincronizando con Oracle Cloud...</span>
                    </td>
                  </tr>
                ) : usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-400 font-medium">No hay registros que coincidan.</td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((u, i) => (
                    <tr key={u.ID || i} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 text-emerald-600 flex items-center justify-center font-black text-xs shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all uppercase">
                            {(u.NOMBRE || "U").charAt(0)}{(u.APELLIDO || "").charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-sm">
                              {u.NOMBRE} {u.APELLIDO}
                            </p>
                            <p className="text-[9px] font-mono text-gray-400 uppercase">UUID: {u.ID}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <RiMailLine className="text-emerald-500" /> {u.CORREO}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <RiMapPinLine /> {u.DIRECCION || 'Sin dirección registrada'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-tighter ${
                          u.ROL === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                          u.ROL === 'RECOLECTOR' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {u.ROL}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right pr-10">
                        <button 
                          onClick={() => eliminarUsuario(u)}
                          className="p-2.5 text-gray-300 hover:text-white hover:bg-red-500 rounded-xl transition-all active:scale-95 shadow-sm"
                          title="Eliminar de la base de datos"
                        >
                          <RiDeleteBin7Line size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
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