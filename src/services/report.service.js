const STORAGE_KEY = "reportes";

const getAll = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const save = (data) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const reportService = {
  getAll,

  assignReport(id, conductor) {
    const reportes = getAll();

    const updated = reportes.map((r) =>
      r.id === id
        ? { ...r, estado: "Asignado", conductor }
        : r
    );

    save(updated);
  },

  startRoute(id) {
    const reportes = getAll();

    const updated = reportes.map((r) =>
      r.id === id
        ? { ...r, estado: "En ruta" }
        : r
    );

    save(updated);
  },

  completeReport(id) {
    const reportes = getAll();

    const updated = reportes.map((r) =>
      r.id === id
        ? { ...r, estado: "Recolectado" }
        : r
    );

    save(updated);
  },
};