import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { 
  RiAlertLine, 
  RiMapPinLine, 
  RiFileList3Line, 
  RiSendPlaneFill,
  RiInformationLine 
} from "react-icons/ri";

const NuevoReporte = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [form, setForm] = useState({
    tipo: "",
    descripcion: "",
    ubicacion: "",
  });

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // Mantenemos el formato exacto para que el .split('|') no falle en el historial
    const descripcionFinal = `[${form.tipo}] - ${form.descripcion} | Ubicación: ${form.ubicacion}`;

    try {
      const response = await fetch("http://localhost:5000/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: descripcionFinal,
          email: user?.email 
        }),
      });

      if (response.ok) {
        alert("Reporte enviado con éxito.");
        navigate("/ciudadano/reportes");
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Cabecera del Formulario */}
        <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <RiAlertLine /> Crear Reporte
            </h2>
            <p className="text-emerald-100 text-sm mt-2 font-medium">
              Tu reporte será validado por la administración para su recolección.
            </p>
          </div>
          {/* Decoración abstracta */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500 rounded-full opacity-50"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Tipo de Residuo */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
              <RiFileList3Line className="text-emerald-500 text-sm" /> 
              Tipo de situación
            </label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-700 font-medium"
            >
              <option value="" disabled>Seleccione una opción...</option>
              <option value="Basura acumulada">Basura acumulada en vía pública</option>
              <option value="Contenedor lleno">Contenedor de basura saturado</option>
              <option value="Residuos peligrosos">Residuos químicos o peligrosos</option>
              <option value="Otro">Otro reporte ciudadano</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
              <RiInformationLine className="text-emerald-500 text-sm" /> 
              Descripción del incidente
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej: Hay bolsas de basura rotas obstruyendo la banqueta..."
              required
              rows="4"
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-700 resize-none"
            />
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
              <RiMapPinLine className="text-emerald-500 text-sm" /> 
              Referencia de Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Ej: Frente a la tienda 'La Esperanza', Calle 10"
              required
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-700"
            />
          </div>

          {/* Botón de envío */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={cargando}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-3 group
                ${cargando 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200 active:scale-95'}`}
            >
              {cargando ? (
                "Procesando en Oracle..."
              ) : (
                <>
                  Enviar Reporte Oficial
                  <RiSendPlaneFill className="text-xl group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-tighter">
              El reporte se registrará con la cuenta: {user?.email}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoReporte;