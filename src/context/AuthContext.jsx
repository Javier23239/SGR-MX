import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_oracle");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear el usuario del storage", error);
        localStorage.removeItem("user_oracle");
      }
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      const userData = { 
        email, 
        rol: data.rol, 
        nombre: data.nombre, 
        token: data.token 
      };

      localStorage.setItem("user_oracle", JSON.stringify(userData));
      setUser(userData);

      return userData; 
      
    } catch (error) {
      console.error("Error en AuthContext:", error.message);
      throw error; 
    }
  };

  //  LOGOUT: 
  const logout = () => {
    localStorage.removeItem("user_oracle");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};