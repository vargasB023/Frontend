import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Components/Public/css/evaluacionDeportiva.css";
import Evaluacion_Fisica from "./evaluacionFisica";
import Evaluacion_Tecnica from "./evaluacionTecnica";

const Evaluacion_Deportiva = () => {
  const [entrenador, setEntrenador] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [deportistas, setDeportistas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Obtener entrenador del localStorage de forma segura
  useEffect(() => {
    const obtenerEntrenador = () => {
      try {
        const entrenadorGuardado = localStorage.getItem("entrenador");
        if (entrenadorGuardado) {
          const entrenadorParseado = JSON.parse(entrenadorGuardado);
          setEntrenador(entrenadorParseado);
          return entrenadorParseado;
        }
        return null;
      } catch (error) {
        console.error("Error al obtener entrenador del localStorage:", error);
        return null;
      }
    };

    const entrenadorActual = obtenerEntrenador();
    if (entrenadorActual && entrenadorActual.ID_Entrenador) {
      obtenerEquipos(entrenadorActual.ID_Entrenador);
    } else {
      setCargando(false);
      console.error("No se encontró entrenador válido en el localStorage");
    }
  }, []);

  const obtenerEquipos = async (idEntrenador) => {
    try {
      const res = await axios.get(`https://backend-5gwv.onrender.com/api/equipo/entrenador/${idEntrenador}`);
      setEquipos(res.data);
      setCargando(false);
    } catch (error) {
      console.error("Error obteniendo Equipos", error);
      setCargando(false);
    }
  };

  const obtenerDeportistas = async (ID_Equipo = 0) => {
  const equipoSeleccionado = equipos.find(equipo => equipo.ID_Equipo == ID_Equipo);

  if (equipoSeleccionado && equipoSeleccionado.deportista) {
    // Filtrar solo los deportistas activos dentro del equipo
    const deportistasActivos = equipoSeleccionado.deportista.filter(
      (dep) => dep.Rel_Deportista_Equipo?.estado === "ACTIVO"
    );
    setDeportistas(deportistasActivos);
  } else {
    setDeportistas([]);
  }
};


  const [formulario, setFormulario] = useState({
    ID_Equipo: "",
    ID_Deportista: "",
    ID_Entrenador: "",
    fecha: "",
    resultados: "",
    observaciones: "",
    tipo_Evaluacion: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [idEvaluacionCreada, setIdEvaluacionCreada] = useState(null);
  const [tipoEvaluacionSeleccionado, setTipoEvaluacionSeleccionado] = useState("");

  const manejarCambio = (e) => {
    if (e.target.name === "ID_Equipo") {
      obtenerDeportistas(e.target.value);
    }
    
    if (e.target.name === "tipo_Evaluacion") {
      setTipoEvaluacionSeleccionado(e.target.value);
    }

    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
      ID_Entrenador: entrenador?.ID_Entrenador || "",
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const { ID_Deportista, ID_Equipo, fecha, resultados, tipo_Evaluacion, ID_Entrenador } = formulario;

    if (!ID_Deportista || !ID_Equipo || !fecha || !resultados || !tipo_Evaluacion || !ID_Entrenador) {
      setMensaje("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      console.log("📤 Enviando datos al backend:", formulario);
      
      const res = await axios.post("https://backend-5gwv.onrender.com/api/evaluacion", formulario);
      console.log("📥 Respuesta completa del servidor:", res);
      console.log("📊 Datos de la respuesta:", res.data);
      
      // Buscar el ID en la respuesta
      let evaluacionId = null;
      
      // Caso 1: ID directamente en data (respuesta corregida del backend)
      if (res.data.ID_Evaluacion_De) {
        evaluacionId = res.data.ID_Evaluacion_De;
      } 
      // Caso 2: ID dentro del objeto evaluacion_Deportiva
      else if (res.data.evaluacion_Deportiva && res.data.evaluacion_Deportiva.ID_Evaluacion_De) {
        evaluacionId = res.data.evaluacion_Deportiva.ID_Evaluacion_De;
      }
      // Caso 3: Si la respuesta es directamente el objeto de evaluación
      else if (res.data.ID_Evaluacion_De) {
        evaluacionId = res.data.ID_Evaluacion_De;
      }
      
      console.log("🔍 ID de evaluación encontrado:", evaluacionId);

      if (evaluacionId) {
        setMensaje("✅ Evaluación registrada exitosamente. Ahora complete la evaluación " + 
                  (tipo_Evaluacion === "FISICA" ? "Física" : "Técnica"));
        
        setIdEvaluacionCreada(evaluacionId);
        setTipoEvaluacionSeleccionado(tipo_Evaluacion);
        
        // Limpiar el formulario
        setFormulario({
          ID_Equipo: "",
          ID_Deportista: "",
          ID_Entrenador: entrenador?.ID_Entrenador || "",
          fecha: "",
          resultados: "",
          observaciones: "",
          tipo_Evaluacion: "",
        });
        setDeportistas([]);
      } else {
        // Si no encontramos el ID, mostrar error específico
        console.error("❌ No se pudo obtener el ID de la evaluación");
        console.log("📋 Respuesta completa:", res.data);
        setMensaje("❌ Error: La evaluación se creó pero no se pudo obtener el ID. Contacte al administrador.");
      }
    } catch (error) {
      console.error("❌ Error completo:", error);
      setMensaje("❌ Error al registrar la evaluación: " + (error.response?.data?.message || error.message));
    }
  };

  const resetearProceso = () => {
    setIdEvaluacionCreada(null);
    setTipoEvaluacionSeleccionado("");
    setFormulario({
      ID_Equipo: "",
      ID_Deportista: "",
      ID_Entrenador: entrenador?.ID_Entrenador || "",
      fecha: "",
      resultados: "",
      observaciones: "",
      tipo_Evaluacion: "",
    });
    setMensaje("");
  };

  if (cargando) {
    return <div className="evaDe_contenedor">Cargando...</div>;
  }

  if (!entrenador) {
    return (
      <div className="evaDe_contenedor">
        <h2>Error: No se encontró información del entrenador</h2>
        <p>Por favor, inicie sesión nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="evaDe_contenedor">
      <h2 className="evaDe_titulo">Registro de Evaluación Deportiva</h2>

      {/* Mostrar formulario de evaluación deportiva solo si no hay evaluación creada */}
      {!idEvaluacionCreada ? (
        <form className="evaDe_formulario" onSubmit={manejarEnvio}>
          <div className="evaDe_grupo">
            <label className="evaDe_etiqueta">Entrenador</label>
            <input
              type="text"
              value={entrenador?.nombre_Completo || "No disponible"}
              disabled
              className="evaDe_input"
            />
          </div>
          
          <div className="evaDe_grupo">
            <label className="evaDe_etiqueta">Equipo*</label>
            <select
              name="ID_Equipo"
              className="evaDe_select"
              value={formulario.ID_Equipo}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccione equipo</option>
              {equipos.map((equipo) => (
                <option key={equipo.ID_Equipo} value={equipo.ID_Equipo}>
                  {equipo.nombre_Equipo}
                </option>
              ))}
            </select>
          </div>

          <div className="evaDe_grupo">
            <label className="evaDe_etiqueta">Deportista*</label>
            <select
              name="ID_Deportista"
              className="evaDe_select"
              value={formulario.ID_Deportista}
              onChange={manejarCambio}
              required
              disabled={!formulario.ID_Equipo}
            >
              <option value="">Seleccione deportista</option>
              {deportistas.map((deportista) => (
                <option key={deportista.ID_Deportista} value={deportista.ID_Deportista}>
                  {deportista.nombre_Completo}
                </option>
              ))}
            </select>
          </div>

          <div className="evaDe_grupo">
            <label className="evaDe_etiqueta">Fecha*</label>
            <input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={manejarCambio}
              className="evaDe_input"
              required
            />
          </div>

          <div className="evaDe_grupo">
            <label className="evaDe_etiqueta">Resultados*</label>
            <input
              type="text"
              name="resultados"
              value={formulario.resultados}
              onChange={manejarCambio}
              className="evaDe_input"
              required
            />
          </div>

          <div className="evaDe_grupo">
            <label className="evaDe_etiqueta">Observaciones</label>
            <textarea
              name="observaciones"
              value={formulario.observaciones}
              onChange={manejarCambio}
              className="evaDe_textarea"
            />
          </div>

          <div className="evaDe_grupo">
            <label className="evaDe_etiqueta">Tipo de Evaluación*</label>
            <select
              name="tipo_Evaluacion"
              value={formulario.tipo_Evaluacion}
              onChange={manejarCambio}
              className="evaDe_select"
              required
            >
              <option value="">Selecciona tipo de evaluación</option>
              <option value="FISICA">Física</option>
              <option value="TECNICA">Técnica</option>
            </select>
          </div>

          <button type="submit" className="evaDe_boton">Registrar Evaluación</button>
          {mensaje && <p className="evaDe_mensaje">{mensaje}</p>}
        </form>
      ) : (
        <div>
          {/* Boton para volver atras */}
          <button 
            onClick={resetearProceso} 
            className="evaDe_boton_secundario"
            style={{marginBottom: '20px'}}
          >
            ← Volver
          </button>
          
          {/*  evaluación creada */}
          <div className="evaDe_info_evaluacion">
            <p><strong>Ahora complete la evaluación específica:</strong></p>
          </div>
        </div>
      )}

      {/* Mostrar el formulario correspondiente después de crear la evaluación */}
      {idEvaluacionCreada && tipoEvaluacionSeleccionado === "FISICA" && (
        <Evaluacion_Fisica
          evaluacionId={idEvaluacionCreada}
        />
      )}

      {idEvaluacionCreada && tipoEvaluacionSeleccionado === "TECNICA" && (
        <Evaluacion_Tecnica
          evaluacionId={idEvaluacionCreada}
        />
      )}
    </div>
  );
};

export default Evaluacion_Deportiva;