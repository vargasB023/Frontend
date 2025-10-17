import React, { useEffect, useState } from "react";
import axios from "axios";
import { Save, X, PlusCircle, Trash2 } from "lucide-react";
import "../../Components/Public/css/sesion.css";

const fasesValidas = ["CALENTAMIENTO", "PARTE_PRINCIPAL", "RECUPERACION"];

const formularioSesiones = ({ sesionInicial, onGuardar, onCancelar }) => {
  // 🔹 Obtener entrenador desde localStorage
  const entrenadorGuardado = localStorage.getItem("entrenador");
  const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

  const [form, setForm] = useState({
    ID_Sesion: null,
    ID_Entrenador: entrenador?.ID_Entrenador || "",
    nombre_Sesion: "",
    hora_Inicio: "00:00:00",
    hora_Fin: "00:00:00",
    objetivo: "",
    observaciones: "",
    ejercicios: [],
  });

  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
  const [ejercicioTemp, setEjercicioTemp] = useState({
    ID_Ejercicio: "",
    fase: "",
    orden: "",
    series: "",
    repeticiones: "",
    duracion_min: "",
    observaciones: "",
  });

  const isEditing = Boolean(sesionInicial);

  useEffect(() => {
    if (sesionInicial) {
      const mapped = {
        ID_Sesion: sesionInicial.ID_Sesion,
        ID_Entrenador: sesionInicial.ID_Entrenador,
        nombre_Sesion: sesionInicial.nombre_Sesion || "",
        hora_Inicio: sesionInicial.hora_Inicio?.slice(0, 5) || "00:00",
        hora_Fin: sesionInicial.hora_Fin?.slice(0, 5) || "00:00",
        objetivo: sesionInicial.objetivo || "",
        observaciones: sesionInicial.observaciones || "",
        ejercicios: sesionInicial.ejercicio
          ? sesionInicial.ejercicio.map((ej) => ({
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
    }

    fetchEjerciciosDisponibles();
  }, [sesionInicial]);

  const fetchEjerciciosDisponibles = async () => {
    try {
      const { data } = await axios.get("https://backend-5gwv.onrender.com/api/ejercicio");
      setEjerciciosDisponibles(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      console.error("Error al traer ejercicios:", e);
    }
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleChangeEjercicio = (e) =>
    setEjercicioTemp((ex) => ({ ...ex, [e.target.name]: e.target.value }));

  const agregarEjercicio = () => {
    if (!ejercicioTemp.ID_Ejercicio || !ejercicioTemp.fase)
      return alert("Debe seleccionar un ejercicio y una fase.");

    setForm((f) => ({
      ...f,
      ejercicios: [...f.ejercicios, { ...ejercicioTemp }],
    }));

    // Reset temporal
    setEjercicioTemp({
      ID_Ejercicio: "",
      fase: "",
      orden: "",
      series: "",
      repeticiones: "",
      duracion_min: "",
      observaciones: "",
    });
  };

  const quitarEjercicio = (i) =>
    setForm((f) => ({
      ...f,
      ejercicios: f.ejercicios.filter((_, idx) => idx !== i),
    }));

  const prepararPayload = () => ({
    ID_Entrenador: Number(form.ID_Entrenador),
    nombre_Sesion: form.nombre_Sesion.trim(),
    hora_Inicio: form.hora_Inicio,
    hora_Fin: form.hora_Fin,
    objetivo: form.objetivo.trim(),
    observaciones: form.observaciones.trim(),
    ejercicios: form.ejercicios.map((e, i) => ({
      ID_Ejercicio: Number(e.ID_Ejercicio),
      fase: e.fase,
      orden: Number(e.orden) || i + 1,
      series: Number(e.series) || 0,
      repeticiones: Number(e.repeticiones) || 0,
      duracion_min: Number(e.duracion_min) || 0,
      observaciones: e.observaciones?.trim() || "",
    })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = prepararPayload();
      console.log("Payload enviado:", payload);

      if (!payload.ID_Entrenador) {
        return alert("No se encontró el ID del entrenador. Inicie sesión nuevamente.");
      }

      if (isEditing) {
        await axios.put(
          `https://backend-5gwv.onrender.com/api/sesion/${form.ID_Sesion}`,
          payload
        );
      } else {
        await axios.post("https://backend-5gwv.onrender.com/api/sesion", payload);
      }

      alert("Sesión guardada correctamente");
      onGuardar?.();
    } catch (err) {
      console.error("Error al guardar sesión:", err);
      alert(err.response?.data?.error || "Error al guardar sesión");
    }
  };

  return (
    <form className="ses_formulario" onSubmit={handleSubmit}>
      <div className="ses_form_header">
        <h3>{isEditing ? "Editar Sesión" : "Crear Sesión"}</h3>
        <button type="button" className="ses_botonSecundario" onClick={onCancelar}>
          <X size={16} /> Cancelar
        </button>
      </div>

      <input
        type="text"
        name="nombre_Sesion"
        placeholder="Nombre de la sesión"
        value={form.nombre_Sesion}
        onChange={handleChange}
        required
        className="ses_campo"
      />
      <input
        type="time"
        name="hora_Inicio"
        value={form.hora_Inicio}
        onChange={handleChange}
        className="ses_campo"
      />
      <input
        type="time"
        name="hora_Fin"
        value={form.hora_Fin}
        onChange={handleChange}
        className="ses_campo"
      />
      <textarea
        name="objetivo"
        placeholder="Objetivo"
        value={form.objetivo}
        onChange={handleChange}
        className="ses_campo"
      />
      <textarea
        name="observaciones"
        placeholder="Observaciones"
        value={form.observaciones}
        onChange={handleChange}
        className="ses_campo"
      />

      {/* Ejercicios */}
      <h4>Ejercicios Asociados</h4>
      <div className="ses_campos">
        <select
          name="ID_Ejercicio"
          value={ejercicioTemp.ID_Ejercicio}
          onChange={handleChangeEjercicio}
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
          onChange={handleChangeEjercicio}
          className="ses_select"
        >
          <option value="">Fase</option>
          {fasesValidas.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>

        <input
          type="number"
          name="series"
          placeholder="Series"
          value={ejercicioTemp.series}
          onChange={handleChangeEjercicio}
          className="ses_campo"
        />
        <input
          type="number"
          name="repeticiones"
          placeholder="Reps"
          value={ejercicioTemp.repeticiones}
          onChange={handleChangeEjercicio}
          className="ses_campo"
        />
        <input
          type="number"
          name="duracion_min"
          placeholder="Duración (min)"
          value={ejercicioTemp.duracion_min}
          onChange={handleChangeEjercicio}
          className="ses_campo"
        />
        <input
          type="text"
          name="observaciones"
          placeholder="Observaciones del ejercicio"
          value={ejercicioTemp.observaciones}
          onChange={handleChangeEjercicio}
          className="ses_campo"
        />

        <button
          type="button"
          className="ses_botonAgregar"
          onClick={agregarEjercicio}
        >
          <PlusCircle size={16} /> Agregar
        </button>
      </div>

      {form.ejercicios.length > 0 && (
        <table className="ses_table">
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th>Fase</th>
              <th>Series</th>
              <th>Reps</th>
              <th>Duración (min)</th>
              <th>Observaciones</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {form.ejercicios.map((ej, i) => (
              <tr key={i}>
                <td>{ej.nombre_Ejer || ej.ID_Ejercicio}</td>
                <td>{ej.fase}</td>
                <td>{ej.series}</td>
                <td>{ej.repeticiones}</td>
                <td>{ej.duracion_min}</td>
                <td>{ej.observaciones}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => quitarEjercicio(i)}
                    className="ses_icono btn-eliminar"
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
          <Save size={16} /> {isEditing ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default formularioSesiones;
