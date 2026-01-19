export const loginService = async (email, password) => {
  
  if (email === "admin@demo.com") {
    return { nombre: "Admin", rol: "ADMIN" };
  }

  if (email === "ciudadano@demo.com") {
    return { nombre: "Ciudadano", rol: "CIUDADANO" };
  }

  if (email === "conductor@demo.com") {
    return { nombre: "Conductor", rol: "CONDUCTOR" };
  }

  throw new Error("Credenciales inválidas");
};
