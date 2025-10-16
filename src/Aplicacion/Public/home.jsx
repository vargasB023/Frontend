import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Components/Public/img/logo.png";
import "../../Components/Public/css/home.css";
import entrenador from "../../Components/Public/img/entrenador.png";
import deportista from "../../Components/Public/img/deportista.png";

function Home() {
  const [user, setUser] = useState(null);
  return <Inicio user={user} />;
}

const Inicio = ({ user }) => {
  const [abrirModalLogin, setAbrirModalLogin] = useState(false);
  const [abrirModalRegistro, setAbrirModalRegistro] = useState(false);
  const navigate = useNavigate();

  const irA = (ruta) => {
    setAbrirModalLogin(false);
    setAbrirModalRegistro(false);
    navigate(ruta);
  };

  return (
    <div className="contenedor-general-inicio">
      <header className="seccion-hero-inicio">
        <div className="contenedor-texto-hero">
          <h1 className="titulo-hero-inicio">Bienvenido a GADDER</h1>
          <p className="subtitulo-hero-inicio">
            Gestión y Análisis Deportivo para el Desarrollo y Rendimiento
          </p>

          {!user && (
            <div className="contenedor-botones-hero">
              <button
                className="boton-hero-principal"
                onClick={() => setAbrirModalRegistro(true)}
              >
                Registrarse
              </button>

              <button
                className="boton-hero-secundario"
                onClick={() => setAbrirModalLogin(true)}
              >
                Iniciar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {abrirModalLogin && (
        <div className="overlay-rol" onClick={() => setAbrirModalLogin(false)}>
          <div className="modal-rol" onClick={(e) => e.stopPropagation()}>
            <h3 className="titulo-modal">¿Cómo deseas iniciar sesión?</h3>

            <div className="tarjetas-roles">
              <button
                className="tarjeta-rol entrenador"
                onClick={() => irA("/inicio")}
              >
                <span className="icono-rol">
                  <div>
                    <img src={entrenador} alt="entrenador" />
                  </div>
                </span>
                Entrenador
              </button>

              <button
                className="tarjeta-rol deportista"
                onClick={() => irA("/inicioD")}
              >
                <span className="icono-rol">
                  <div>
                    <img src={deportista} alt="deportista" />
                  </div>
                </span>
                Deportista
              </button>
            </div>

            <button
              className="cerrar-modal"
              onClick={() => setAbrirModalLogin(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ---------- MODAL REGISTRO ---------- */}
      {abrirModalRegistro && (
        <div
          className="overlay-rol"
          onClick={() => setAbrirModalRegistro(false)}
        >
          <div className="modal-rol" onClick={(e) => e.stopPropagation()}>
            <h3 className="titulo-modal">¿Cómo deseas registrarte?</h3>

            <div className="tarjetas-roles">
              <button
                className="tarjeta-rol entrenador"
                onClick={() => irA("/entrenador")}
              >
                <span className="icono-rol">
                  <div>
                    <img src={entrenador} alt="entrenador" />
                  </div>
                </span>
                Entrenador
              </button>

              <button
                className="tarjeta-rol deportista"
                onClick={() => irA("/deportista")}
              >
                <span className="icono-rol">
                  <div>
                    <img src={deportista} alt="deportista" />
                  </div>
                </span>
                Deportista
              </button>
            </div>

            <button
              className="cerrar-modal"
              onClick={() => setAbrirModalRegistro(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ---------- ACERCA ---------- */}
      <section className="seccion-acerca-inicio">
        <div className="contenedor-acerca">
          <div className="imagen-acerca">
            <img src={logo} alt="Equipo deportivo" />
          </div>
          <div className="texto-acerca">
            <h2 className="titulo-acerca">
              Transformando el Deporte Formativo
            </h2>
            <p className="descripcion-acerca">
              GADDER surge como respuesta a la necesidad de centralizar y
              optimizar la gestión deportiva. En categorías formativas existen
              desafíos como la falta de sistematización en la recolección de
              datos y la escasa participación de los padres.
            </p>
            <div className="botones-acerca">
              <Link to="/listar" className="boton-acerca-principal">
                Ver Deportistas
              </Link>
              <Link to="/equipos" className="boton-acerca-secundario">
                Explorar Equipos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIOS ---------- */}
      <section className="seccion-testimonios-inicio">
        <div className="contenedor-testimonios">
          <h2 className="titulo-seccion-testimonios">
            Lo que dicen nuestros usuarios
          </h2>

          <div className="fila-testimonios">
            <div className="tarjeta-testimonio">
              <blockquote>
                "GADDER ha revolucionado nuestra forma de trabajar con los
                jóvenes atletas."
              </blockquote>
              <footer>
                Carlos M., <cite>Entrenador</cite>
              </footer>
            </div>

            <div className="tarjeta-testimonio">
              <blockquote>
                "Ahora puedo seguir el progreso de mi hijo de manera
                transparente."
              </blockquote>
              <footer>
                María L., <cite>Madre</cite>
              </footer>
            </div>

            <div className="tarjeta-testimonio">
              <blockquote>
                "Los análisis de rendimiento me ayudan a mejorar mis
                habilidades."
              </blockquote>
              <footer>
                Juan P., <cite>Deportista</cite>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="seccion-cta-inicio">
        <div className="contenedor-cta">
          <h2 className="titulo-cta">
            ¿Listo para transformar tu gestión deportiva?
          </h2>
          <Link to={user ? "/perfil" : "/registrar"} className="boton-cta">
            {user ? "Ir a mi perfil" : "Empieza Ahora"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
