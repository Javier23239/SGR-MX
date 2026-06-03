import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text: "Hola 👋 ¿En qué puedo ayudarte?",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  // RESPUESTAS RÁPIDAS
  const quickQuestion = (question) => {
    let response = "";

    if (question === "horario") {
      response =
        "🕒 Nuestro horario es de lunes a viernes de 8:00 AM a 6:00 PM.";
    }

    else if (question === "ubicacion") {
      response =
        "📍 Nos ubicamos en México.";
    }

    else if (question === "precios") {
      response =
        "💲 Los precios dependen del servicio solicitado.";
    }

    else if (question === "contacto") {
      response =
        "📞 Puedes contactarnos desde el apartado de contacto.";
    }

    else if (question === "servicios") {
      response =
        "🛠 Ofrecemos gestión de residuos y reportes.";
    }

    setMessages((prev) => [
      ...prev,
      {
        text: question,
        sender: "user",
      },
      {
        text: response,
        sender: "bot",
      },
    ]);
  };

  // ENVIAR MENSAJE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
    };

    const text = input.toLowerCase();

    let response =
      "Lo siento 😅 no entendí tu pregunta.";

    // RESPUESTAS AUTOMÁTICAS

    if (
      text.includes("hola") ||
      text.includes("buenas")
    ) {
      response =
        "Hola 👋 Bienvenido a SGR-MX.";
    }

    else if (
      text.includes("servicio")
    ) {
      response =
        "SGR-MX ayuda a gestionar reportes y recolección de residuos.";
    }

    else if (
      text.includes("reporte")
    ) {
      response =
        "Para crear un reporte debes iniciar sesión y entrar al módulo de reportes.";
    }

    else if (
      text.includes("registro") ||
      text.includes("registrarme")
    ) {
      response =
        "Para registrarte debes llenar el formulario de creación de cuenta.";
    }

    else if (
      text.includes("contacto")
    ) {
      response =
        "Puedes contactarnos desde el apartado de contacto.";
    }

    else if (
      text.includes("como funciona")
    ) {
      response =
        "El sistema permite gestionar residuos y reportes desde la plataforma.";
    }

    const botMessage = {
      text: response,
      sender: "bot",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      botMessage,
    ]);

    setInput("");
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[9999] bg-green-600 hover:bg-green-700 text-white w-16 h-16 rounded-full shadow-2xl text-2xl transition-all"
      >
        💬
      </button>

      {/* CHAT */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[9999] w-[350px] max-w-[95%] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">

          {/* HEADER */}
          <div className="bg-green-600 text-white p-4 font-bold text-lg">
            Chat SGR-MX
          </div>

          {/* MENSAJES */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-100 scroll-smooth">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

          </div>

          {/* BOTONES RÁPIDOS */}
          <div className="p-3 bg-white border-t flex flex-wrap gap-2">

            <button
              onClick={() => quickQuestion("horario")}
              className="bg-green-600 hover:bg-green-700 transition-all text-white px-4 py-2 rounded-2xl shadow"
            >
              ⏰ Horario
            </button>

            <button
              onClick={() => quickQuestion("ubicacion")}
              className="bg-green-600 hover:bg-green-700 transition-all text-white px-4 py-2 rounded-2xl shadow"
            >
              📍 Ubicación
            </button>

            <button
              onClick={() => quickQuestion("precios")}
              className="bg-green-600 hover:bg-green-700 transition-all text-white px-4 py-2 rounded-2xl shadow"
            >
              💲 Precios
            </button>

            <button
              onClick={() => quickQuestion("contacto")}
              className="bg-green-600 hover:bg-green-700 transition-all text-white px-4 py-2 rounded-2xl shadow"
            >
              📞 Contacto
            </button>

            <button
              onClick={() => quickQuestion("servicios")}
              className="bg-green-600 hover:bg-green-700 transition-all text-white px-4 py-2 rounded-2xl shadow"
            >
              🛠 Servicios
            </button>

          </div>

          {/* INPUT */}
          <div className="flex p-3 border-t bg-white">

            <input
              type="text"
              className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl transition-all"
            >
              →
            </button>

          </div>
        </div>
      )}
    </>
  );
}