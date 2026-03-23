import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const reportService = {
  create: async (reportData) => {
    const res = await axios.post(`${API_URL}/solicitudes`, reportData);
    return res.data;
  },

  // Admin: Ver todos los reportes 
  getAllAdmin: async () => {
    const res = await axios.get(`${API_URL}/admin/reportes`);
    return Array.isArray(res.data) ? res.data : [];
  },

  // Conductor: Ver sus tareas
  getTasksByEmail: async (email) => {
    const res = await axios.get(`${API_URL}/recolector/mis-tareas/${email}`);
    return res.data;
  },

  // Actualizar estados 
  updateStatus: async (id, estado) => {
    return await axios.put(`${API_URL}/recolector/actualizar-estado`, {
      id_solicitud: id,
      nuevo_estado: estado
    });
  },

  // Admin: Asignar conductor 
  assignReport: async (id_solicitud, id_recolector) => {
    return await axios.put(`${API_URL}/admin/asignar-reporte`, {
      id_solicitud,
      id_recolector
    });
  }
};