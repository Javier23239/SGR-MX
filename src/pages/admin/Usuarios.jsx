import { useEffect, useState } from "react";

const Usuarios = () => {

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    setUsuarios(users);
  };

  const eliminarUsuario = (id) => {

    const confirmar = window.confirm("¿Eliminar usuario?");
    if (!confirmar) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const filtrados = users.filter((u) => u.id !== id);

    localStorage.setItem("users", JSON.stringify(filtrados));

    setUsuarios(filtrados);
  };

  return (
    <div>

      <h1 className="text-xl font-semibold mb-4">
        Gestión de usuarios
      </h1>

      {/* Contenedor */}
      <div className="overflow-x-auto bg-white shadow rounded">

        <table className="min-w-full">

          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 text-left text-sm font-semibold">Nombre</th>
              <th className="p-3 text-left text-sm font-semibold">Email</th>
              <th className="p-3 text-left text-sm font-semibold">Rol</th>
              <th className="p-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>

            {usuarios.map((u) => (

              <tr key={u.id} className="border-b hover:bg-gray-50">

                <td className="p-3 whitespace-nowrap">
                  {u.nombre}
                </td>

                <td className="p-3 whitespace-nowrap">
                  {u.email}
                </td>

                <td className="p-3 whitespace-nowrap">
                  <span className="text-sm font-medium bg-gray-200 px-2 py-1 rounded">
                    {u.rol}
                  </span>
                </td>

                <td className="p-3 whitespace-nowrap">

                  {u.rol !== "ADMIN" && (
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Usuarios;