import { useState } from "react";
import { Brain, Send, Loader2 } from "lucide-react";
import "../../Components/Public/css/Ia.css";

function Ia() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://backend-5gwv.onrender.com/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      console.error(err);
      setResponse("⚠️ Error al conectar con el servidor");
    }
    setLoading(false);
  }

  return (
    <div className="IAContenedor">
      <div className="IACabecera">
        <h1 className="IATitulo">
          <Brain className="IAIconoTitulo" />
          EntrenIA
        </h1>
        <p className="IASubtitulo">
          Consultas técnicas e informativas sobre los deportistas y entrenadores
        </p>
      </div>

      <div className="IATarjeta">
        <div className="IACuerpoTarjeta">
          <div className="IAEntradaTexto">
            <textarea
              rows="3"
              className="IAAreaTexto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje o consulta técnica..."
            />
          </div>

          <div className="IABotonContenedor">
            <button
              className="IABotonEnviar"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="IASpinner" />
                  Consultando...
                </>
              ) : (
                <>
                  <Send className="IAIconoEnviar" />
                  Enviar
                </>
              )}
            </button>
          </div>

          <div className="IARespuestaContenedor">
            <strong>Respuesta:</strong>
            <div className="IARespuestaTexto">{response}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ia;
