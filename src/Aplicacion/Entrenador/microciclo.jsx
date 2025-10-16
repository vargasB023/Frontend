import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, XCircle } from "lucide-react";
import "../../Components/Public/css/microciclo.css";

const FormularioMicrociclo = ({ onClose, onSaved, microcicloEditar }) => {
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

  const diasSemana = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
  };

  // 🔹 Cargar sesiones disponibles
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

  // 🔹 Cargar datos si estamos editando
  useEffect(() => {
    if (microcicloEditar) {
      setFormulario({
        nombre_Microciclo: microcicloEditar.nombre_Microciclo,
        fecha_Inicio: microcicloEditar.fecha_Inicio,
        fecha_Fin: microcicloEditar.fecha_Fin,
        descripcion: microcicloEditar.descripcion,
        objetivos: microcicloEditar.objetivos,
        intensidad: microcicloEditar.intensidad,
      });
      setSesionesSeleccionadas(microcicloEditar.sesion || []);
    }
  }, [microcicloEditar]);

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

      if (microcicloEditar) {
        await axios.put(
          `https://backend-5gwv.onrender.com/api/microciclo/${microcicloEditar.ID_Microciclo}`,
          payload
        );
      } else {
        await axios.post("https://backend-5gwv.onrender.com/api/microciclo", payload);
      }

      onSaved?.();
      onClose?.();
    } catch (error) {
      console.error("❌ Error al guardar microciclo:", error);
      alert("Error al guardar el microciclo");
    }
  };

  return (
    <form className="micro_formulario" onSubmit={enviarMicrociclo}>
      <h3 className="micro_subtitulo">
        {microcicloEditar ? "Editar Microciclo" : "Crear Microciclo"}
      </h3>

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
          {microcicloEditar ? "Actualizar" : "Crear Microciclo"}
        </button>
        <button type="button" onClick={onClose}>
          <XCircle size={18} /> Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioMicrociclo;
