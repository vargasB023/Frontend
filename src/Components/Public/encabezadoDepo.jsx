import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import "./css/encabezado_Depor.css";
import gadderNuevo from "./img/gadderBlanco.png";

export default function Encabezado_Deportista({ setSeccion }) {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const navigate = useNavigate();

  const deportistaGuardado = localStorage.getItem("deportista");
  const deportista = deportistaGuardado ? JSON.parse(deportistaGuardado) : null;

  const alternarMenuUsuario = () => setMenuUsuarioAbierto(!menuUsuarioAbierto);
  const cerrarMenu = () => setMenuUsuarioAbierto(false);

  const cerrarSesion = () => {
    // Borra todos los datos del localStorage
    localStorage.clear("deportista");
    setMenuUsuarioAbierto(false);
    navigate("/"); // Redirige al login o página principal
  };

  return (
    <header className="encabezado-dep">
      <div className="cuerpo-encabezado">
        <div className="caja-logo">
          <Link to="/dashDeportista" className="enlace-logo">
            <img src={gadderNuevo} alt="GADDER Logo" className="img-logo" />
          </Link>
        </div>

        <div className="caja-usuario">
          <div className="bloque-usuario">
            <button
              className="boton-usuario"
              onClick={alternarMenuUsuario}
              aria-label="Menú de usuario"
            >
              <div className="avatar-usuario">
                <FaUser className="icono-avatar" />
              </div>

              {deportista && (
                <div className="info-usuario">
                  <span className="nombre-usuario">
                    {deportista.nombre_Completo}
                  </span>
                  <span className="rol-usuario">Deportista</span>
                </div>
              )}
            </button>

            {menuUsuarioAbierto && (
              <>
                <div className="fondo-menu" onClick={cerrarMenu}></div>

                <div className="menu-usuario">
                  <div className="cabecera-menu">
                    <div className="avatar-menu">
                      <FaUser />
                    </div>
                    {deportista && (
                      <div className="info-menu">
                        <span className="nombre-menu">
                          {deportista.nombre_Completo}
                        </span>
                        <span className="email-menu">{deportista.email}</span>
                      </div>
                    )}
                  </div>

                  <hr className="linea-menu" />

                  <div
                    className="opcion-menu"
                    onClick={() => {
                      setSeccion("perfil");
                      cerrarMenu();
                    }}
                  >
                    <FaUser className="icono-menu" />
                    Mi Perfil
                  </div>

                  <Link
                    to="/configuracion"
                    className="opcion-menu"
                    onClick={cerrarMenu}
                  >
                    <FaCog className="icono-menu" />
                    Configuración
                  </Link>

                  <hr className="linea-menu" />

                  <button
                    className="opcion-menu cerrar-sesion"
                    onClick={cerrarSesion}
                  >
                    <FaSignOutAlt className="icono-menu" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
