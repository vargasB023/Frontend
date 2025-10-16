import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaBell, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa"
import "./css/encabezado.css"
import gadderNuevo from "./img/GadderNuevo.png";

export default function EncabezadoSimple({ setSeccion }) {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const navigate = useNavigate()

  const entrenadorGuardado = localStorage.getItem("entrenador")
  const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null

  const alternarMenuUsuario = () => {
    setMenuUsuarioAbierto(!menuUsuarioAbierto)
  }

  const cerrarMenu = () => {
    setMenuUsuarioAbierto(false)
  }

  const cerrarSesion = () => {
    // Borra todos los datos del localStorage
    localStorage.clear("entrenador")
    setMenuUsuarioAbierto(false)
    navigate("/") // Redirige al login o página principal
  }

  return (
    <header className="encabezado-simple">
      <div className="contenedor-encabezado-simple">
        <div className="contenedor-logo-simple">
          <Link to="/dashEntrenador" className="enlace-logo-simple">
            <img
               src={gadderNuevo} alt="GADDER Logo" className="img-logo" />
          </Link>
        </div>
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
                      <span className="email-menu-simple">{entrenador?.email}</span>
                    </div>
                  </div>

                  <hr className="separador-menu-usuario-simple" />

                  <div
                    className="item-menu-usuario-simple"
                    onClick={() => setSeccion("entrenador")}
                  >
                    <FaUser className="icono-menu-usuario-simple" />
                    Mi Perfil
                  </div>

                  <hr className="separador-menu-usuario-simple" />

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
  )
}
