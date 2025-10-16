import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PencilLine,
  Trash2,
  Save,
  X,
  PlusCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "../../Components/Public/css/sesion.css";

const fasesValidas = ["CALENTAMIENTO", "PARTE_PRINCIPAL", "RECUPERACION"];

const CrearSesion = () => {
  const [sesiones, setSesiones] = useState([]);
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
  const [entrenador, setEntrenador] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [expandedSessions, setExpandedSessions] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const formularioInicial = {
    ID_Sesion: null,
    ID_Entrenador: "",
    nombre_Sesion: "",
    hora_Inicio: "00:00",
    hora_Fin: "00:00",
    objetivo: "",
    observaciones: "",
    ejercicios: [],
  };

  const [form, setForm] = useState(formularioInicial);

  const ejercicioInicial = {
    ID_Ejercicio: "",
    fase: "",
    orden: "",
    series: "",
    repeticiones: "",
    duracion_min: "",
    observaciones: "",
  };
  const [ejercicioTemp, setEjercicioTemp] = useState(ejercicioInicial);

  // 🔹 Obtener entrenador del localStorage
  useEffect(() => {
    const obtenerEntrenador = () => {
      try {
        const entrenadorGuardado = localStorage.getItem("entrenador");
        if (entrenadorGuardado) {
          const entrenadorParseado = JSON.parse(entrenadorGuardado);
          setEntrenador(entrenadorParseado);
          setForm((f) => ({
            ...f,
            ID_Entrenador: entrenadorParseado.ID_Entrenador,
          }));
          return entrenadorParseado;
        }
        return null;
      } catch (error) {
        console.error("Error al obtener entrenador del localStorage:", error);
        return null;
      }
    };

    obtenerEntrenador();

    // cargar sesiones y ejercicios
    (async () => {
      await Promise.all([fetchSesiones(), fetchEjerciciosDisponibles()]);
      setCargando(false);
    })();
  }, []);

  // ✅ Traer sesiones desde API
  const fetchSesiones = async () => {
    try {
      const { data } = await axios.get("https://backend-5gwv.onrender.com/api/sesion");
      setSesiones(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      console.error("Error al traer sesiones:", e);
      setSesiones([]);
    }
  };

  // ✅ Traer ejercicios disponibles
  const fetchEjerciciosDisponibles = async () => {
    try {
      const { data } = await axios.get("https://backend-5gwv.onrender.com/api/ejercicio");
      const ejercicios = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.ejercicios)
        ? data.ejercicios
        : [];
      setEjerciciosDisponibles(ejercicios);
    } catch (e) {
      console.error("Error al traer ejercicios:", e);
      setEjerciciosDisponibles([]);
    }
  };

  // 🔹 Normaliza hora
  const normalizarHora = (v) =>
    !v ? "" : /^\d{2}:\d{2}$/.test(v) ? `${v}:00` : v;

  // 🔹 Prepara el payload
  const prepararPayload = () => ({
    ID_Entrenador: Number(form.ID_Entrenador),
    nombre_Sesion: form.nombre_Sesion,
    hora_Inicio: normalizarHora(form.hora_Inicio),
    hora_Fin: normalizarHora(form.hora_Fin),
    objetivo: form.objetivo,
    observaciones: form.observaciones,
    ejercicios: form.ejercicios.map((e) => ({
      ID_Ejercicio: Number(e.ID_Ejercicio),
      fase: e.fase,
      orden: e.orden ? Number(e.orden) : null,
      series: e.series ? Number(e.series) : null,
      repeticiones: e.repeticiones ? Number(e.repeticiones) : null,
      duracion_min: e.duracion_min ? Number(e.duracion_min) : 0,
      observaciones: e.observaciones ?? null,
    })),
  });

  // ✅ Crear o actualizar sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ID_Entrenador || !form.nombre_Sesion.trim())
      return alert("Entrenador y nombre de sesión son requeridos");

    try {
      const payload = prepararPayload();
      if (isEditing)
        await axios.put(
          `https://backend-5gwv.onrender.com/api/sesion/${form.ID_Sesion}`,
          payload
        );
      else await axios.post("https://backend-5gwv.onrender.com/api/sesion", payload);

      setMensaje(
        isEditing
          ? "Sesión actualizada correctamente"
          : "Sesión creada correctamente"
      );
      await fetchSesiones();
      resetForm();
    } catch (err) {
      console.error("Error al guardar sesión:", err);
      setMensaje("❌ Error al guardar sesión");
    }
  };

  // 🖊 Editar sesión
  const handleEditar = (s) => {
    const mapped = {
      ID_Sesion: s.ID_Sesion,
      ID_Entrenador: s.ID_Entrenador || "",
      nombre_Sesion: s.nombre_Sesion || "",
      hora_Inicio: s.hora_Inicio?.slice(0, 5) || "00:00",
      hora_Fin: s.hora_Fin?.slice(0, 5) || "00:00",
      objetivo: s.objetivo || "",
      observaciones: s.observaciones || "",
      ejercicios: Array.isArray(s.ejercicio)
        ? s.ejercicio.map((ej) => ({
            ID_Ejercicio: ej.ID_Ejercicio,
            fase: ej.rel_Ejercicio_Sesion?.fase || "",
            orden: ej.rel_Ejercicio_Sesion?.orden ?? "",
            series: ej.rel_Ejercicio_Sesion?.series ?? "",
            repeticiones: ej.rel_Ejercicio_Sesion?.repeticiones ?? "",
            duracion_min: ej.rel_Ejercicio_Sesion?.duracion_min ?? "",
            observaciones: ej.rel_Ejercicio_Sesion?.observaciones ?? "",
            nombre_Ejer: ej.nombre_Ejer,
          }))
        : [],
    };
    setForm(mapped);
    setIsEditing(true);
    setExpandedSessions((p) => ({ ...p, [s.ID_Sesion]: true }));
  };

  // 🗑 Eliminar sesión
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta sesión?")) return;
    try {
      await axios.delete(`https://backend-5gwv.onrender.com/api/sesion/${id}`);
      setMensaje("Sesión eliminada correctamente");
      fetchSesiones();
    } catch {
      setMensaje("Error al eliminar sesión");
    }
  };

  // 🔹 Handlers
  const manejarCambioForm = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const manejarCambioEjercicioTemp = (e) =>
    setEjercicioTemp((ex) => ({ ...ex, [e.target.name]: e.target.value }));

  const agregarEjercicioAForm = () => {
    if (
      !ejercicioTemp.ID_Ejercicio ||
      !fasesValidas.includes(ejercicioTemp.fase)
    )
      return alert("Debe seleccionar un ejercicio y una fase válida");

    setForm((f) => ({
      ...f,
      ejercicios: [
        ...f.ejercicios,
        { ...ejercicioTemp, ID_Ejercicio: Number(ejercicioTemp.ID_Ejercicio) },
      ],
    }));
    setEjercicioTemp(ejercicioInicial);
  };

  const actualizarEjercicioEnForm = (i, c, v) =>
    setForm((f) => ({
      ...f,
      ejercicios: f.ejercicios.map((e, idx) =>
        idx === i ? { ...e, [c]: v } : e
      ),
    }));

  const quitarEjercicioDeForm = (i) =>
    setForm((f) => ({
      ...f,
      ejercicios: f.ejercicios.filter((_, idx) => idx !== i),
    }));

  const resetForm = () => {
    setForm({
      ...formularioInicial,
      ID_Entrenador: entrenador?.ID_Entrenador || "",
    });
    setIsEditing(false);
    setEjercicioTemp(ejercicioInicial);
  };

  const toggleExpand = (id) =>
    setExpandedSessions((p) => ({ ...p, [id]: !p[id] }));

  if (cargando) return <div className="ses_contenedor">Cargando...</div>;

  return (
    <div className="ses_contenedor">
      <h2 className="ses_tituloPrincipal">Gestión de Sesiones</h2>
      {mensaje && <div className="ses_mensaje">{mensaje}</div>}

      {/* Formulario */}
      <form className="ses_formulario" onSubmit={handleSubmit}>
        <div className="ses_form_header">
          <h3 className="ses_subtitulo">
            {isEditing ? "Editar Sesión" : "Crear Sesión"}
          </h3>
          {isEditing && (
            <button
              type="button"
              className="ses_botonSecundario"
              onClick={resetForm}
            >
              <X size={16} /> Cancelar
            </button>
          )}
        </div>

        <div className="ses_campos">
          {/* Entrenador (NO editable) */}
          <input
            type="text"
            value={
              entrenador ? `${entrenador.nombre_Completo}` : "No disponible"
            }
            disabled
            className="ses_campo"
          />

          <input
            type="text"
            name="nombre_Sesion"
            value={form.nombre_Sesion}
            onChange={manejarCambioForm}
            placeholder="Nombre Sesión"
            className="ses_campo"
            required
          />
          <input
            type="time"
            name="hora_Inicio"
            value={form.hora_Inicio}
            onChange={manejarCambioForm}
            className="ses_campo"
          />
          <input
            type="time"
            name="hora_Fin"
            value={form.hora_Fin}
            onChange={manejarCambioForm}
            className="ses_campo"
          />
          <textarea
            name="objetivo"
            value={form.objetivo}
            onChange={manejarCambioForm}
            placeholder="Objetivo"
            className="ses_campo"
          />
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={manejarCambioForm}
            placeholder="Observaciones"
            className="ses_campo"
          />
        </div>

        {/* Ejercicios */}
        <h3 className="ses_subtitulo">Ejercicios asociados</h3>
        <div className="ses_campos">
          <select
            name="ID_Ejercicio"
            value={ejercicioTemp.ID_Ejercicio}
            onChange={manejarCambioEjercicioTemp}
            className="ses_select"
          >
            <option value="">Seleccione ejercicio</option>
            {ejerciciosDisponibles.map((e) => (
              <option key={e.ID_Ejercicio} value={e.ID_Ejercicio}>
                {e.nombre_Ejer}
              </option>
            ))}
          </select>
          <select
            name="fase"
            value={ejercicioTemp.fase}
            onChange={manejarCambioEjercicioTemp}
            className="ses_select"
          >
            <option value="">Seleccione fase</option>
            {fasesValidas.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="orden"
            value={ejercicioTemp.orden}
            onChange={manejarCambioEjercicioTemp}
            placeholder="Orden"
            className="ses_campo"
          />
          <input
            type="number"
            name="series"
            value={ejercicioTemp.series}
            onChange={manejarCambioEjercicioTemp}
            placeholder="Series"
            className="ses_campo"
          />
          <input
            type="number"
            name="repeticiones"
            value={ejercicioTemp.repeticiones}
            onChange={manejarCambioEjercicioTemp}
            placeholder="Repeticiones"
            className="ses_campo"
          />
          <input
            type="number"
            name="duracion_min"
            value={ejercicioTemp.duracion_min}
            onChange={manejarCambioEjercicioTemp}
            placeholder="Duración"
            className="ses_campo"
          />
          <input
            type="text"
            name="observaciones"
            value={ejercicioTemp.observaciones}
            onChange={manejarCambioEjercicioTemp}
            placeholder="Observaciones"
            className="ses_campo"
          />
          <button
            type="button"
            className="ses_botonAgregar"
            onClick={agregarEjercicioAForm}
          >
            <PlusCircle size={16} /> Agregar ejercicios
          </button>
        </div>

        {/* Tabla de ejercicios agregados */}
        {form.ejercicios.length > 0 && (
          <table className="ses_table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fase</th>
                <th>Orden</th>
                <th>Series</th>
                <th>Reps</th>
                <th>Duración</th>
                <th>Obs</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {form.ejercicios.map((ej, i) => (
                <tr key={i}>
                  <td>
                    {ej.nombre_Ejer ||
                      ejerciciosDisponibles.find(
                        (x) => x.ID_Ejercicio == ej.ID_Ejercicio
                      )?.nombre_Ejer ||
                      "-"}
                  </td>
                  <td>{ej.fase}</td>
                  <td>{ej.orden}</td>
                  <td>{ej.series}</td>
                  <td>{ej.repeticiones}</td>
                  <td>{ej.duracion_min}</td>
                  <td>{ej.observaciones}</td>
                  <td>
                    <button
                      type="button"
                      className="ses_icono btn-eliminar"
                      onClick={() => quitarEjercicioDeForm(i)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="ses_accionesForm">
          <button type="submit" className="ses_botonEnviar">
            <Save size={16} />
            {isEditing ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            className="ses_botonSecundario"
            onClick={resetForm}
          >
            <X size={16} /> Limpiar
          </button>
        </div>
      </form>

      {/* Lista de sesiones */}
      <section className="ses_listado">
        <h3 className="ses_subtitulo">Sesiones Registradas</h3>
        {sesiones.length === 0 ? (
          <p>No hay sesiones registradas</p>
        ) : (
          sesiones.map((s) => (
            <div key={s.ID_Sesion} className="ses_card">
              <div className="ses_card_header">
                <h4>{s.nombre_Sesion}</h4>
                <div className="ses_accionesCard">
                  <button
                    onClick={() => handleEditar(s)}
                    className="ses_icono btn-editar"
                  >
                    <PencilLine size={18} />
                  </button>
                  <button
                    onClick={() => handleEliminar(s.ID_Sesion)}
                    className="ses_icono btn-eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleExpand(s.ID_Sesion)}
                    className="ses_icono btn-expandir"
                  >
                    {expandedSessions[s.ID_Sesion] ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>
              </div>

              {expandedSessions[s.ID_Sesion] && (
                <div className="ses_card_detalle">
                  <p>
                    <strong>Horario:</strong> {s.hora_Inicio} - {s.hora_Fin}
                  </p>
                  <p>
                    <strong>Objetivo:</strong> {s.objetivo}
                  </p>
                  <p>
                    <strong>Observaciones:</strong> {s.observaciones}
                  </p>

                  <h5>Ejercicios:</h5>
                  {s.ejercicio && s.ejercicio.length > 0 ? (
                    <table className="ses_tableEjercicios">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Fase</th>
                          <th>Orden</th>
                          <th>Series</th>
                          <th>Reps</th>
                          <th>Duración</th>
                          <th>Obs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.ejercicio.map((ej, idx) => (
                          <tr key={idx}>
                            <td>{ej.nombre_Ejer}</td>
                            <td>
                              <span
                                className={`fase-badge ${
                                  ej.rel_Ejercicio_Sesion?.fase
                                    ? {
                                        CALENTAMIENTO: "calentamiento",
                                        PARTE_PRINCIPAL: "principal",
                                        RECUPERACION: "recuperacion",
                                      }[
                                        ej.rel_Ejercicio_Sesion.fase.toUpperCase()
                                      ] || ""
                                    : ""
                                }`}
                              >
                                {ej.rel_Ejercicio_Sesion?.fase || "-"}
                              </span>
                            </td>
                            <td>{ej.rel_Ejercicio_Sesion?.orden || "-"}</td>
                            <td>{ej.rel_Ejercicio_Sesion?.series || "-"}</td>
                            <td>
                              {ej.rel_Ejercicio_Sesion?.repeticiones || "-"}
                            </td>
                            <td>
                              {ej.rel_Ejercicio_Sesion?.duracion_min || "-"} min
                            </td>
                            <td>
                              {ej.rel_Ejercicio_Sesion?.observaciones || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="ses_vacio">Sin ejercicios asignados</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default CrearSesion;
