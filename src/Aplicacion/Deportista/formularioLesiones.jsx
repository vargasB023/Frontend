import React, { useState } from "react";
import axios from "axios";
import "../../Components/Public/css/formulariolesionesAntes.css";

const FormularioLesiones = ({  onCancel }) => {
  const deportistaGuardado = localStorage.getItem("deportista");
  const deportista = deportistaGuardado ? JSON.parse(deportistaGuardado) : null;
  
  const [formData, setFormData] = useState({
    ID_Deportista: deportista?.ID_Deportista || "",
    añadir_Lesion_Antes: "",
    fecha: "",
    detalles_Lesion: "",
    tiempo_Fuera_Competencia: "",
    gravedad: "",
    recaidas: "",
    lesiones_Fuera: "",
    dolor_Molestia: "",
    cirugias: "",
    posicion: "",
  });

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [message, setMessage] = useState(null);

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

    // Validación de fecha futura
    if (formData.fecha) {
      const fechaLesion = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Eliminamos la parte de la hora para comparar solo fechas
      
      if (fechaLesion > hoy) {
        nuevosErrores.fecha = "La fecha no puede ser futura";
      }
    }

    if (!formData.añadir_Lesion_Antes.trim()) {
      nuevosErrores.añadir_Lesion_Antes = "El tipo de lesión es obligatorio";
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = "La fecha es obligatoria";
    }

    if (formData.tiempo_Fuera_Competencia === "") {
      nuevosErrores.tiempo_Fuera_Competencia =
        "El tiempo fuera de competencia es obligatorio";
    } else if (isNaN(Number(formData.tiempo_Fuera_Competencia))) {
      nuevosErrores.tiempo_Fuera_Competencia = "Debe ser un número";
    }

    if (!formData.gravedad) {
      nuevosErrores.gravedad = "La gravedad es obligatoria";
    }

    if (!formData.recaidas) {
      nuevosErrores.recaidas = "Este campo es obligatorio";
    }

    if (!formData.lesiones_Fuera) {
      nuevosErrores.lesiones_Fuera = "Este campo es obligatorio";
    }

    if (!formData.dolor_Molestia) {
      nuevosErrores.dolor_Molestia = "Este campo es obligatorio";
    }

    if (!formData.cirugias) {
      nuevosErrores.cirugias = "Este campo es obligatorio";
    }

    if (!formData.posicion) {
      nuevosErrores.posicion = "La posición es obligatoria";
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

      // Asegurarnos que el ID_Deportista está incluido
      const payload = {
        ...formData,
        ID_Deportista: deportista.ID_Deportista,
        tiempo_Fuera_Competencia: Number(formData.tiempo_Fuera_Competencia),
      };

      const response = await axios.post(
        "https://backend-5gwv.onrender.com/api/h_lesiones_antes",
        payload,
        {
          headers: {
            "ID-Deportista": deportista.ID_Deportista,
          },
        }
      );
      setMessage("¡Lesión registrada correctamente!");
      limpiarFormulario();
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
      ID_Deportista: deportista.ID_Deportista,
      añadir_Lesion_Antes: "",
      fecha: "",
      detalles_Lesion: "",
      tiempo_Fuera_Competencia: "",
      gravedad: "",
      recaidas: "",
      lesiones_Fuera: "",
      dolor_Molestia: "",
      cirugias: "",
      posicion: "",
    });
    setErrores({});
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Registro de Lesiones Anteriores</h1>
            <p className="card-description">
              Complete la información sobre lesiones previas del deportista
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-content">
              {/* Tipo de Lesión */}
              <div className="form-group">
                <label htmlFor="añadir_Lesion_Antes" className="label">
                  Tipo de Lesión *
                </label>
                <input
                  id="añadir_Lesion_Antes"
                  name="añadir_Lesion_Antes"
                  type="text"
                  className="input"
                  placeholder="Ej: Esguince de tobillo..."
                  value={formData.añadir_Lesion_Antes}
                  onChange={handleChange}
                  maxLength={200}
                />
                {errores.añadir_Lesion_Antes && (
                  <p className="alerta_error">{errores.añadir_Lesion_Antes}</p>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha" className="label">
                    Fecha de la Lesión *
                  </label>
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                    className="input"
                    value={formData.fecha}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errores.fecha && (
                    <p className="alerta_error">{errores.fecha}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="tiempo_Fuera_Competencia" className="label">
                    Tiempo Fuera de Competencia (días) *
                  </label>
                  <input
                    id="tiempo_Fuera_Competencia"
                    name="tiempo_Fuera_Competencia"
                    type="number"
                    className="input"
                    min="0"
                    placeholder="0"
                    value={formData.tiempo_Fuera_Competencia}
                    onChange={handleChange}
                  />
                  {errores.tiempo_Fuera_Competencia && (
                    <p className="alerta_error">
                      {errores.tiempo_Fuera_Competencia}
                    </p>
                  )}
                </div>
              </div>

              {/* Detalles */}
              <div className="form-group">
                <label htmlFor="detalles_Lesion" className="label">
                  Detalles Adicionales
                </label>
                <textarea
                  id="detalles_Lesion"
                  name="detalles_Lesion"
                  className="textarea"
                  placeholder="Describa detalles, tratamiento..."
                  value={formData.detalles_Lesion}
                  onChange={handleChange}
                  maxLength={200}
                  rows={4}
                />
              </div>

              {/* Gravedad y Posición */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gravedad" className="label">
                    Gravedad *
                  </label>
                  <select
                    id="gravedad"
                    name="gravedad"
                    className="select"
                    value={formData.gravedad}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione la gravedad</option>
                    <option value="LEVE">Leve</option>
                    <option value="MODERADO">Moderado</option>
                    <option value="GRAVE">Grave</option>
                  </select>
                  {errores.gravedad && (
                    <p className="alerta_error">{errores.gravedad}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="posicion" className="label">
                    Posición en el Equipo *
                  </label>
                  <select
                    id="posicion"
                    name="posicion"
                    className="select"
                    value={formData.posicion}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione la posición</option>
                    <option value="CENTRAL">Central</option>
                    <option value="REMATADOR">Rematador</option>
                    <option value="LIBERO">Líbero</option>
                    <option value="ARMADOR">Armador</option>
                    <option value="ZAGUERO DERECHO">Zaguero Derecho</option>
                    <option value="ZAGUERO IZQUIERDO">Zaguero Izquierdo</option>
                  </select>
                  {errores.posicion && (
                    <p className="alerta_error">{errores.posicion}</p>
                  )}
                </div>
              </div>

              {/* Preguntas Sí/No */}
              <div className="form-section">
                <h3 className="section-title">Información Adicional</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="recaidas" className="label">
                      ¿Hubo Recaídas? *
                    </label>
                    <select
                      id="recaidas"
                      name="recaidas"
                      className="select"
                      value={formData.recaidas}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="SI">Sí</option>
                      <option value="NO">No</option>
                    </select>
                    {errores.recaidas && (
                      <p className="alerta_error">{errores.recaidas}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lesiones_Fuera" className="label">
                      ¿Lesiones Fuera del Deporte? *
                    </label>
                    <select
                      id="lesiones_Fuera"
                      name="lesiones_Fuera"
                      className="select"
                      value={formData.lesiones_Fuera}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="SI">Sí</option>
                      <option value="NO">No</option>
                    </select>
                    {errores.lesiones_Fuera && (
                      <p className="alerta_error">{errores.lesiones_Fuera}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dolor_Molestia" className="label">
                      ¿Dolor o Molestias Actuales? *
                    </label>
                    <select
                      id="dolor_Molestia"
                      name="dolor_Molestia"
                      className="select"
                      value={formData.dolor_Molestia}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="SI">Sí</option>
                      <option value="NO">No</option>
                    </select>
                    {errores.dolor_Molestia && (
                      <p className="alerta_error">{errores.dolor_Molestia}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cirugias" className="label">
                      ¿Requirió Cirugías? *
                    </label>
                    <select
                      id="cirugias"
                      name="cirugias"
                      className="select"
                      value={formData.cirugias}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="SI">Sí</option>
                      <option value="NO">No</option>
                    </select>
                    {errores.cirugias && (
                      <p className="alerta_error">{errores.cirugias}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={limpiarFormulario}
                disabled={loading}
              >
                Limpiar
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar Lesión"}
              </button>
              {onCancel && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
            </div>
            {message && (
              <div
                style={{
                  marginTop: "1rem",
                  color: message.includes("¡") ? "green" : "red",
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioLesiones;