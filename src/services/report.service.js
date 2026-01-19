const STORAGE_KEY = "reportes";

const getAll = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const save = (data) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const reportService = {
  getAll,

  assignReport(id, conductor) {
    const reportes = getAll();
    reportes[id].estado = "Asignado";
    reportes[id].conductor = conductor;
    save(reportes);
  },

  startRoute(id) {
    const reportes = getAll();
    reportes[id].estado = "En ruta";
    save(reportes);
  },

  completeReport(id) {
    const reportes = getAll();
    reportes[id].estado = "Recolectado";
    save(reportes);
  },
};
