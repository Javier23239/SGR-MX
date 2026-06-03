import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const reportService = {

  // --- CIUDADANO ---

  create: async (reportData, token) => {
    try {
      const res = await axios.post(`${API_URL}/solicitudes`, reportData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error al crear reporte:", error);
      throw error;
    }
  },

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
  },

 // -- RECOLECTOR --

  getTasksByEmail: async (email, token) => {
    try {
      const res = await axios.get(`${API_URL}/recolector/mis-tareas/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Error en getTasksByEmail:", error);
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
      console.error("Error en getHistoryByEmail:", error);
      throw error;
    }
  },

  // Actualizar estado 
  updateStatus: async (id, estado, token) => {
    try {
      const res = await axios.put(`${API_URL}/recolector/actualizar-estado`, 
        {
          id_solicitud: id,
          nuevo_estado: estado
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error en updateStatus:", error);
      throw error;
    }
  },

// -- ADMINISTRADOR --

  getAllAdmin: async (token) => {
    try {
      const res = await axios.get(`${API_URL}/admin/reportes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error("Error en getAllAdmin:", error);
      throw error;
    }
  },

  assignReport: async (id_solicitud, id_recolector, token) => {
    try {
      const res = await axios.put(`${API_URL}/admin/asignar-reporte`, 
        {
          id_solicitud,
          id_recolector
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error en assignReport:", error);
      throw error;
    }
  }
};