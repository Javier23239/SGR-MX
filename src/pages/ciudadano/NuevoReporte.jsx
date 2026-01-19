import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NuevoReporte = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "",
    descripcion: "",
    ubicacion: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reportes =
      JSON.parse(localStorage.getItem("reportes")) || [];

    reportes.push({
      ...form,
      fecha: new Date().toISOString(),
      estado: "Pendiente",
    });

    localStorage.setItem("reportes", JSON.stringify(reportes));

    navigate("/ciudadano/reportes");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Nuevo reporte
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Tipo de residuo</option>
          <option value="Basura acumulada">
            Basura acumulada
          </option>
          <option value="Contenedor lleno">
            Contenedor lleno
          </option>
          <option value="Residuos peligrosos">
            Residuos peligrosos
          </option>
        </select>

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción del problema"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
          placeholder="Ubicación"
          required
          className="w-full border p-2 rounded"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Enviar reporte
        </button>
      </form>
    </div>
  );
};

export default NuevoReporte;
