import { useState } from "react";
import axios from "axios";
import "../../Components/Public/css/olvidarContrasena.css";
import Iniciopagina from "../../Components/Public/inicioHome";
import Footer from "../../Components/Public/footer";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("deportista");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://backend-5gwv.onrender.com/api/auth/forgot-password",
        {
          email,
          rol,
        }
      );
      setMensaje(res.data.message);
      setTimeout(() => {
        navigate("/restablecerContraseña/:token");
      }, 2000);
    } catch (err) {
      setMensaje(
        err.response?.data?.message || "Error al solicitar recuperación"
      );
    }
  };
  return (
    <div>
      <Iniciopagina />
      <div className="forgot-container">
        <div className="forgot-card">
          <h2 className="forgot-title">¿Olvidaste tu contraseña?</h2>
          <p className="forgot-subtitle">
            Ingresa tu correo electrónico y selecciona tu rol para restablecer
            tu contraseña.
          </p>

          <form className="forgot-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="forgot-input"
              required
            />
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="forgot-select"
            >
              <option value="">Selecciona tu rol</option>
              <option value="deportista">Deportista</option>
              <option value="entrenador">Entrenador</option>
            </select>
            <button type="submit" className="forgot-button">
              Enviar
            </button>
          </form>

          {mensaje && <p className="forgot-message">{mensaje}</p>}

          <p className="forgot-footer">
            Si no recibes un correo en unos minutos, revisa tu carpeta de spam.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
