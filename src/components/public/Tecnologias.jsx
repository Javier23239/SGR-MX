const Tecnologias = () => {
  return (
    <div className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-4">
          Tecnologías utilizadas
        </h2>

        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          El sistema se desarrolla utilizando tecnologías modernas
          enfocadas en escalabilidad, rendimiento y tiempo real.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {["React", "Firebase", "OpenStreetMap", "Node.js"].map((tech) => (
            <div
              key={tech}
              className="bg-white p-6 rounded-lg shadow text-center font-semibold"
            >
              {tech}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Tecnologias;
