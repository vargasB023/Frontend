import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Target,
  Flame,
  Clock,
  FileText,
  Edit,
  Trash2,
  PlusCircle,
  XCircle,
} from "lucide-react";
import "../../Components/Public/css/microciclo.css";

const CrearMicrociclo = () => {
  const [formulario, setFormulario] = useState({
    nombre_Microciclo: "",
    fecha_Inicio: "",
    fecha_Fin: "",
    descripcion: "",
    objetivos: "",
    intensidad: "",
  });

  const [sesionesDisponibles, setSesionesDisponibles] = useState([]);
  const [sesionesSeleccionadas, setSesionesSeleccionadas] = useState([]);
  const [nuevoSesion, setNuevoSesion] = useState({
    ID_Sesion: "",
    dia_Semana: "",
  });

  const [microciclos, setMicrociclos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const diasSemana = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
  };

  useEffect(() => {
    const traerSesiones = async () => {
      try {
        const res = await axios.get("https://backend-5gwv.onrender.com/api/sesion");
        setSesionesDisponibles(res.data);
      } catch (error) {
        console.error("❌ Error cargando sesiones", error);
      }
    };
    traerSesiones();
  }, []);

  useEffect(() => {
    const traerMicrociclos = async () => {
      try {
        const res = await axios.get("https://backend-5gwv.onrender.com/api/microciclo");
        setMicrociclos(res.data);
      } catch (error) {
        console.error("❌ Error cargando microciclos", error);
      }
    };
    traerMicrociclos();
  }, [mensaje]);

  const manejarCambioMicrociclo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarCambioSesion = (e) => {
    setNuevoSesion({ ...nuevoSesion, [e.target.name]: e.target.value });
  };

  const agregarSesion = () => {
    if (!nuevoSesion.ID_Sesion || !nuevoSesion.dia_Semana) return;
    const sesionInfo = sesionesDisponibles.find(
      (s) => s.ID_Sesion === parseInt(nuevoSesion.ID_Sesion)
    );
    const sesionConDatos = {
      ID_Sesion: parseInt(nuevoSesion.ID_Sesion),
      dia_Semana: parseInt(nuevoSesion.dia_Semana),
      nombre_Sesion: sesionInfo ? sesionInfo.nombre_Sesion : "Sin nombre",
    };
    setSesionesSeleccionadas([...sesionesSeleccionadas, sesionConDatos]);
    setNuevoSesion({ ID_Sesion: "", dia_Semana: "" });
  };

  const enviarMicrociclo = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formulario,
        sesiones: sesionesSeleccionadas.map((s) => ({
          ID_Sesion: s.ID_Sesion,
          dia_Semana: s.dia_Semana,
        })),
      };

      if (editando) {
        await axios.put(
          `https://backend-5gwv.onrender.com/api/microciclo/${editando}`,
          payload
        );
        setMensaje("✏️ Microciclo editado correctamente");
      } else {
        await axios.post("https://backend-5gwv.onrender.com/api/microciclo", payload);
        setMensaje("✅ Microciclo creado correctamente");
      }

      resetFormulario();
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al guardar el microciclo");
    }
  };

  const eliminarMicrociclo = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este microciclo?")) return;
    try {
      await axios.delete(`https://backend-5gwv.onrender.com/api/microciclo/${id}`);
      setMensaje("🗑️ Microciclo eliminado correctamente");
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al eliminar microciclo");
    }
  };

  const editarMicrociclo = (micro) => {
    setFormulario({
      nombre_Microciclo: micro.nombre_Microciclo,
      fecha_Inicio: micro.fecha_Inicio,
      fecha_Fin: micro.fecha_Fin,
      descripcion: micro.descripcion,
      objetivos: micro.objetivos,
      intensidad: micro.intensidad,
    });

    const sesionesConNombres = micro.sesiones.map((s) => {
      const sesionInfo = sesionesDisponibles.find(
        (disp) => disp.ID_Sesion === s.ID_Sesion
      );
      return {
        ...s,
        nombre_Sesion: sesionInfo ? sesionInfo.nombre_Sesion : "Sin nombre",
      };
    });

    setSesionesSeleccionadas(sesionesConNombres);
    setEditando(micro.ID_Microciclo);
  };

  const resetFormulario = () => {
    setFormulario({
      nombre_Microciclo: "",
      fecha_Inicio: "",
      fecha_Fin: "",
      descripcion: "",
      objetivos: "",
      intensidad: "",
    });
    setSesionesSeleccionadas([]);
    setEditando(null);
  };

  const obtenerAnchoIntensidad = (nivel) => {
    switch (nivel) {
      case "Baja":
        return "33%";
      case "Media":
        return "66%";
      case "Alta":
        return "100%";
      default:
        return "0%";
    }
  };

  const obtenerColorIntensidad = (nivel) => {
    switch (nivel) {
      case "Baja":
        return "#4CAF50";
      case "Media":
        return "#FFC107";
      case "Alta":
        return "#F44336";
      default:
        return "#ccc";
    }
  };

  return (
    <div className="micro_contenedor_principal">
      <header className="micro_encabezado">
        <h2 className="micro_titulo">
          {editando ? "Editar Microciclo" : "Crear Microciclo"}
        </h2>
      </header>

      {mensaje && <p>{mensaje}</p>}

      {/* 📑 FORMULARIO */}
      <form className="micro_formulario" onSubmit={enviarMicrociclo}>
        <h3 className="micro_subtitulo">Datos del Microciclo</h3>

        <div className="micro_fila">
          <input
            type="text"
            name="nombre_Microciclo"
            value={formulario.nombre_Microciclo}
            onChange={manejarCambioMicrociclo}
            placeholder="Nombre del Microciclo"
            required
          />
          <input
            type="date"
            name="fecha_Inicio"
            value={formulario.fecha_Inicio}
            onChange={manejarCambioMicrociclo}
            required
          />
          <input
            type="date"
            name="fecha_Fin"
            value={formulario.fecha_Fin}
            onChange={manejarCambioMicrociclo}
            required
          />
        </div>

        <div className="micro_descripcion">
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambioMicrociclo}
            placeholder="Descripción"
          />
          <textarea
            name="objetivos"
            value={formulario.objetivos}
            onChange={manejarCambioMicrociclo}
            placeholder="Objetivos"
          />
        </div>

        <select
          name="intensidad"
          value={formulario.intensidad}
          onChange={manejarCambioMicrociclo}
          required
        >
          <option value="">Seleccione intensidad</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <h3 className="micro_subtitulo">Asignar Sesiones</h3>
        <div className="micro_formulario_asignar">
          <select
            className="selectSesion"
            name="ID_Sesion"
            value={nuevoSesion.ID_Sesion}
            onChange={manejarCambioSesion}
          >
            <option value="">Seleccione una sesión</option>
            {sesionesDisponibles.map((s) => (
              <option key={s.ID_Sesion} value={s.ID_Sesion}>
                {s.nombre_Sesion}
              </option>
            ))}
          </select>

          <select
            name="dia_Semana"
            value={nuevoSesion.dia_Semana}
            onChange={manejarCambioSesion}
          >
            <option value="">Día</option>
            {Object.entries(diasSemana).map(([num, nombre]) => (
              <option key={num} value={num}>
                {nombre}
              </option>
            ))}
          </select>

          <button type="button" onClick={agregarSesion}>
            <PlusCircle size={18} /> Agregar Sesión
          </button>
        </div>

        {sesionesSeleccionadas.length > 0 && (
          <ul>
            {sesionesSeleccionadas.map((s, i) => (
              <li key={i}>
                {s.nombre_Sesion} | {diasSemana[s.dia_Semana]}
              </li>
            ))}
          </ul>
        )}

        <div className="micro_botones_formulario">
          <button type="submit">
            {editando ? "Actualizar" : "Crear Microciclo"}
          </button>
          {editando && (
            <button type="button" onClick={resetFormulario}>
              <XCircle size={18} /> Cancelar
            </button>
          )}
        </div>
      </form>

      {/* 📋 LISTA DE MICROCICLOS */}
      <section className="micro_listado">
        <h3 className="micro_subtitulo">Microciclos Registrados</h3>
        {microciclos.length === 0 ? (
          <p>No hay microciclos registrados</p>
        ) : (
          microciclos.map((m) => (
            <div key={m.ID_Microciclo} className="micro_card">
              <h4>{m.nombre_Microciclo}</h4>
              <p><FileText size={16} /> {m.descripcion}</p>
              <p><Calendar size={16} /> {m.fecha_Inicio} a {m.fecha_Fin}</p>
              <p><Target size={16} /> {m.objetivos}</p>

              {/* 🔥 Barra de intensidad */}
              <div className="micro_intensidad">
                <div className="micro_intensidad_label">
                  <Flame size={16} /> Intensidad: {m.intensidad}
                </div>
                <div className="micro_barra">
                  <div
                    className="micro_barra_relleno"
                    style={{
                      width: obtenerAnchoIntensidad(m.intensidad),
                      backgroundColor: obtenerColorIntensidad(m.intensidad),
                    }}
                  ></div>
                </div>
              </div>

              <h5>Sesiones asignadas:</h5>
              {m.sesion?.length > 0 ? (
                <ul className="lista_sesiones">
                  {m.sesion.map((s) => (
                    <li key={s.ID_Sesion} className="sesion_item">
                      <strong>{s.nombre_Sesion}</strong>
                      <p><Clock size={14} /> {s.hora_Inicio} - {s.hora_Fin}</p>
                      <p><Target size={14} /> Objetivo: {s.objetivo}</p>
                      <p><FileText size={14} /> Observaciones: {s.observaciones}</p>
                      <p><Calendar size={14} /> Día: {diasSemana[s.Rel_Microciclo_Sesion?.dia_Semana]}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay sesiones asignadas</p>
              )}

              <div className="micro_botones">
                <button onClick={() => editarMicrociclo(m)}>
                  <Edit size={16} /> Editar
                </button>
                <button onClick={() => eliminarMicrociclo(m.ID_Microciclo)}>
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default CrearMicrociclo;
