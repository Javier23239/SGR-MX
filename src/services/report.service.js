import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const reportService = {

  // --- METODOS ---

  getTasksByEmail: async (email) => {
    try {
      const res = await axios.get(`${API_URL}/recolector/mis-tareas/${email}`);
      return res.data; 
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      throw error;
    }
  },

  getHistoryByEmail: async (email) => {
    try {
      const res = await axios.get(`${API_URL}/recolector/historial/${email}`);
      return res.data;
    } catch (error) {
      console.error("Error al obtener historial:", error);
      throw error;
    }
  },

  updateStatus: async (id_solicitud, nuevo_estado) => {
    try {
      const res = await axios.put(`${API_URL}/recolector/actualizar-estado`, {
        id_solicitud,
        nuevo_estado
      });
      return res.data;
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      throw error;
    }
  },


  // METODOS PARA EL ADMINISTRADOR ---

  getAll: async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/reportes`);
      return res.data;
    } catch (error) {
      console.error("Error en getAll:", error);
      return [];
    }
  },

  getAllAdmin: async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/reportes`);
      return res.data;
    } catch (error) {
      console.error("Error al obtener reportes generales:", error);
      return [];
    }
  },

  assignReport: async (id_solicitud, id_recolector) => {
    try {
      const res = await axios.put(`${API_URL}/admin/asignar-reporte`, {
        id_solicitud,
        id_recolector
      });
      return res.data;
    } catch (error) {
      console.error("Error al asignar reporte:", error);
      throw error;
    }
  }
};