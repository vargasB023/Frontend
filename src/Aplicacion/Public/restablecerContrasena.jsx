import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Components/Public/css/restablecerContrasena.css";
import Iniciopagina from "../../Components/Public/inicioHome";
import Footer from "../../Components/Public/footer";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("deportista"); // valor inicial
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    setLoading(true);
    try {
      const res = await axios.post(
        "https://backend-5gwv.onrender.com/api/auth/reset-password",
        {
          email,
          rol,
          otp,
          nuevaContrasena: password,
        }
      );

      setMensaje(res.data.message || "Contraseña restablecida correctamente.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMensaje(
        err.response?.data?.message || "Error al restablecer contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div><Iniciopagina/>
    <div className="res_contenedor">
      
      <div className="res_card">
        <div className="res_logo">⧉</div>
        <h2 className="res_titulo">Restablece tu contraseña</h2>
        <p className="res_subtitulo">
          Ingresa tu correo, el rol y el código OTP enviado a tu email.
        </p>

        <form className="res_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="res_input"
            required
          />

          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="res_input"
          >
            <option value="deportista">Deportista</option>
            <option value="entrenador">Entrenador</option>
          </select>

          <input
            type="text"
            placeholder="Código OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="res_input"
            required
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="res_input"
            required
          />

          <button type="submit" className="res_boton" disabled={loading}>
            {loading ? "Guardando..." : "Restablecer Contraseña"}
          </button>
        </form>

        {mensaje && <p className="res_mensaje">{mensaje}</p>}

        <div className="res_footer">
          ¿Recuerdas tu contraseña?
          <a href="/"> Iniciar sesión</a>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
