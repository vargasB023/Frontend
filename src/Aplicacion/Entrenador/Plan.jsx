import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Zap, Trash2, Plus } from "lucide-react";
import "../../Components/Public/css/plan.css";

const FormularioPlan = ({ onPlanCreado }) => {
  const entrenadorGuardado = localStorage.getItem("entrenador");
  const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

  const [equipos, setEquipos] = useState([]);
  const [microciclos, setMicrociclos] = useState([]);
  const [mensaje, setMensaje] = useState("");
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
        const { data } = await axios.get("https://backend-5gwv.onrender.com/api/microciclo");
        setMicrociclos(data || []);
      } catch {
        setMensaje("No se pudieron cargar los microciclos.");
      }
    };
    cargarMicrociclos();
  }, []);

  // === Manejadores ===
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCambioMicrociclo = (e) => {
    const { value } = e.target;
    setNuevoMicrociclo({ ID_Microciclo: value });
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
    setMicrociclosSeleccionados([...microciclosSeleccionados, microInfo]);
    setNuevoMicrociclo({ ID_Microciclo: "" });
    setMensaje("");
  };

  const eliminarMicrociclo = (id) => {
    setMicrociclosSeleccionados((prev) =>
      prev.filter((m) => m.ID_Microciclo !== id)
    );
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      if (microciclosSeleccionados.length === 0) {
        setMensaje("Debes agregar al menos un microciclo.");
        return;
      }

      const dataAEnviar = {
        ...formulario,
        ID_Entrenador: entrenador?.ID_Entrenador,
        microciclos: microciclosSeleccionados.map((m) => ({
          ID_Microciclo: m.ID_Microciclo,
        })),
      };

      await axios.post("https://backend-5gwv.onrender.com/api/plan_de_entrenamiento", dataAEnviar);
      setMensaje("✅ Plan creado correctamente.");
      onPlanCreado?.(); // Refrescar lista

      // Limpiar formulario
      setFormulario({
        ID_Equipo: "",
        nombre_Plan: "",
        objetivo: "",
        duracion: "",
        fecha_Inicio: "",
        fecha_fin: "",
        estado: "",
      });
      setMicrociclosSeleccionados([]);
    } catch (error) {
      setMensaje("Error al crear el plan: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <section className="pln_contenedor">
      <h2 className="pln_titulo">Crear Plan de Entrenamiento</h2>

      <form className="pln_formulario" onSubmit={manejarEnvio}>
        <div className="pln_grid3">
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
              {equipos.map((eq) => (
                <option key={eq.ID_Equipo} value={eq.ID_Equipo}>
                  {eq.nombre_Equipo}
                </option>
              ))}
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

          <div className="pln_item">
            <label>Duración (semanas)*</label>
            <input
              type="number"
              name="duracion"
              value={formulario.duracion}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

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

        <div className="pln_grid2">
          <div className="pln_item">
            <label>Fecha Inicio*</label>
            <input
              type="date"
              name="fecha_Inicio"
              value={formulario.fecha_Inicio}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="pln_item">
            <label>Fecha Fin*</label>
            <input
              type="date"
              name="fecha_fin"
              value={formulario.fecha_fin}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        {/* Microciclos */}
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
              {microciclos.map((m) => (
                <option key={m.ID_Microciclo} value={m.ID_Microciclo}>
                  {m.nombre_Microciclo}
                </option>
              ))}
            </select>
            <button type="button" className="pln_btnAgregar" onClick={agregarMicrociclo}>
              <Plus size={18} /> Agregar
            </button>
          </div>
        </div>

        {microciclosSeleccionados.length > 0 && (
          <ul className="pln_listaMicrociclos">
            {microciclosSeleccionados.map((m) => (
              <li key={m.ID_Microciclo} className="pln_micro_item">
                <div className="pln_micro_info">
                  <strong>{m.nombre_Microciclo}</strong>
                  <div className="pln_micro_detalle">
                    <Calendar size={14} /> {m.fecha_Inicio} → {m.fecha_Fin}
                    <Zap size={14} /> {m.intensidad}
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

        <div className="pln_botones">
          <button type="submit" className="pln_btnGuardar">
            Guardar Plan
          </button>
        </div>

        {mensaje && <p className="pln_mensaje">{mensaje}</p>}
      </form>
    </section>
  );
};

export default FormularioPlan;
