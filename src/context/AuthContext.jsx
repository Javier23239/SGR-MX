import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const defaultUsers = [
  {
    id: 1,
    nombre: "Administrador",
    email: "admin@test.com",
    password: "1234",
    rol: "ADMIN",
  },
  {
    id: 2,
    nombre: "Ciudadano",
    email: "ciudadano@test.com",
    password: "1234",
    rol: "CIUDADANO",
  },
  {
    id: 3,
    nombre: "Conductor",
    email: "conductor@test.com",
    password: "1234",
    rol: "CONDUCTOR",
  },
];

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    let users = localStorage.getItem("users");

    if (!users) {
      localStorage.setItem("users", JSON.stringify(defaultUsers));
      users = defaultUsers;
    } else {
      users = JSON.parse(users);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);

  }, []);

  const login = (email, password) => {

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error("Credenciales incorrectas");
    }

    localStorage.setItem("user", JSON.stringify(found));
    setUser(found);

    return found.rol;
  };

  const logout = () => {
    localStorage.removeItem("user");
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);