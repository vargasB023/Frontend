import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Components/Public/css/inicioSesionDe.css";
import Iniciopagina from "../../Components/Public/inicioHome";
import Footer from "../../Components/Public/footer";

export default function inicio({setUser}) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navegar = useNavigate();

  const validarCorreo = (correo) => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!correo.trim()) {nuevosErrores.correo = "El correo es requerido";
    } else if (!validarCorreo(correo)) {nuevosErrores.correo = "Ingresa un correo válido"; }

    if (!contrasena) { nuevosErrores.contrasena = "La contraseña es requerida";
    } else if (contrasena.length < 6) {nuevosErrores.contrasena ="La contraseña debe tener al menos 6 caracteres";}

    setErroresValidacion(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };


  const manejarCambioCorreo = (e) => {setCorreo(e.target.value);
    if (erroresValidacion.correo) {setErroresValidacion((prev) => ({ ...prev, correo: "" }));}
    if (error) {setError("");}
  };

  const manejarCambioContrasena = (e) => { setContrasena(e.target.value);
    if (erroresValidacion.contrasena) {setErroresValidacion((prev) => ({ ...prev, contrasena: "" }));}
    if (error) {setError(""); }
  };

  const manejarLogin = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {return;}

    setCargando(true);
    setError("");

     try {
      const res = await axios.post(
        "http://localhost:3000/api/deportista/login",
        {
          email: correo,
          Contrasena: contrasena,
        }
      );

      localStorage.setItem("deportista", JSON.stringify(res.data.deportista));
      console.log("Login exitoso:", res.data.deportista);
      setUser({acceso:"concedido"});
      navegar("/dashDeportista");
    } catch (err) {
      if (err.response && err.response.data) {setError(err.response.data.error);} 
      else if (err.code === "ECONNREFUSED") { setError("No se puede conectar con el servidor. Verifica tu conexión.");
      }else {setError("Error al iniciar sesión. Intenta nuevamente.");}
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <Iniciopagina />
      <div className="contenedor-login">
        <div className="tarjeta-login">
          <h2 className="titulo-login">Iniciar sesión</h2>

          {error && (
            <div className="alerta-error-login">
              <span className="icono-error-login">⚠️</span>
              <p className="mensaje-error-login">{error}</p>
            </div>
          )}

          <form onSubmit={manejarLogin} className="formulario-login">
            {/* Campo Correo */}
            <div className="grupo-campo-login">
              <label className="etiqueta-login">Correo</label>
              <div className="contenedor-input-login">
                <span className="icono-input-login"></span>
                <input
                  type="email"
                  value={correo}
                  onChange={manejarCambioCorreo}
                  className={`entrada-login ${
                    erroresValidacion.correo ? "entrada-error-login" : ""
                  }`}
                  placeholder="tu@correo.com"
                  disabled={cargando}
                  autoComplete="email"
                  required
                />
              </div>
              {erroresValidacion.correo && (
                <span className="texto-error-campo-login">
                  {erroresValidacion.correo}
                </span>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="grupo-campo-login">
              <label className="etiqueta-login">Contraseña</label>
              <div className="contenedor-input-login">
                <span className="icono-input-login"></span>
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  value={contrasena}
                  onChange={manejarCambioContrasena}
                  className={`entrada-login entrada-contrasena-login ${
                    erroresValidacion.contrasena ? "entrada-error-login" : ""
                  }`}
                  placeholder="••••••••"
                  disabled={cargando}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="boton-mostrar-contrasena-login"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  disabled={cargando}
                  aria-label={
                    mostrarContrasena
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {mostrarContrasena ? "🙈" : "👁️"}
                </button>
              </div>
              {erroresValidacion.contrasena && (
                <span className="texto-error-campo-login">
                  {erroresValidacion.contrasena}
                </span>
              )}
            </div>

            <button type="submit" className="boton-login" disabled={cargando}>
              {cargando ? (
                <>
                  <span className="spinner-login">⏳</span>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            <div className="olvide-contrasena">
              <a href="/olvidarContraseña/:token">¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
