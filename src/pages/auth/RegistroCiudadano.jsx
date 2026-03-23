import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  RiUserAddLine, 
  RiMailLine, 
  RiLockPasswordLine, 
  RiMapPinLine, 
  RiPhoneLine,
  RiUser3Line,
  RiArrowRightLine
} from "react-icons/ri";

const RegistroCiudadano = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    direccion: "",
    telefono: "",
    rol: "VECINO" 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/registrar-ciudadano", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
        navigate("/login"); 
      } else {
        const data = await response.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* Lado Lateral: Informativo */}
        <div className="md:w-1/3 bg-emerald-600 p-8 text-white flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <RiUserAddLine className="text-5xl" />
          </div>
          <h2 className="text-2xl font-black tracking-tight leading-tight">Únete a SGR-MX</h2>
          <p className="text-emerald-100 text-xs">
            Al registrarte, podrás reportar acumulaciones de residuos y ayudar a mejorar tu comunidad.
          </p>
        </div>

        {/* Lado Formulario */}
        <div className="md:w-2/3 p-8 lg:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-800">Crear Cuenta</h3>
            <p className="text-gray-500 text-sm">Completa tus datos para empezar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre y Apellido en Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="nombre" 
                  placeholder="Nombre" 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" 
                />
              </div>
              <div className="relative">
                <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="apellido" 
                  placeholder="Apellido" 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" 
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="email" 
                type="email" 
                placeholder="Correo electrónico" 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" 
              />
            </div>

            {/* Password */}
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="password" 
                type="password" 
                placeholder="Crea una contraseña" 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" 
              />
            </div>

            {/* Dirección */}
            <div className="relative">
              <RiMapPinLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="direccion" 
                placeholder="Dirección completa" 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" 
              />
            </div>

            {/* Teléfono */}
            <div className="relative">
              <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="telefono" 
                placeholder="Teléfono (10 dígitos)" 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 group"
            >
              {isLoading ? "Registrando..." : "Registrarme ahora"}
              {!isLoading && <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-emerald-600 font-black hover:underline underline-offset-4">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroCiudadano;