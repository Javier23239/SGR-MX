import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const rol = await login(email.trim(), password);

      if (rol === "ADMIN") navigate("/admin");
      if (rol === "CIUDADANO") navigate("/ciudadano");
      if (rol === "CONDUCTOR") navigate("/conductor");
    } catch (err) {
      setError("Credenciales incorrectas. Verifica tu información.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">
            Sistema de Gestión de Residuos
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Accede a la plataforma para gestionar y
            dar seguimiento a la recolección de
            residuos
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-100 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md"
          >
            Ingresar
          </button>
        </form>

        {/* Usuarios de prueba */}
        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold mb-1">Usuarios de prueba:</p>
          <p>Admin: admin@test.com / 1234</p>
          <p>Ciudadano: ciudadano@test.com / 1234</p>
          <p>Conductor: conductor@test.com / 1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;