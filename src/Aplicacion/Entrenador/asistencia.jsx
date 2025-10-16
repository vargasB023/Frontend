import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Components/Public/css/Asistencia.css";
import { FaMapMarkerAlt, FaUsers, FaClipboardList, FaUserTie } from "react-icons/fa";

const entrenadorGuardado = localStorage.getItem("entrenador");
const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

const Asistencia = () => {
  const [eventosHoy, setEventosHoy] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [asistenciasPorEvento, setAsistenciasPorEvento] = useState({});
  const [eventoAbierto, setEventoAbierto] = useState(null);
  const [eventosCalificados, setEventosCalificados] = useState([]);

  // 🔹 Manejo de persistencia con localStorage
  useEffect(() => {
    const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Bogota" });
    const eventosGuardados = JSON.parse(localStorage.getItem("eventosCalificados")) || [];
    const ultimaFecha = localStorage.getItem("fechaUltimoGuardado");

    if (ultimaFecha !== hoy) {
      // Limpiar si cambió el día
      localStorage.setItem("eventosCalificados", JSON.stringify([]));
      localStorage.setItem("fechaUltimoGuardado", hoy);
      setEventosCalificados([]);
    } else {
      setEventosCalificados(eventosGuardados);
    }
  }, []);

  // 🔹 Cargar equipos
  useEffect(() => {
    if (entrenador) {
      axios
        .get(`https://backend-5gwv.onrender.com/api/equipo/entrenador/${entrenador.ID_Entrenador}`)
        .then((res) => setEquipos(res.data))
        .catch((err) => console.error("Error cargando equipos:", err));
    }
  }, []);

  // 🔹 Cargar eventos de hoy
  useEffect(() => {
    const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Bogota" });

    axios
      .get("https://backend-5gwv.onrender.com/api/cronograma")
      .then((res) => {
        const eventosFiltrados = res.data.filter(
          (e) => e.fecha === hoy && e.ID_Entrenador === entrenador.ID_Entrenador
        );
        setEventosHoy(eventosFiltrados);
      })
      .catch((err) => console.error("Error cargando cronograma:", err));
  }, []);

  // 🔹 Inicializar asistencias por evento
  useEffect(() => {
    if (eventosHoy.length > 0 && equipos.length > 0) {
      const asistenciasIniciales = {};
      eventosHoy.forEach((evento) => {
        const equipoEncontrado = equipos.find((eq) => eq.ID_Equipo === evento.ID_Equipo);
        if (equipoEncontrado) {
          asistenciasIniciales[evento.ID_Cronograma] = (equipoEncontrado.deportista || []).map(
            (d) => ({
              ID_Deportista: d.ID_Deportista,
              estado: null,
              observaciones: "",
              nombre_Completo: d.nombre_Completo,
              posicion: d.posicion,
            })
          );
        }
      });
      setAsistenciasPorEvento(asistenciasIniciales);
    }
  }, [eventosHoy, equipos]);

  // 👉 Cambiar estado asistencia
  const manejarCambioAsistencia = (idEvento, idDeportista, estado) => {
    setAsistenciasPorEvento((prev) => ({
      ...prev,
      [idEvento]: prev[idEvento].map((a) =>
        a.ID_Deportista === idDeportista ? { ...a, estado } : a
      ),
    }));
  };

  // 👉 Guardar asistencia
  const guardarAsistencia = (evento) => {
    const asistencias = asistenciasPorEvento[evento.ID_Cronograma] || [];
    axios
      .post("https://backend-5gwv.onrender.com/api/asistencia", {
        ID_Cronograma: evento.ID_Cronograma,
        asistencias,
      })
      .then(() => {
        alert(`✅ Asistencia del evento ${evento.ID_Cronograma} guardada`);

        // 🔹 Actualizar eventos calificados y localStorage
        setEventosCalificados((prev) => {
          const nuevos = [...prev, evento.ID_Cronograma];
          localStorage.setItem("eventosCalificados", JSON.stringify(nuevos));
          localStorage.setItem("fechaUltimoGuardado", new Date().toLocaleDateString("sv-SE", { timeZone: "America/Bogota" }));
          return nuevos;
        });

        // 🔹 Cerrar card
        if (eventoAbierto === evento.ID_Cronograma) setEventoAbierto(null);
      })
      .catch((err) => console.error("Error guardando asistencia:", err));
  };

  return (
    <div className="contenedor-asistencia">
      {eventosHoy.length > 0 ? (
        eventosHoy.map((evento) => {
          const asistenciasEvento = asistenciasPorEvento[evento.ID_Cronograma] || [];
          const abierto = eventoAbierto === evento.ID_Cronograma;
          const yaCalificado = eventosCalificados.includes(evento.ID_Cronograma);

          return (
            <div
              key={evento.ID_Cronograma}
              className={`card-evento ${yaCalificado ? "card-calificada" : ""}`}
            >
              <div className="detalles-entrenamiento">
                <h2 className="titulo-evento">{evento.nombre_Evento}</h2>

                <p className="fecha-hora">
                  {new Date(evento.fecha + "T00:00:00").toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  , {evento.hora}
                </p>

                <div className="info-entrenamiento">
                  <div className="columna-info">
                    <p>
                      <FaMapMarkerAlt className="icono" />
                      <span>
                        <strong>Lugar:</strong> {evento.lugar}
                      </span>
                    </p>
                    <p>
                      <FaUsers className="icono" />
                      <span>
                        <strong>Equipo:</strong>{" "}
                        {equipos.find((eq) => eq.ID_Equipo === evento.ID_Equipo)?.nombre_Equipo}
                      </span>
                    </p>
                    <p>
                      <FaClipboardList className="icono" />
                      <span>
                        <strong>Descripción:</strong> {evento.descripcion}
                      </span>
                    </p>
                  </div>

                  <div className="columna-info">
                    <p>
                      <FaUserTie className="icono" />
                      <span>
                        <strong>Entrenador:</strong> {entrenador?.nombre_Completo}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Botón de calificar */}
                <button
                  className={`boton-calificar ${yaCalificado ? "calificado" : ""}`}
                  disabled={yaCalificado} // 🔹 Deshabilitado si ya se calificó
                  onClick={() =>
                    setEventoAbierto(abierto ? null : evento.ID_Cronograma)
                  }
                >
                  {yaCalificado
                    ? "✅ Asistencia Calificada"
                    : abierto
                    ? "Ocultar Asistencia"
                    : "Calificar Asistencia"}
                </button>
              </div>

              {/* Card de asistencia solo si está abierto y no ha sido calificado */}
              {abierto && !yaCalificado && (
                <div className="lista-asistencia">
                  <h3>Asistencia</h3>
                  {asistenciasEvento.length > 0 ? (
                    asistenciasEvento.map((a, index) => (
                      <div key={a.ID_Deportista} className="item-deportista">
                        <div className="info-deportista">
                          <span className="numero">{index + 1}.</span>
                          <div className="datos">
                            <p className="nombre">{a.nombre_Completo}</p>
                            <p className="posicion">{a.posicion}</p>
                          </div>
                        </div>

                        <div className="acciones">
                          <label>
                            <input
                              type="radio"
                              checked={a.estado === "ASISTIO"}
                              onChange={() =>
                                manejarCambioAsistencia(
                                  evento.ID_Cronograma,
                                  a.ID_Deportista,
                                  "ASISTIO"
                                )
                              }
                            />
                            {"ASISTIÓ"}
                          </label>
                          <label>
                            <input
                              type="radio"
                              checked={a.estado === "NO_ASISTIO"}
                              onChange={() =>
                                manejarCambioAsistencia(
                                  evento.ID_Cronograma,
                                  a.ID_Deportista,
                                  "NO_ASISTIO"
                                )
                              }
                            />
                            {"NO ASISTIÓ"}
                          </label>
                          <input
                            type="text"
                            className="input-observacion"
                            value={a.observaciones || ""}
                            onChange={(e) =>
                              setAsistenciasPorEvento((prev) => ({
                                ...prev,
                                [evento.ID_Cronograma]: prev[evento.ID_Cronograma].map((x) =>
                                  x.ID_Deportista === a.ID_Deportista
                                    ? { ...x, observaciones: e.target.value }
                                    : x
                                ),
                              }))
                            }
                            placeholder="Observaciones..."
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay deportistas en este evento</p>
                  )}

                  <button
                    className="boton-guardar"
                    onClick={() => guardarAsistencia(evento)}
                  >
                    Guardar Asistencia
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="mensaje-no-evento">No hay eventos programados para hoy 🎉</p>
      )}
    </div>
  );
};

export default Asistencia;
