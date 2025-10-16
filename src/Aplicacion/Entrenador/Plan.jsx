import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Zap, Trash2, Plus } from "lucide-react";
import "../../Components/Public/css/plan.css";

const Crear_Plan_Entrenamiento = () => {
  const entrenadorGuardado = localStorage.getItem("entrenador");
  const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

  const [equipos, setEquipos] = useState([]);
  const [microciclos, setMicrociclos] = useState([]);
  const [planesEntrenamiento, setPlanesEntrenamiento] = useState([]); // 👈 Nuevo estado
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [formulario, setFormulario] = useState({
    ID_Entrenador: entrenador?.ID_Entrenador || "",
    ID_Equipo: "",
    nombre_Plan: "",
    objetivo: "",
    duracion: "",
    fecha_Inicio: "",
    fecha_fin: "",
    estado: "",
  });
  const [nuevoMicrociclo, setNuevoMicrociclo] = useState({
    ID_Microciclo: "",
  });
  const [microciclosSeleccionados, setMicrociclosSeleccionados] = useState([]);

  // === Cargar equipos del entrenador ===
  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        if (!entrenador?.ID_Entrenador) return;
        const { data } = await axios.get(
          `https://backend-5gwv.onrender.com/api/equipo/entrenador/${entrenador.ID_Entrenador}`
        );
        setEquipos(data || []);
      } catch {
        setMensaje("No se pudieron cargar los equipos.");
      }
    };
    cargarEquipos();
  }, [entrenador?.ID_Entrenador]);

  // === Cargar microciclos ===
  useEffect(() => {
    const cargarMicrociclos = async () => {
      try {
        const { data } = await axios.get(
          "https://backend-5gwv.onrender.com/api/microciclo"
        );
        setMicrociclos(data || []);
      } catch {
        setMensaje("No se pudieron cargar los microciclos.");
      } finally {
        setCargando(false);
      }
    };
    cargarMicrociclos();
  }, []);

  // === Cargar planes por entrenador ===
  useEffect(() => {
    const cargarPlanes = async () => {
      if (!entrenador?.ID_Entrenador) return;
      try {
        const { data } = await axios.get(
          `https://backend-5gwv.onrender.com/api/plan_de_entrenamiento/entrenador/${entrenador.ID_Entrenador}`
        );
        setPlanesEntrenamiento(data || []);
      } catch (error) {
        console.error(error);
        setMensaje("No se pudieron cargar los planes de entrenamiento.");
      }
    };
    cargarPlanes();
  }, [entrenador?.ID_Entrenador]);

  // === Manejadores de formulario ===
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
      ID_Entrenador: entrenador?.ID_Entrenador || "",
    }));
  };

  const manejarCambioMicrociclo = (e) => {
    const { name, value } = e.target;
    setNuevoMicrociclo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarMicrociclo = () => {
    if (!nuevoMicrociclo.ID_Microciclo) {
      setMensaje("Selecciona un microciclo antes de agregarlo.");
      return;
    }
    if (
      microciclosSeleccionados.some(
        (m) => m.ID_Microciclo === parseInt(nuevoMicrociclo.ID_Microciclo)
      )
    ) {
      setMensaje("Este microciclo ya fue agregado.");
      return;
    }
    const microInfo = microciclos.find(
      (m) => m.ID_Microciclo === parseInt(nuevoMicrociclo.ID_Microciclo)
    );
    const microConDatos = {
      ID_Microciclo: parseInt(nuevoMicrociclo.ID_Microciclo),
      nombre_Microciclo: microInfo ? microInfo.nombre_Microciclo : "Sin nombre",
      fecha_Inicio: microInfo?.fecha_Inicio,
      fecha_Fin: microInfo?.fecha_Fin,
      intensidad: microInfo?.intensidad,
    };
    setMicrociclosSeleccionados([...microciclosSeleccionados, microConDatos]);
    setNuevoMicrociclo({ ID_Microciclo: "" });
    setMensaje("");
  };

  const eliminarMicrociclo = (id) => {
    setMicrociclosSeleccionados((prev) =>
      prev.filter((m) => m.ID_Microciclo !== id)
    );
  };

  // === Envío del formulario ===
  const manejarEnvio = async (e) => {
    e.preventDefault();
    const requeridos = [
      "ID_Equipo",
      "nombre_Plan",
      "objetivo",
      "duracion",
      "fecha_Inicio",
      "fecha_fin",
      "estado",
    ];
    if (requeridos.some((campo) => !formulario[campo])) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }
    if (microciclosSeleccionados.length === 0) {
      setMensaje("Debes agregar al menos un microciclo.");
      return;
    }
    try {
      const dataAEnviar = {
        ...formulario,
        microciclos: microciclosSeleccionados.map((m) => ({
          ID_Microciclo: m.ID_Microciclo,
        })),
      };
      await axios.post(
        "https://backend-5gwv.onrender.com/api/plan_de_entrenamiento",
        dataAEnviar
      );
      setMensaje("Plan de entrenamiento creado correctamente.");

      // 🔁 Recargar lista de planes
      const { data } = await axios.get(
        `https://backend-5gwv.onrender.com/api/plan_de_entrenamiento/entrenador/${entrenador.ID_Entrenador}`
      );
      setPlanesEntrenamiento(data || []);

      // Limpiar formulario
      setFormulario({
        ID_Entrenador: entrenador?.ID_Entrenador || "",
        ID_Equipo: "",
        nombre_Plan: "",
        objetivo: "",
        duracion: "",
        fecha_Inicio: "",
        fecha_fin: "",
        estado: "",
      });
      setMicrociclosSeleccionados([]);
      setNuevoMicrociclo({ ID_Microciclo: "" });
    } catch (error) {
      setMensaje(
        "Error al crear el plan: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // === Render ===
  if (cargando) return <div className="pln_contenedor">Cargando...</div>;
  if (!entrenador)
    return (
      <div className="pln_contenedor">
        <h2>No se encontró información del entrenador</h2>
        <p>Por favor, inicia sesión nuevamente.</p>
      </div>
    );

  return (
    <div className="pln_contenedor">
      <h2 className="pln_titulo">Crear Plan de Entrenamiento</h2>

      {/* === FORMULARIO === */}
      <form className="pln_formulario" onSubmit={manejarEnvio}>
        {/* FILA 1 */}
        <div className="pln_grid3">
          <div className="pln_item">
            <label>Entrenador</label>
            <input
              type="text"
              value={entrenador?.nombre_Completo || ""}
              disabled
              className="pln_input"
            />
          </div>

          <div className="pln_item">
            <label>Equipo*</label>
            <select
              name="ID_Equipo"
              value={formulario.ID_Equipo}
              onChange={manejarCambio}
              className="pln_select"
              required
            >
              <option value="">Seleccione un equipo</option>
              {equipos.length > 0 ? (
                equipos.map((eq) => (
                  <option key={eq.ID_Equipo} value={eq.ID_Equipo}>
                    {eq.nombre_Equipo}
                  </option>
                ))
              ) : (
                <option disabled>No hay equipos registrados</option>
              )}
            </select>
          </div>

          <div className="pln_item">
            <label>Nombre del Plan*</label>
            <input
              type="text"
              name="nombre_Plan"
              value={formulario.nombre_Plan}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        {/* FILA 2 */}
        <div className="pln_grid2">
          <div className="pln_item">
            <label>Objetivo*</label>
            <input
              type="text"
              name="objetivo"
              value={formulario.objetivo}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="pln_item">
            <label>Duración (en semanas)*</label>
            <input
              type="number"
              name="duracion"
              value={formulario.duracion}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        {/* FILA 3 */}
        <div className="pln_grid3">
          <div className="pln_item">
            <label>Fecha de Inicio*</label>
            <input
              type="date"
              name="fecha_Inicio"
              value={formulario.fecha_Inicio}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="pln_item">
            <label>Fecha de Fin*</label>
            <input
              type="date"
              name="fecha_fin"
              value={formulario.fecha_fin}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="pln_item">
            <label>Estado*</label>
            <select
              name="estado"
              value={formulario.estado}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccione estado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN CURSO">En curso</option>
              <option value="FINALIZADO">Finalizado</option>
            </select>
          </div>
        </div>

        {/* FILA 4 - MICROCICLOS */}
        <div className="pln_microciclo_agregar_contenedor">
          <label>Agregar Microciclo*</label>
          <div className="pln_microciclo_agregar">
            <select
              name="ID_Microciclo"
              value={nuevoMicrociclo.ID_Microciclo}
              onChange={manejarCambioMicrociclo}
              className="pln_select"
            >
              <option value="">Seleccione un microciclo</option>
              {microciclos.length > 0 ? (
                microciclos.map((m) => (
                  <option key={m.ID_Microciclo} value={m.ID_Microciclo}>
                    {`${m.nombre_Microciclo} | ${m.fecha_Inicio} → ${
                      m.fecha_Fin
                    } | Intensidad: ${m.intensidad || "No definida"}`}
                  </option>
                ))
              ) : (
                <option disabled>No hay microciclos disponibles</option>
              )}
            </select>
            <button
              type="button"
              className="pln_btnAgregar"
              onClick={agregarMicrociclo}
            >
              <Plus size={18} /> Agregar
            </button>
          </div>
        </div>

        {/* LISTA MICROCICLOS */}
        {microciclosSeleccionados.length > 0 && (
          <ul className="pln_listaMicrociclos">
            {microciclosSeleccionados.map((m) => (
              <li key={m.ID_Microciclo} className="pln_micro_item">
                <div className="pln_micro_info">
                  <strong>{m.nombre_Microciclo}</strong>
                  <div className="pln_micro_detalle">
                    <Calendar size={14} />{" "}
                    <span>
                      {m.fecha_Inicio} → {m.fecha_Fin}
                    </span>
                    <Zap size={14} />{" "}
                    <span>{m.intensidad || "No definida"}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="pln_btnEliminar"
                  onClick={() => eliminarMicrociclo(m.ID_Microciclo)}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* BOTONES */}
        <div className="pln_botones">
          <button type="submit" className="pln_btnGuardar">
            Guardar Plan
          </button>
          <button
            type="button"
            className="pln_btnCancelar"
            onClick={() => {
              setFormulario({
                ID_Entrenador: entrenador?.ID_Entrenador || "",
                ID_Equipo: "",
                nombre_Plan: "",
                objetivo: "",
                duracion: "",
                fecha_Inicio: "",
                fecha_fin: "",
                estado: "",
              });
              setMicrociclosSeleccionados([]);
              setNuevoMicrociclo({ ID_Microciclo: "" });
            }}
          >
            Cancelar
          </button>
        </div>

        {mensaje && <p className="pln_mensaje">{mensaje}</p>}
      </form>

      <div className="pln_listado">
        <h3 className="pln_subtitulo">Planes de Entrenamiento Registrados</h3>

        {planesEntrenamiento.length === 0 ? (
          <p>No hay planes registrados aún.</p>
        ) : (
          <table className="pln_tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Equipo</th>
                <th>Duración</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Microciclos</th>
              </tr>
            </thead>
            <tbody>
              {planesEntrenamiento.map((plan) => (
                <React.Fragment key={plan.ID_Plan}>
                  <tr>
                    <td>{plan.nombre_Plan}</td>
                    {/* 👇 CAMBIO AQUÍ: ahora usamos plan.equipo */}
                    <td>{plan.equipo?.nombre_Equipo || "Sin asignar"}</td>
                    <td>{plan.duracion} semanas</td>
                    <td>{plan.fecha_Inicio}</td>
                    <td>{plan.fecha_fin}</td>
                    <td>{plan.estado}</td>
                    <td>
                      {/* ✅ Mostrar microciclos asociados */}
                      {plan.microciclo && plan.microciclo.length > 0 ? (
                        <details className="pln_detalle_micro">
                          <summary>
                            {plan.microciclo.length} microciclo
                            {plan.microciclo.length > 1 ? "s" : ""}
                          </summary>
                          <ul className="pln_lista_micro">
                            {plan.microciclo.map((micro) => (
                              <li key={micro.ID_Microciclo}>
                                <strong>{micro.nombre_Microciclo}</strong>{" "}
                                <br />
                                <Calendar size={12} /> {micro.fecha_Inicio} →{" "}
                                {micro.fecha_Fin} <br />
                                <Zap size={12} /> Intensidad:{" "}
                                {micro.intensidad || "No definida"} <br />
                                <em>
                                  {micro.descripcion || "Sin descripción"}
                                </em>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <span className="pln_sin_micro">
                          Sin microciclos asignados
                        </span>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Crear_Plan_Entrenamiento;
