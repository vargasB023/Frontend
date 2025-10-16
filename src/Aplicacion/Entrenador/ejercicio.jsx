import React, { useState, useEffect } from "react";
import axios from "axios";
// 🔄 Reemplazo: antes usabas react-icons/fa
import { Edit, Trash } from "lucide-react"; 
import "../../Components/Public/css/ejercicio.css";

const Ejercicio = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [formData, setFormData] = useState({
    nombre_Ejer: "",
    descripcion: "",
    tipo_Ejer: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  // 🔴 Estado para controlar el modal de eliminación
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: null });

  const cargarEjercicios = async () => {
    try {
      const res = await axios.get("https://backend-5gwv.onrender.com/api/ejercicio");
      setEjercicios(res.data);
    } catch (err) {
      console.error("Error cargando ejercicios:", err);
    }
  };

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(
          `https://backend-5gwv.onrender.com/api/ejercicio/${editandoId}`,
          formData
        );
        setEditandoId(null);
      } else {
        await axios.post("https://backend-5gwv.onrender.com/api/ejercicio", formData);
      }
      setFormData({ nombre_Ejer: "", descripcion: "", tipo_Ejer: "" });
      cargarEjercicios();
    } catch (error) {
      console.error("Error al guardar ejercicio:", error);
      alert("Hubo un error al guardar el ejercicio.");
    }
  };

  const manejarEditar = (ejercicio) => {
    setFormData({
      nombre_Ejer: ejercicio.nombre_Ejer,
      descripcion: ejercicio.descripcion,
      tipo_Ejer: ejercicio.tipo_Ejer,
    });
    setEditandoId(ejercicio.ID_Ejercicio);
  };

  // ✅ Confirmar eliminación
  const confirmarEliminar = async () => {
    try {
      await axios.delete(`https://backend-5gwv.onrender.com/api/ejercicio/${modalEliminar.id}`);
      setModalEliminar({ abierto: false, id: null });
      cargarEjercicios();
      alert("Ejercicio eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar ejercicio:", error);
      alert("Hubo un error al eliminar el ejercicio.");
    }
  };

  return (
    <div className="ejer_contenedor_general">
      <h2 className="ejer_titulo_formulario">
        {editandoId ? "Editar Ejercicio" : "Crear Ejercicio"}
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
            {editandoId ? "Actualizar" : "Guardar"}
          </button>
          {editandoId && (
            <button
              type="button"
              className="ejer_boton_cancelar"
              onClick={() => {
                setFormData({ nombre_Ejer: "", descripcion: "", tipo_Ejer: "" });
                setEditandoId(null);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="ejer_listado">
        <h3 className="ejer_subtitulo_ejercicio">Listado de Ejercicios</h3>
        {ejercicios.length === 0 ? (
          <p className="ejer_sin_datos">No hay ejercicios disponibles</p>
        ) : (
          <ul className="ejer_lista">
            {ejercicios.map((ej) => (
              <li key={ej.ID_Ejercicio} className="ejer_item">
                <div className="ejer_info">
                  <p><strong>Nombre:</strong> {ej.nombre_Ejer}</p>
                  <p><strong>Descripción:</strong> {ej.descripcion}</p>
                  <p><strong>Tipo:</strong> {ej.tipo_Ejer}</p>
                </div>
                <div className="ejer_botones">
                  <button
                    type="button"
                    onClick={() => manejarEditar(ej)}
                    title="Editar"
                  >
                    <Edit size={20} color="#1a6f9d" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setModalEliminar({ abierto: true, id: ej.ID_Ejercicio })
                    }
                    title="Eliminar"
                  >
                    <Trash size={20} color="red" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Modal simple para confirmar eliminación */}
      {modalEliminar.abierto && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Seguro que deseas eliminar este ejercicio?</p>
            <div className="modal-buttons">
              <button onClick={confirmarEliminar}>Sí</button>
              <button onClick={() => setModalEliminar({ abierto: false, id: null })}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ejercicio;
