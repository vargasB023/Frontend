import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilLine, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import "../../Components/Public/css/sesion.css";

const ListarSesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar sesiones desde la API
  const fetchSesiones = async () => {
    try {
      const { data } = await axios.get("https://backend-5gwv.onrender.com/api/sesion");
      setSesiones(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
      setSesiones([]);
      setMensaje("❌ Error al cargar las sesiones.");
    }
  };

  // 🔹 useEffect inicial
  useEffect(() => {
    fetchSesiones();
  }, []);

  // 🔹 Expandir/colapsar sesión
  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // 🗑 Eliminar sesión
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta sesión?")) return;
    try {
      await axios.delete(`https://backend-5gwv.onrender.com/api/sesion/${id}`);
      setMensaje("Sesión eliminada correctamente");
      fetchSesiones();
    } catch (error) {
      console.error("Error al eliminar sesión:", error);
      setMensaje("❌ Error al eliminar sesión");
    }
  };

  // 🖊 Editar sesión — puedes adaptar para abrir tu formulario principal
  const handleEditar = (sesion) => {
    console.log("Editar sesión:", sesion);
    alert("Aquí puedes abrir el formulario de edición de sesión");
  };

  if (!sesiones || sesiones.length === 0)
    return <p className="ses_vacio">No hay sesiones registradas.</p>;

  return (
    <section className="ses_listado">
      <h3 className="ses_subtitulo">Sesiones Registradas</h3>
      {mensaje && <div className="ses_mensaje">{mensaje}</div>}

      {sesiones.map((s) => (
        <div key={s.ID_Sesion} className="ses_card">
          <div className="ses_card_header">
            <h4>{s.nombre_Sesion}</h4>
            <div className="ses_accionesCard">
              <button onClick={() => handleEditar(s)} className="ses_icono btn-editar">
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
                {expanded[s.ID_Sesion] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>

          {expanded[s.ID_Sesion] && (
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
                      <th>Series</th>
                      <th>Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.ejercicio.map((ej, idx) => (
                      <tr key={idx}>
                        <td>{ej.nombre_Ejer}</td>
                        <td>{ej.rel_Ejercicio_Sesion?.fase || "-"}</td>
                        <td>{ej.rel_Ejercicio_Sesion?.series || "-"}</td>
                        <td>{ej.rel_Ejercicio_Sesion?.repeticiones || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Sin ejercicios asignados</p>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default ListarSesiones;
