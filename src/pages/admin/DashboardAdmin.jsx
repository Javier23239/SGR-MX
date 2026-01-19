const DashboardAdmin = () => {
  const stats = [
    {
      title: "Usuarios registrados",
      value: 128,
      color: "bg-blue-500",
    },
    {
      title: "Reportes activos",
      value: 42,
      color: "bg-yellow-500",
    },
    {
      title: "Rutas asignadas",
      value: 18,
      color: "bg-green-500",
    },
    {
      title: "Incidencias",
      value: 5,
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Dashboard Administrador
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} text-white p-6 rounded-xl shadow`}
          >
            <p className="text-sm opacity-80">
              {stat.title}
            </p>
            <p className="text-3xl font-bold mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Sección futura */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">
          Actividad reciente
        </h3>
        <p className="text-gray-500 text-sm">
          Aquí se mostrarán gráficas y reportes en tiempo real.
        </p>
      </div>
    </div>
  );
};

export default DashboardAdmin;
