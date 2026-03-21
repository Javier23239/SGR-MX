const Servicio = () => {
  return (
    <div id="servicio" className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-4">
          Nuestro servicio
        </h2>

        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          El sistema integra a todos los actores involucrados en
          la gestión de residuos para lograr un proceso eficiente
          y transparente.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Ciudadanos</h3>
            <p className="text-gray-600">
              Generan reportes de acumulación de residuos y
              consultan su estado en tiempo real.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Conductores</h3>
            <p className="text-gray-600">
              Visualizan rutas óptimas y atienden los reportes
              asignados desde la plataforma.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Administración</h3>
            <p className="text-gray-600">
              Supervisa usuarios, rutas y reportes mediante un
              panel de control centralizado.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Servicio;
