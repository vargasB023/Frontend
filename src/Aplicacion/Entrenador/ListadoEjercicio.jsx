import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import "../../Components/Public/css/ejercicio.css";
import FormularioEjercicio from "./ejercicio";

const ListadoEjercicio = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: null });
  const [editando, setEditando] = useState(null);

  const cargarEjercicios = async () => {
    try {
      const res = await axios.get("https://backend-5gwv.onrender.com/api/ejercicio");
      setEjercicios(res.data);
    } catch (error) {
      console.error("Error cargando ejercicios:", error);
    }
  };

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const confirmarEliminar = async () => {
    try {
      await axios.delete(`https://backend-5gwv.onrender.com/api/ejercicio/${modalEliminar.id}`);
      setModalEliminar({ abierto: false, id: null });
      cargarEjercicios();
      alert("Ejercicio eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar ejercicio:", error);
      alert("Error al eliminar ejercicio");
    }
  };

  return (
    <div className="ejer_contenedor_general">
      {editando ? (
        <FormularioEjercicio
          ejercicio={editando}
          onClose={() => {
            setEditando(null);
            cargarEjercicios();
          }}
        />
      ) : (
        <>
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
                    <button type="button" onClick={() => setEditando(ej)} title="Editar">
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
        </>
      )}

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

export default ListadoEjercicio;
