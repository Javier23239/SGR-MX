import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  RiUserAddLine, 
  RiMailLine, 
  RiLockPasswordLine, 
  RiMapPinLine, 
  RiPhoneLine,
  RiUser3Line,
  RiArrowRightLine,
  RiErrorWarningLine 
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
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") setPasswordError("");
  };

  const validarPassword = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tieneCamposVacios = Object.values(formData).some(val => val.trim() === "");
    if (tieneCamposVacios) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!validarPassword(formData.password)) {
      setPasswordError("La contraseña debe tener 8+ caracteres, una mayúscula y un carácter especial.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/registrar-ciudadano", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("¡Cuenta creada con éxito! Bienvenido a SGR-MX.");
        navigate("/login"); 
      } else {
        const data = await response.json();
        alert("Error: " + (data.error || "No se pudo completar el registro"));
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        <div className="md:w-1/3 bg-emerald-600 p-10 text-white flex flex-col justify-center items-center text-center space-y-6">
          <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-md shadow-inner">
            <RiUserAddLine className="text-6xl" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter mb-2 italic">SGR-MX</h2>
            <p className="text-emerald-100 text-sm font-medium leading-relaxed">
              Sé parte del cambio. Reporta, ayuda y mantén tu comunidad limpia.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="md:w-2/3 p-8 lg:p-14">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-gray-800 tracking-tight">Crear Cuenta</h3>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Todos los campos son obligatorios</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <RiUser3Line className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="nombre" 
                  placeholder="Nombre" 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" 
                />
              </div>
              <div className="relative">
                <RiUser3Line className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="apellido" 
                  placeholder="Apellido" 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" 
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="email" 
                type="email" 
                placeholder="correo@ejemplo.com" 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" 
              />
            </div>

            {/* Contra*/}
            <div className="space-y-2">
              <div className="relative">
                <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Contraseña (Mín. 8 carac, Mayús y @)" 
                  onChange={handleChange} 
                  required 
                  className={`w-full bg-gray-50 border ${passwordError ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-100'} rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium`} 
                />
              </div>
              {passwordError && (
                <div className="flex items-center gap-2 text-red-500 text-[11px] font-black px-2 animate-bounce">
                  <RiErrorWarningLine size={14} />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            {/* Direccion */}
            <div className="relative">
              <RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="direccion" 
                placeholder="Dirección completa" 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" 
              />
            </div>

            {/* Telefono */}
            <div className="relative">
              <RiPhoneLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="telefono" 
                type="tel"
                placeholder="Teléfono (10 dígitos)" 
                onChange={handleChange} 
                required 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" 
              />
            </div>

            {/* Boton */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? "PROCESANDO..." : "REGISTRARME AHORA"}
              {!isLoading && <RiArrowRightLine className="group-hover:translate-x-2 transition-transform" size={20}/>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400 font-bold">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-emerald-600 font-black hover:text-emerald-800 transition-colors uppercase decoration-2 underline-offset-4">
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