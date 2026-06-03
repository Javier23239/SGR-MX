import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const reportService = {

  // ---  RECOLECTOR ---

  getTasksByEmail: async (email, token) => {
    try {
      const res = await axios.get(`${API_URL}/recolector/mis-tareas/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data; 
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      throw error;
    }
  },

  getHistoryByEmail: async (email, token) => {
    try {
      const res = await axios.get(`${API_URL}/recolector/historial/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener historial:", error);
      throw error;
    }
  },

  updateStatus: async (id_solicitud, nuevo_estado, token) => {
    try {
      const res = await axios.put(`${API_URL}/recolector/actualizar-estado`, {
        id_solicitud,
        nuevo_estado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      throw error;
    }
  },


  // --- ADMINISTRADOR ---

  getAll: async (token) => {
    try {
      const res = await axios.get(`${API_URL}/admin/reportes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error en getAll:", error);
      return [];
    }
  },

  getAllAdmin: async (token) => {
    try {
      const res = await axios.get(`${API_URL}/admin/reportes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener reportes generales:", error);
      return [];
    }
  },

  assignReport: async (id_solicitud, id_recolector, token) => {
    try {
      const res = await axios.put(`${API_URL}/admin/asignar-reporte`, {
        id_solicitud,
        id_recolector
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error al asignar reporte:", error);
      throw error;
    }
  },

  // ---  CIUDADANO  ---

  getByEmail: async (email, token) => {
    try {
      const res = await axios.get(`${API_URL}/solicitudes/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener reportes del ciudadano:", error);
      throw error;
    }
  }
};