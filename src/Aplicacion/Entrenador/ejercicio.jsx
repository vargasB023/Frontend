import React, { useState } from "react";
import axios from "axios";
import "../../Components/Public/css/ejercicio.css";

const FormularioEjercicio = ({ ejercicio = null, onClose }) => {
  const [formData, setFormData] = useState(
    ejercicio || { nombre_Ejer: "", descripcion: "", tipo_Ejer: "" }
  );

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (ejercicio) {
        await axios.put(`https://backend-5gwv.onrender.com/api/ejercicio/${ejercicio.ID_Ejercicio}`, formData);
        alert("Ejercicio actualizado con éxito");
      } else {
        await axios.post("https://backend-5gwv.onrender.com/api/ejercicio", formData);
        alert("Ejercicio creado correctamente");
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar ejercicio:", error);
      alert("Hubo un error al guardar el ejercicio");
    }
  };

  return (
    <div className="ejer_contenedor_general">
      <h2 className="ejer_titulo_formulario">
        {ejercicio ? "Editar Ejercicio" : "Crear Ejercicio"}
      </h2>

      <form className="ejer_formulario" onSubmit={manejarSubmit}>
        <div className="ejer_grupo_campo">
          <label className="ejer_etiqueta">Nombre del Ejercicio</label>
          <input
            type="text"
            name="nombre_Ejer"
            className="ejer_input"
            value={formData.nombre_Ejer}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="ejer_grupo_campo">
          <label className="ejer_etiqueta">Descripción</label>
          <input
            type="text"
            name="descripcion"
            className="ejer_input"
            value={formData.descripcion}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="ejer_grupo_campo">
          <label className="ejer_etiqueta">Tipo de Ejercicio</label>
          <select
            name="tipo_Ejer"
            className="ejer_select"
            value={formData.tipo_Ejer}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un tipo</option>
            <option value="TECNICO">Técnico</option>
            <option value="TACTICO">Táctico</option>
            <option value="FISICO">Físico</option>
            <option value="CALENTAMIENTO">Calentamiento</option>
            <option value="RECUPERACION">Recuperación</option>
          </select>
        </div>

        <div className="ejer_acciones">
          <button type="submit" className="ejer_boton_guardar">
            {ejercicio ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" className="ejer_boton_cancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEjercicio;
