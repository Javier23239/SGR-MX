import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================================
  // CARGAR USUARIO DESDE LOCALSTORAGE
  // =========================================
  useEffect(() => {

    const storedUser =
      localStorage.getItem("user_oracle");

    if (storedUser) {

      setUser(JSON.parse(storedUser));

    }

    setLoading(false);

  }, []);

  // =========================================
  // LOGIN
  // =========================================
  const login = async (email, password) => {

    try {

      const response = await fetch(
        "http://localhost:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error || "Error al iniciar sesión"
        );

      }

      // =========================================
      // SI REQUIERE OTP
      // =========================================
      if (data.requiresOTP) {

        // GUARDAR EMAIL TEMPORALMENTE
        localStorage.setItem(
          "otp_email",
          email
        );

        return {
          requiresOTP: true
        };

      }

      return data;

    } catch (error) {

      console.error(
        "Error en login:",
        error.message
      );

      throw error;

    }

  };

  // =========================================
  // VERIFICAR OTP
  // =========================================
  const verifyOTP = async (otp) => {

    try {

      // OBTENER EMAIL TEMPORAL
      const email =
        localStorage.getItem("otp_email");

      console.log(
        "EMAIL GUARDADO:",
        email
      );

      // VALIDAR EMAIL
      if (!email) {

        throw new Error(
          "No se encontró el correo para verificar."
        );

      }

      const response = await fetch(
        "http://localhost:5000/verificar-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            otp
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error || "Código incorrecto"
        );

      }

      // =========================================
      // CREAR SESION
      // =========================================
      const userData = {

        email,
        rol: data.rol

      };

      // GUARDAR USUARIO
      localStorage.setItem(
        "user_oracle",
        JSON.stringify(userData)
      );

      // ELIMINAR OTP TEMPORAL
      localStorage.removeItem(
        "otp_email"
      );

      // ACTUALIZAR ESTADO
      setUser(userData);

      return data.rol;

    } catch (error) {

      console.error(
        "Error verificando OTP:",
        error.message
      );

      throw error;

    }

  };

  // =========================================
  // LOGOUT
  // =========================================
  const logout = () => {

    localStorage.removeItem(
      "user_oracle"
    );

    localStorage.removeItem(
      "otp_email"
    );

    setUser(null);

  };

  return (

    <AuthContext.Provider
      value={{

        user,

        loading,

        login,

        verifyOTP,

        logout

      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () =>
  useContext(AuthContext);