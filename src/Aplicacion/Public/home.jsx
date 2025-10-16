import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Components/Public/img/logoNew.png";
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
      {/* ---------- HERO ---------- */}
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

      {/* ---------- MODAL LOGIN ---------- */}
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
                  <img src={entrenador} alt="entrenador" />
                </span>
                Entrenador
              </button>

              <button
                className="tarjeta-rol deportista"
                onClick={() => irA("/inicioD")}
              >
                <span className="icono-rol">
                  <img src={deportista} alt="deportista" />
                </span>
                Deportista
              </button>
            </div>

            <button className="cerrar-modal">Cancelar</button>
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
                  <img src={entrenador} alt="entrenador" />
                </span>
                Entrenador
              </button>

              <button
                className="tarjeta-rol deportista"
                onClick={() => irA("/deportista")}
              >
                <span className="icono-rol">
                  <img src={deportista} alt="deportista" />
                </span>
                Deportista
              </button>
            </div>

            <button className="cerrar-modal">Cancelar</button>
          </div>
        </div>
      )}

      {/* ---------- ACERCA ---------- */}
      <section className="seccion-acerca-inicio">
        <div className="contenedor-acerca">
          <div className="imagen-acerca">
            <img src={logo} alt="Logo GADDER" />
          </div>
          <div className="texto-acerca">
            <h1 className="titulo-acerca">Transformando el Deporte Formativo</h1>
            <p className="descripcion-acerca">
              GADDER nace para revolucionar la gestión deportiva en categorías
              formativas, centralizando procesos, datos y comunicación entre
              entrenadores, deportistas y padres.
            </p>
          </div>
        </div>
      </section>

      <section className="seccion-testimonios-inicio">
        <div className="contenedor-testimonios">
          <h2 className="titulo-seccion-testimonios">
            Lo que dicen nuestros usuarios
          </h2>

          <div className="fila-testimonios">
            <div className="tarjeta-testimonio">
              <blockquote>
                “GADDER ha revolucionado nuestra forma de trabajar con los jóvenes atletas.”
              </blockquote>
              <footer>
                Carlos M., <cite>Entrenador</cite>
              </footer>
            </div>

            <div className="tarjeta-testimonio">
              <blockquote>
                “Ahora puedo seguir el progreso de mi hijo de manera transparente.”
              </blockquote>
              <footer>
                María L., <cite>Madre</cite>
              </footer>
            </div>

            <div className="tarjeta-testimonio">
              <blockquote>
                “Los análisis de rendimiento me ayudan a mejorar mis habilidades.”
              </blockquote>
              <footer>
                Juan P., <cite>Deportista</cite>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA FINAL AJUSTADA ---------- */}
      <section className="seccion-cta-inicio compacta">
        <div className="contenedor-cta">
          <h2 className="titulo-cta">
            Crece, analiza y mejora con GADDER
          </h2>
          <p className="subtexto-cta">
            Únete a la comunidad que impulsa el rendimiento deportivo con datos, análisis y pasión.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
