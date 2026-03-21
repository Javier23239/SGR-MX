import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const NavbarPublic = () => {

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300
      ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

        {/* imagenes */}
        <div className="flex items-center gap-1">

          <img
            src="/assets/images/logo.png"
            alt="SGR-MX icono"
            className="h-16 md:h-32 w-auto transition-all duration-300"
          />

          <img
            src="/assets/images/letras.png"
            alt="SGR-MX texto"
            className="h-16 md:h-32 w-auto transition-all duration-300"
          />

        </div>

        {/* menu compu */}
        <div
          className={`hidden md:flex items-center gap-8 text-lg font-medium
          ${scrolled ? "text-gray-800" : "text-white"}
          `}
        >

          <button onClick={() => scrollTo("inicio")} className="hover:text-green-600 transition">
            Inicio
          </button>

          <button onClick={() => scrollTo("nosotros")} className="hover:text-green-600 transition">
            Nosotros
          </button>

          <button onClick={() => scrollTo("servicio")} className="hover:text-green-600 transition">
            Servicio
          </button>

          <Link
            to="/login"
            className="bg-green-600 px-6 py-2 rounded-full text-white hover:bg-green-700 transition shadow-md"
          >
            Iniciar sesión
          </Link>

        </div>

        {/* menu hamburguesa */}
        <button
          className={`md:hidden flex flex-col gap-1 transition
          ${scrolled ? "text-gray-800" : "text-white"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >

          <span
            className={`block h-1 w-6 bg-current transition-transform duration-300
            ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />

          <span
            className={`block h-1 w-6 bg-current transition-opacity duration-300
            ${menuOpen ? "opacity-0" : ""}`}
          />

          <span
            className={`block h-1 w-6 bg-current transition-transform duration-300
            ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />

        </button>

      </div>

      {/* menu responsivo */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500
        ${menuOpen ? "max-h-96 bg-white/70 backdrop-blur-md" : "max-h-0"}
        `}
      >

        <div className="flex flex-col items-center gap-6 py-6 text-gray-800 text-lg">

          <button onClick={() => scrollTo("inicio")} className="hover:text-green-600">
            Inicio
          </button>

          <button onClick={() => scrollTo("nosotros")} className="hover:text-green-600">
            Nosotros
          </button>

          <button onClick={() => scrollTo("servicio")} className="hover:text-green-600">
            Servicio
          </button>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="bg-green-600 px-6 py-2 rounded-full text-white hover:bg-green-700 transition"
          >
            Iniciar sesión
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default NavbarPublic;