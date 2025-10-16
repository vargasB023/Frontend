import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Components/Public/css/lesionesdespues.css";
import { Navigate } from "react-router-dom";
import LesionesView from "./lesiones";

const entrenadorGuardado = localStorage.getItem("entrenador");
const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

const FormularioLesionesDespues = ({setisRegistroMenuOpen}) => {
  const [formData, setFormData] = useState({
    ID_Deportista: "",
    ID_Entrenador: entrenador?.ID_Entrenador ||"",
    fecha_lesion: "",
    tipo_de_lesion_producida: "",
    detalles_lesion: "",
    tipo_evento_producido: "",
    gravedad: "",
    dolor_molestia: "",
    primeros_auxilios: "",
    traslado_centro_medico: "",
    tratamiento_registro_medico: "",
    tiempo_fuera: "",
  });

  const [deportistas, setDeportistas] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [message, setMessage] = useState(null);
  const [lesiones, setLesiones] = useState([]);

  useEffect(() => {
    const fetchDeportistas = async () => {
      try {
        const res = await axios.get("https://backend-5gwv.onrender.com/api/deportista");
        setDeportistas(res.data);
      } catch (error) {
        console.error("Error al obtener deportistas:", error);
      }
    };

    const fetchEntrenadores = async () => {
      try {
        const res = await axios.get(
          "https://backend-5gwv.onrender.com/api/entrenador"
        );
        setEntrenadores(res.data);
      } catch (error) {
        console.error("Error al obtener entrenadores:", error);
      }
    };

    fetchDeportistas();
    fetchEntrenadores();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrores({
      ...errores,
      [e.target.name]: "",
    });
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!formData.ID_Deportista) {
      nuevosErrores.ID_Deportista = "Debe seleccionar un deportista";
    }
    if (!formData.fecha_lesion) {
      nuevosErrores.fecha_lesion = "La fecha de la lesión es obligatoria";
    }
    if (!formData.tipo_de_lesion_producida.trim()) {
      nuevosErrores.tipo_de_lesion_producida =
        "Debe especificar el tipo de lesión";
    }
    if (!formData.tipo_evento_producido) {
      nuevosErrores.tipo_evento_producido =
        "Debe seleccionar el tipo de evento";
    }
    if (!formData.gravedad) {
      nuevosErrores.gravedad = "Debe seleccionar la gravedad";
    }
    if (!formData.dolor_molestia) {
      nuevosErrores.dolor_molestia = "Debe indicar si hay dolor o molestia";
    }
    if (!formData.primeros_auxilios) {
      nuevosErrores.primeros_auxilios =
        "Debe indicar si se aplicaron primeros auxilios";
    }
    if (!formData.traslado_centro_medico) {
      nuevosErrores.traslado_centro_medico = "Debe indicar si hubo traslado";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const payload = {
        ...formData,
        ID_Deportista: Number(formData.ID_Deportista),
        ID_Entrenador: Number(formData.ID_Entrenador),
      };

      const response = await axios.post(
        "https://backend-5gwv.onrender.com/api/h_lesiones_despues",
        payload
      );

      setMessage("¡Lesión registrada correctamente!");
      limpiarFormulario();
      setisRegistroMenuOpen(false)
    } catch (error) {
      console.error(error);
      const mensajeError =
        error.response?.data?.error || "Error al registrar la lesión.";
      setMessage(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      ID_Deportista: "",
      ID_Entrenador: entrenador?.ID_Entrenador || "",
      fecha_lesion: "",
      tipo_de_lesion_producida: "",
      detalles_lesion: "",
      tipo_evento_producido: "",
      gravedad: "",
      dolor_molestia: "",
      primeros_auxilios: "",
      traslado_centro_medico: "",
      tratamiento_registro_medico: "",
      tiempo_fuera: "",
    });
    setErrores({});
  };
  
  return (
    <div className="lesDe_contenedor">
      <h2 className="lesDe_titulo">Registro de Lesiones Después</h2>
      <p className="lesDe_descripcion">
        Complete el siguiente formulario para registrar lesiones deportivas
        ocurridas después de entrenamientos o partidos.
      </p>

      <form onSubmit={handleSubmit} className="lesDe_formulario">
        {/* Deportista */}
        <div className="lesDe_grupo">
          <label htmlFor="ID_Deportista" className="lesDe_etiqueta">
            Deportista *
          </label>
          <select
            id="ID_Deportista"
            name="ID_Deportista"
            className="lesDe_select"
            value={formData.ID_Deportista}
            onChange={handleChange}
          >
            <option value="">Seleccione un deportista</option>
            {deportistas.map((deportista) => (
              <option
                key={deportista.ID_Deportista}
                value={deportista.ID_Deportista}
              >
                {deportista.nombre_Completo}
              </option>
            ))}
          </select>
          {errores.ID_Deportista && (
            <p className="lesDe_error">{errores.ID_Deportista}</p>
          )}
        </div>

        {/* Entrenador */}
        <div className="lesDe_grupo">
          <label htmlFor="ID_Entrenador" className="lesDe_etiqueta">
            Entrenador *
          </label>
          <label className="lesDe_texto_fijo">
            {entrenador.nombre_Completo}
          </label>
          {errores.ID_Entrenador && (
            <p className="lesDe_error">{errores.ID_Entrenador}</p>
          )}
        </div>

        {/* Fecha */}
        <div className="lesDe_grupo">
          <label htmlFor="fecha_lesion" className="lesDe_etiqueta">
            Fecha de la lesión *
          </label>
          <input
            id="fecha_lesion"
            name="fecha_lesion"
            type="date"
            className="lesDe_input"
            value={formData.fecha_lesion}
            onChange={handleChange}
          />
          {errores.fecha_lesion && (
            <p className="lesDe_error">{errores.fecha_lesion}</p>
          )}
        </div>

        {/* Tipo de evento */}
        <div className="lesDe_grupo">
          <label htmlFor="tipo_evento_producido" className="lesDe_etiqueta">
            Tipo de Evento *
          </label>
          <select
            id="tipo_evento_producido"
            name="tipo_evento_producido"
            className="lesDe_select"
            value={formData.tipo_evento_producido}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="PARTIDO">Partido</option>
            <option value="ENTRENAMIENTO">Entrenamiento</option>
          </select>
          {errores.tipo_evento_producido && (
            <p className="lesDe_error">{errores.tipo_evento_producido}</p>
          )}
        </div>

        {/* Tipo de lesión */}
        <div className="lesDe_grupo">
          <label htmlFor="tipo_de_lesion_producida" className="lesDe_etiqueta">
            Tipo de Lesión Producida *
          </label>
          <input
            id="tipo_de_lesion_producida"
            name="tipo_de_lesion_producida"
            type="text"
            className="lesDe_input"
            placeholder="Ej: Esguince de tobillo..."
            value={formData.tipo_de_lesion_producida}
            onChange={handleChange}
          />
          {errores.tipo_de_lesion_producida && (
            <p className="lesDe_error">{errores.tipo_de_lesion_producida}</p>
          )}
        </div>

        {/* Detalles */}
        <div className="lesDe_grupo">
          <label htmlFor="detalles_lesion" className="lesDe_etiqueta">
            Detalles Adicionales
          </label>
          <textarea
            id="detalles_lesion"
            name="detalles_lesion"
            className="lesDe_textarea"
            value={formData.detalles_lesion}
            onChange={handleChange}
          />
        </div>

        {/* Gravedad */}
        <div className="lesDe_grupo">
          <label htmlFor="gravedad" className="lesDe_etiqueta">
            Gravedad *
          </label>
          <select
            id="gravedad"
            name="gravedad"
            className="lesDe_select"
            value={formData.gravedad}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="LEVE">Leve</option>
            <option value="MODERADO">Moderado</option>
            <option value="GRAVE">Grave</option>
          </select>
          {errores.gravedad && (
            <p className="lesDe_error">{errores.gravedad}</p>
          )}
        </div>

        {/* Dolor, Auxilios, Traslado */}
        <div className="lesDe_grupo">
          <label htmlFor="dolor_molestia" className="lesDe_etiqueta">
            ¿Dolor o molestia? *
          </label>
          <select
            id="dolor_molestia"
            name="dolor_molestia"
            className="lesDe_select"
            value={formData.dolor_molestia}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="SI">Sí</option>
            <option value="NO">No</option>
          </select>
          {errores.dolor_molestia && (
            <p className="lesDe_error">{errores.dolor_molestia}</p>
          )}
        </div>

        <div className="lesDe_grupo">
          <label htmlFor="primeros_auxilios" className="lesDe_etiqueta">
            ¿Se aplicaron primeros auxilios? *
          </label>
          <select
            id="primeros_auxilios"
            name="primeros_auxilios"
            className="lesDe_select"
            value={formData.primeros_auxilios}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="SI">Sí</option>
            <option value="NO">No</option>
          </select>
          {errores.primeros_auxilios && (
            <p className="lesDe_error">{errores.primeros_auxilios}</p>
          )}
        </div>

        <div className="lesDe_grupo">
          <label htmlFor="traslado_centro_medico" className="lesDe_etiqueta">
            ¿Traslado a centro médico? *
          </label>
          <select
            id="traslado_centro_medico"
            name="traslado_centro_medico"
            className="lesDe_select"
            value={formData.traslado_centro_medico}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="SI">Sí</option>
            <option value="NO">No</option>
          </select>
          {errores.traslado_centro_medico && (
            <p className="lesDe_error">{errores.traslado_centro_medico}</p>
          )}
        </div>

        {/* Tratamiento */}
        <div className="lesDe_grupo">
          <label
            htmlFor="tratamiento_registro_medico"
            className="lesDe_etiqueta"
          >
            Tratamiento o Registro Médico
          </label>
          <textarea
            id="tratamiento_registro_medico"
            name="tratamiento_registro_medico"
            className="lesDe_textarea"
            value={formData.tratamiento_registro_medico}
            onChange={handleChange}
          />
        </div>

        {/* Tiempo fuera */}
        <div className="lesDe_grupo">
          <label htmlFor="tiempo_fuera" className="lesDe_etiqueta">
            Tiempo fuera de actividad
          </label>
          <input
            id="tiempo_fuera"
            name="tiempo_fuera"
            type="text"
            className="lesDe_input"
            placeholder="Ej: 3 semanas..."
            value={formData.tiempo_fuera}
            onChange={handleChange}
          />
        </div>
        <div className="lesDe_botones">
          <button
            type="button"
            className="lesDe_boton lesDe_boton_secundario"
            onClick={limpiarFormulario}
            disabled={loading}
          >
            Limpiar
          </button>
          <button
            type="submit"
            className={`lesDe_boton lesDe_boton_principal ${
              loading ? "lesDe_boton_deshabilitado" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Lesión"}
          </button>
        </div>

        {message && <div className="lesDe_mensaje">{message}</div>}
      </form>
     
    </div>
 
  );
};

export default FormularioLesionesDespues;
