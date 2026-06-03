import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const VerificarOTP = () => {

  const navigate = useNavigate();

  const { verifyOTP } = useAuth();

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================================
  // VERIFICAR CODIGO
  // =========================================
  const handleVerify = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      // VERIFICAR OTP DESDE AUTHCONTEXT
      const rol = await verifyOTP(otp);

      // =========================================
      // REDIRECCION SEGUN ROL
      // =========================================
      if (rol === "ADMIN") {

        navigate("/admin");

      } else if (rol === "CIUDADANO") {

        navigate("/ciudadano");

      } else if (rol === "RECOLECTOR") {

        navigate("/conductor");

      } else {

        navigate("/");

      }

    } catch (err) {

      setError(
        err.message || "Error verificando código"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">

        <h1 className="text-4xl font-black text-gray-800 mb-2">

          Verificación OTP

        </h1>

        <p className="text-gray-500 mb-8">

          Revisa tu correo electrónico e ingresa el código.

        </p>

        {error && (

          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6">

            {error}

          </div>

        )}

        <form onSubmit={handleVerify}>

          <input
            type="text"
            placeholder="Ingresa el código"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-xl mb-6 outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all text-white font-bold py-4 rounded-2xl text-xl"
          >

            {loading
              ? "Verificando..."
              : "Verificar Código"}

          </button>

        </form>

      </div>

    </div>

  );

};

export default VerificarOTP;