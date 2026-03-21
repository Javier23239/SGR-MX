const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative h-screen flex items-center justify-center text-center"
      style={{
        backgroundImage: "url('/assets/images/nosotros.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-5xl px-6 text-white">

        <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
          Optimización del servicio de recolección de{" "}
          <span className="text-green-500">residuos</span> para{" "}
          <span className="text-green-500">comunidades</span> más limpias
        </h1>

        <p className="text-lg md:text-xl leading-relaxed">
          Diseñado para mejorar la coordinación entre ciudadanos,
          conductores y administradores, el sistema permite planificar
          rutas, registrar evidencias y monitorear actividades,
          garantizando un servicio más eficiente y transparente.
        </p>

      </div>
    </section>
  );
};

export default Hero;
