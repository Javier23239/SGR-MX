import { useState } from "react";

const RegistrarUsuario = ({ onUsuarioRegistrado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "", 
    direccion: "",
    telefono: "",
    rol: "VECINO"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/registrar-ciudadano", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${formData.rol} registrado con éxito en Oracle`);
        
        setFormData({ 
          nombre: "", 
          apellido: "", 
          email: "", 
          password: "", 
          direccion: "", 
          telefono: "", 
          rol: "VECINO" 
        });

        onUsuarioRegistrado(); 
      } else {
        alert("Error de Oracle: " + data.error);
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor backend");
    }
  };

  const esVecino = formData.rol === "VECINO";
  const esAdmin = formData.rol === "ADMIN";

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl mb-8 border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="bg-blue-600 w-2 h-6 rounded-full inline-block"></span>
        Registrar Nuevo Usuario
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
        
        {/* Nombre */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Juan"
            className="border-2 border-gray-100 p-2 rounded-lg w-full focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apellido</label>
          <input
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder={esAdmin ? "No requerido" : "Ej. Pérez"}
            disabled={esAdmin}
            className={`border-2 p-2 rounded-lg w-full outline-none transition-all ${
              esAdmin ? "bg-gray-100 border-gray-50 text-gray-400" : "border-gray-100 focus:border-blue-500"
            }`}
            required={!esAdmin}
          />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email / Usuario</label>
          <input
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className="border-2 border-gray-100 p-2 rounded-lg w-full focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        {/* Contra*/}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 text-blue-600">Contraseña de acceso</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 4 caracteres"
            className="border-2 border-blue-50 p-2 rounded-lg w-full focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        {/* Direccion */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dirección</label>
          <input
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={!esVecino}
            required={esVecino}
            placeholder={!esVecino ? "No aplica" : "Calle y Número"}
            className={`border-2 p-2 rounded-lg w-full outline-none transition-all ${
              !esVecino ? "bg-gray-100 border-gray-50 text-gray-400" : "border-gray-100 focus:border-blue-500"
            }`}
          />
        </div>

        {/* Telefono */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
          <input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={esAdmin}
            required={!esAdmin}
            placeholder={esAdmin ? "No aplica" : "55-1234-5678"}
            className={`border-2 p-2 rounded-lg w-full outline-none transition-all ${
              esAdmin ? "bg-gray-100 border-gray-50 text-gray-400" : "border-gray-100 focus:border-blue-500"
            }`}
          />
        </div>

        {/* Rol */}
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="border-2 border-gray-100 p-2 rounded-lg w-full bg-white focus:border-blue-500 outline-none h-[44px] cursor-pointer font-medium"
            >
              <option value="RECOLECTOR">Recolector</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md h-[44px]"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarUsuario;