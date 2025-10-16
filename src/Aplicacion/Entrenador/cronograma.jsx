import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Components/Public/css/cronograma.css";

const Cronograma = () => {

  const entrenadorGuardado = localStorage.getItem("entrenador");
  const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

  const [eventos, setEventos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [vistaActual, setVistaActual] = useState("lista");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [nuevoEvento, setNuevoEvento] = useState({
    ID_Entrenador: "",
    ID_Equipo: "",
    nombre_Evento: "",
    fecha: "",
    hora: "00:00",
    tipo_Evento: "ENTRENAMIENTO",
    lugar: "",
    descripcion: "",
  });

  const [editandoEventoId, setEditandoEventoId] = useState(null);
  const [entrenadores, setEntrenadores] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // ------------------ Helpers ------------------
  const horaParaInput = (hora) => {
    if (!hora) return "00:00";
    return hora.length >= 5 ? hora.slice(0, 5) : hora;
  };

  const horaParaBackend = (hora) => {
    if (!hora) return "00:00:00";
    return hora.length === 5 ? `${hora}:00` : hora;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    let d = new Date(fecha);
    if (isNaN(d)) {
      const dateOnly = String(fecha).slice(0, 10);
      d = new Date(dateOnly);
      if (isNaN(d)) return fecha;
    }
    return d.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const obtenerNombreEntrenador = (id) => {
    if (!id) return "No asignado";
    const entrenador = entrenadores.find(
      (e) => String(e.ID_Entrenador) === String(id)
    );
    return entrenador ? entrenador.nombre : "No asignado";
  };

  const obtenerNombreEquipo = (id) => {
    if (!id) return "No asignado";
    const equipo = equipos.find((e) => String(e.ID_Equipo) === String(id));
    return equipo ? equipo.nombre_Equipo : "No asignado";
  };

  const listarEventos = async () => {
    try {
      const { data } = await axios.get(`https://backend-5gwv.onrender.com/api/cronograma/entrenador/${entrenador.ID_Entrenador}`);
      setEventos(data);
    } catch {
      alert("Error al cargar eventos");
    }
  };

  useEffect(() => {
    listarEventos();

    axios
      .get("https://backend-5gwv.onrender.com/api/entrenador")
      .then((res) => setEntrenadores(res.data))
      .catch(() => alert("Error al cargar entrenadores"));

    axios
      .get(`https://backend-5gwv.onrender.com/api/equipo/entrenador/${entrenador.ID_Entrenador}`)
      .then((res) => setEquipos(res.data))
      .catch(() => alert("Error al cargar equipos"));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFormulario = () => {
    setNuevoEvento({
      ID_Entrenador: "",
      ID_Equipo: "",
      nombre_Evento: "",
      fecha: "",
      hora: "00:00",
      tipo_Evento: "ENTRENAMIENTO",
      lugar: "",
      descripcion: "",
    });
    setEditandoEventoId(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const entrenador = JSON.parse(localStorage.getItem("entrenador")) || {};
      const payload = {
        ...nuevoEvento,
        ID_Entrenador: entrenador.ID_Entrenador,
        hora: horaParaBackend(nuevoEvento.hora),
      };

      if (editandoEventoId) {
        await axios.put(
          `https://backend-5gwv.onrender.com/api/cronograma/${editandoEventoId}`,
          payload
        );
      } else {
        const { data } = await axios.post(
          "https://backend-5gwv.onrender.com/api/cronograma",
          payload
        );
        setEventos((prev) => [...prev, data]);
      }
      resetFormulario();
      listarEventos();
    } catch (err) {
      console.error(err);
      alert("Error al guardar/actualizar evento");
    }
  };

  const eliminarEvento = async (id) => {
     console.log("Intentando eliminar evento con ID:", id);
    try {
      await axios.delete(`https://backend-5gwv.onrender.com/api/cronograma/${id}`);
      setEventos((prev) => prev.filter((evento) => evento.ID_Cronograma !== id));
    } catch {
      alert("Error al eliminar evento");
    }
  };

  const iniciarEdicion = (evento) => {
    setNuevoEvento({
      ...evento,
      fecha: evento.fecha ? String(evento.fecha).slice(0, 10) : "",
      hora: horaParaInput(evento.hora),
      ID_Equipo: evento.ID_Equipo ? String(evento.ID_Equipo) : "",
      ID_Entrenador: evento.ID_Entrenador ? String(evento.ID_Entrenador) : "",
    });
    setEditandoEventoId(evento.ID_Cronograma);
    setMostrarFormulario(true);
  };

  // ------------------ Filtrados ------------------
  const eventosFiltrados = eventos.filter((evento) => {
    if (filtroTipo === "TODOS") return true;
    return evento.tipo_Evento === filtroTipo;
  });

  const eventosDelDia = eventosFiltrados.filter(
    (evento) => evento.fecha?.slice(0, 10) === fechaSeleccionada
  );

  // ------------------ Render ------------------
  return (
    <div className="cro_contenedor_cronograma">
      <header className="cro_encabezado_cronograma">
        <h1 className="cro_titulo">Cronograma de Actividades</h1>
        <div className="cro_controles_encabezado">
          <button
            className="cro_boton_nEvento"
            onClick={() => {
              resetFormulario();
              setMostrarFormulario(true);
            }}
          >
            {mostrarFormulario ? "Cancelar" : "Nuevo Evento"}
          </button>
        </div>
      </header>

      <div className="cro_navegacion_cronograma">
        <div className="cro_selector_vista">
          <button
            className={`cro_boton_lista ${
              vistaActual === "lista"
                ? "cro_boton_activo"
                : "cro_boton_secundario"
            }`}
            onClick={() => setVistaActual("lista")}
          >
            Lista
          </button>
          <button
            className={`cro_boton_calendario ${
              vistaActual === "calendario"
                ? "cro_boton_activo"
                : "cro_boton_secundario"
            }`}
            onClick={() => setVistaActual("calendario")}
          >
            Calendario
          </button>
        </div>

        <div className="cro_filtros">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="cro_selector_filtro"
          >
            <option value="TODOS">Todos</option>
            <option value="ENTRENAMIENTO">Entrenamientos</option>
            <option value="PARTIDO">Partidos</option>
          </select>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="cro_capa_formulario">
          <form className="cro_formulario_evento" onSubmit={handleSubmit}>
            <h3>{editandoEventoId ? "Editar Evento" : "Nuevo Evento"}</h3>

            <div className="cro_grupo_formulario">
              <label>Equipo:</label>
              <select
                name="ID_Equipo"
                value={nuevoEvento.ID_Equipo}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar equipo</option>
                {equipos.map((equipo) => (
                  <option
                    key={equipo.ID_Equipo}
                    value={String(equipo.ID_Equipo)}
                  >
                    {equipo.nombre_Equipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="cro_grupo_formulario">
              <label>Tipo de Evento:</label>
              <select
                name="tipo_Evento"
                value={nuevoEvento.tipo_Evento}
                onChange={handleInputChange}
                required
              >
                <option value="ENTRENAMIENTO">Entrenamiento</option>
                <option value="PARTIDO">Partido</option>
              </select>
            </div>

            <div className="cro_grupo_formulario">
              <label>Nombre del Evento:</label>
              <input
                type="text"
                name="nombre_Evento"
                value={nuevoEvento.nombre_Evento}
                onChange={handleInputChange}
                maxLength="150"
                required
              />
            </div>

            <div className="cro_fila_formulario">
              <div className="cro_grupo_formulario">
                <label>Fecha:</label>
                <input
                  type="date"
                  name="fecha"
                  value={nuevoEvento.fecha}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="cro_grupo_formulario">
                <label>Hora:</label>
                <input
                  type="time"
                  name="hora"
                  value={horaParaInput(nuevoEvento.hora)}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="cro_grupo_formulario">
              <label>Lugar:</label>
              <input
                type="text"
                name="lugar"
                value={nuevoEvento.lugar}
                onChange={handleInputChange}
                maxLength="150"
                required
              />
            </div>

            <div className="cro_grupo_formulario">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={nuevoEvento.descripcion}
                onChange={handleInputChange}
                maxLength="200"
                rows="3"
                required
              />
            </div>

            <div className="cro_acciones_formulario">
              <button type="submit" className="cro_boton cro_boton_primario">
                {editandoEventoId ? "Actualizar Evento" : "Guardar Evento"}
              </button>
              <button
                type="button"
                className="cro_boton cro_boton_secundario"
                onClick={resetFormulario}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <main className="cro_principal_cronograma">
        {vistaActual === "lista" ? (
          <div className="cro_vista_lista">
            {eventosFiltrados.length === 0 ? (
              <p>No hay eventos programados.</p>
            ) : (
              eventosFiltrados
                .filter((evento) => evento.ID_Cronograma != null)
                .map((evento) => (
                  <div
                    key={evento.ID_Cronograma}
                    className={`cro_tarjeta_evento ${evento.tipo_Evento.toLowerCase()}`}
                  >
                    <div className="cro_encabezado_evento">
                      <h3>{evento.nombre_Evento}</h3>
                      <span
                        className={`cro_etiqueta_tipo ${evento.tipo_Evento.toLowerCase()}`}
                      >
                        {evento.tipo_Evento}
                      </span>
                    </div>

                    <div className="cro_info_evento">
                      <p>
                        <strong>Fecha:</strong> {formatearFecha(evento.fecha)}
                      </p>
                      <p>
                        <strong>Hora:</strong> {horaParaInput(evento.hora)}
                      </p>
                      <p>
                        <strong>Lugar:</strong> {evento.lugar}
                      </p>
                      <p>
                        <strong>Entrenador:</strong>{" "}
                        {obtenerNombreEntrenador(evento.ID_Entrenador)}
                      </p>
                      <p>
                        <strong>Equipo:</strong>{" "}
                        {obtenerNombreEquipo(evento.ID_Equipo)}
                      </p>
                      <p>
                        <strong>Descripción:</strong> {evento.descripcion}
                      </p>
                    </div>

                    <div className="cro_acciones_evento">
                      <button
                        className="cro_btn_editar"
                        onClick={() => iniciarEdicion(evento)}
                      >
                        Editar
                      </button>
                      <button
                        className="cro_btn_eliminar"
                        onClick={() => eliminarEvento(evento.ID_Cronograma)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        ) : (
          <div className="cro_vista_calendario">
            <h3>Eventos del {formatearFecha(fechaSeleccionada)}</h3>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
            {eventosDelDia.length === 0 ? (
              <p>No hay eventos para esta fecha.</p>
            ) : (
              eventosDelDia
                .filter((evento) => evento.ID_Cronograma != null)
                .map((evento) => (
                  <div
                    key={evento.ID_Cronograma}
                    className={`cro_tarjeta_evento ${evento.tipo_Evento.toLowerCase()}`}
                  >
                    <h4>{evento.nombre_Evento}</h4>
                    <p>
                      <strong>Hora:</strong> {horaParaInput(evento.hora)}
                    </p>
                    <p>
                      <strong>Lugar:</strong> {evento.lugar}
                    </p>
                    <p>
                      <strong>Equipo:</strong>{" "}
                      {obtenerNombreEquipo(evento.ID_Equipo)}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {evento.descripcion}
                    </p>
                  </div>
                ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Cronograma;
