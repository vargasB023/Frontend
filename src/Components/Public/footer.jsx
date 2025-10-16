import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa"
import "./css/footer.css"
import logo from "./img/logoNew.png"

export default function Footer() {
  const anioActual = new Date().getFullYear()

  return (
    <footer className="pie-pagina-simple">
      <div className="contenedor-pie-simple">
        {/* Contenido Principal */}
        <div className="contenido-pie-simple">
          {/* Logo y Descripción */}
          <div className="seccion-logo-simple">
            <div className="logo-pie-simple">
              <span className="nombre-empresa-simple">Gadder</span>
            </div>
            <p className="descripcion-simple">
              Tu plataforma de entrenamiento personal para alcanzar tus objetivos de fitness.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="seccion-enlaces-simple">
            <h4 className="titulo-seccion-simple">Enlaces</h4>
            <div className="lista-enlaces-simple">
              <Link to="/inicio" className="enlace-simple">
                Inicio
              </Link>
              <Link to="/ayuda" className="enlace-simple">
                Ayuda
              </Link>
              <Link to="/contacto" className="enlace-simple">
                Contacto
              </Link>
              <Link to="/privacidad" className="enlace-simple">
                Privacidad
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div className="seccion-contacto-simple">
            <h4 className="titulo-seccion-simple">Contacto</h4>
            <div className="info-contacto-simple">
              <div className="item-contacto-simple">
                <FaEnvelope className="icono-contacto-simple" />
                <span>info@gadder.com</span>
              </div>
              <div className="item-contacto-simple">
                <FaPhone className="icono-contacto-simple" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <hr className="separador-simple" />

        {/* Footer Bottom */}
        <div className="footer-bottom-simple">
          <p className="copyright-simple">© {anioActual} Gadder. Todos los derechos reservados.</p>

          <div className="redes-sociales-simple">
            <a href="#" className="enlace-red-simple" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="enlace-red-simple" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="enlace-red-simple" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
