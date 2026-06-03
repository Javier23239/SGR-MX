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


  useEffect(() => {

    const storedUser =
      localStorage.getItem("user_oracle");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);

  }, []);

  const login = async (email, password) => {
    try {
      //Peticion al Backend 
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error || "Código incorrecto"
        );

      }

      const userData = { email, rol: data.rol };

      localStorage.setItem("user_oracle", JSON.stringify(userData));
      
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

export const useAuth = () => useContext(AuthContext);