import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  RiMailLine,
  RiLockPasswordLine,
  RiShieldCheckLine,
  RiArrowRightLine,
} from "react-icons/ri";

const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // =========================================
  // LOGIN
  // =========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setIsLoading(true);

    try {
      const rol = await login(email.trim(), password);
      
      if (rol === "ADMIN") {
        navigate("/admin");
      } else if (rol === "CIUDADANO") {
        navigate("/ciudadano");
      } else if (rol === "RECOLECTOR") { 
        navigate("/conductor");
      }
    } catch (err) {

      setError(
        err.message || "Credenciales incorrectas."
      );

    } finally {

      setIsLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        <div className="md:w-1/2 bg-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">

          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500 rounded-full opacity-50"></div>

          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-emerald-700 rounded-full opacity-50"></div>

          <div className="relative z-10">

            <h1 className="text-4xl font-black tracking-tighter mb-2">
              SGR-MX
            </h1>

            <div className="h-1 w-12 bg-white rounded-full mb-8"></div>

            <h2 className="text-2xl font-bold leading-tight mb-4">

              Bienvenido al sistema de gestión de residuos.

            </h2>

            <p className="text-emerald-100 text-sm">

              Conéctate para reportar, gestionar o recolectar.
              Juntos mantenemos nuestra ciudad limpia.

            </p>

          </div>

        </div>

        {/* Formulario */}
        <div className="md:w-1/2 p-8 md:p-12">

          <div className="mb-10">

            <h3 className="text-2xl font-black text-gray-800">

              Iniciar Sesión

            </h3>

            <p className="text-gray-500 text-sm">

              Ingresa tus credenciales para continuar.

            </p>

          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-4 rounded-r-xl flex items-center gap-3 animate-shake">
              <RiShieldCheckLine className="text-xl" />
              {error}
            </div>

          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* EMAIL */}
            <div className="relative">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Correo o Usuario</label>
              <div className="relative">

                <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                <input
                  type="text"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-gray-700"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Contraseña</label>
              <div className="relative">

                <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-gray-700"
                  required
                />

              </div>

            </div>

            {/* BOTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >

              {isLoading
                ? "Validando..."
                : "Ingresar al Sistema"}

              {!isLoading && (

                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />

              )}

            </button>

          </form>

          {/* REGISTRO */}
          <div className="mt-10 text-center">

            <p className="text-sm text-gray-500">
              ¿Eres nuevo vecino?{" "}
              <button 
                onClick={() => navigate("/registro-ciudadano")} 
                className="text-emerald-600 font-black hover:underline underline-offset-4"
              >

                Crear cuenta

              </button>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Login;