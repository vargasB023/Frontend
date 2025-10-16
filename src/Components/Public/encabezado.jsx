import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./css/encabezado.css";
import gadderNuevo from "./img/gadderBlanco.png";

export default function EncabezadoSimple({ setSeccion }) {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const navigate = useNavigate();

  const entrenadorGuardado = localStorage.getItem("entrenador");
  const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

  const alternarMenuUsuario = () => {
    setMenuUsuarioAbierto(!menuUsuarioAbierto);
  };

  const cerrarMenu = () => {
    setMenuUsuarioAbierto(false);
  };

  const cerrarSesion = () => {
    localStorage.clear("entrenador");
    setMenuUsuarioAbierto(false);
    navigate("/");
  };

  return (
    <header className="encabezado-simple">
      <div className="contenedor-encabezado-simple">
        {/* Logo */}
        <div className="contenedor-logo-simple">
          <Link to="/dashEntrenador" className="enlace-logo-simple">
            <img src={gadderNuevo} alt="GADDER Logo" className="img-logo" />
          </Link>
        </div>

        {/* Usuario */}
        <div className="acciones-encabezado-simple">
          <div className="contenedor-usuario-simple">
            <button
              className="boton-usuario-simple"
              onClick={alternarMenuUsuario}
              aria-label="Menú de usuario"
            >
              <div className="avatar-usuario-simple">
                <FaUser className="icono-avatar-simple" />
              </div>
              <div className="info-usuario-simple">
                <span className="nombre-usuario-simple">
                  {entrenador?.nombre_Completo}
                </span>
                <span className="rol-usuario-simple">Entrenador</span>
              </div>
            </button>

            {/* Menú desplegable */}
            {menuUsuarioAbierto && (
              <>
                <div className="overlay-menu-simple" onClick={cerrarMenu}></div>
                <div className="menu-desplegable-usuario-simple">
                  <div className="header-menu-usuario-simple">
                    <div className="avatar-menu-simple">
                      <FaUser />
                    </div>
                    <div className="info-menu-simple">
                      <span className="nombre-menu-simple">
                        {entrenador?.nombre_Completo}
                      </span>
                      <span className="email-menu-simple">
                        {entrenador?.email}
                      </span>
                    </div>
                  </div>

                  <div
                    className="item-menu-usuario-simple"
                    onClick={() => {
                      setSeccion("entrenador");
                      cerrarMenu();
                    }}
                  >
                    <FaUser className="icono-menu-usuario-simple" />
                    Mi Perfil
                  </div>

                  <button
                    className="item-menu-usuario-simple boton-cerrar-sesion-simple"
                    onClick={cerrarSesion}
                  >
                    <FaSignOutAlt className="icono-menu-usuario-simple" />
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
