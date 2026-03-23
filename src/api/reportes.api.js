// src/api/reportes.api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const reportService = {
  // Para el Admin: Ver todos los reportes de Oracle
  getAllAdmin: async () => {
    const res = await axios.get(`${API_URL}/admin/reportes`);
    return Array.isArray(res.data) ? res.data : [];
  },

  // Para el Conductor: Ver sus tareas asignadas
  getTasksByEmail: async (email) => {
    const res = await axios.get(`${API_URL}/recolector/mis-tareas/${email}`);
    return res.data;
  },

  // Actualizar estados en la base de datos
  updateStatus: async (id, estado) => {
    return await axios.put(`${API_URL}/recolector/actualizar-estado`, {
      id_solicitud: id,
      nuevo_estado: estado
    });
  },

  // Asignar conductor (Para el Admin)
  assignReport: async (id_solicitud, id_recolector) => {
    return await axios.put(`${API_URL}/admin/asignar-reporte`, {
      id_solicitud,
      id_recolector
    });
  }
};