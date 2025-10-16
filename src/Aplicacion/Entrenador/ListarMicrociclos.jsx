import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Target, Flame, FileText, Edit, Trash2, Clock } from "lucide-react";
import "../../Components/Public/css/microciclo.css";

const ListarMicrociclos = ({ onEdit }) => {
  const [microciclos, setMicrociclos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const diasSemana = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
  };

  const obtenerAnchoIntensidad = (nivel) =>
    nivel === "Baja" ? "33%" : nivel === "Media" ? "66%" : nivel === "Alta" ? "100%" : "0%";

  const obtenerColorIntensidad = (nivel) =>
    nivel === "Baja" ? "#4CAF50" : nivel === "Media" ? "#FFC107" : nivel === "Alta" ? "#F44336" : "#ccc";

  const fetchMicrociclos = async () => {
    try {
      const { data } = await axios.get("https://backend-5gwv.onrender.com/api/microciclo");
      setMicrociclos(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error al obtener microciclos:", error);
      setMensaje("❌ Error al cargar microciclos");
    }
  };

  useEffect(() => {
    fetchMicrociclos();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este microciclo?")) return;
    try {
      await axios.delete(`https://backend-5gwv.onrender.com/api/microciclo/${id}`);
      setMensaje("Microciclo eliminado correctamente");
      fetchMicrociclos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje("❌ Error al eliminar microciclo");
    }
  };

  if (microciclos.length === 0)
    return <p className="micro_vacio">No hay microciclos registrados.</p>;

  return (
    <section className="micro_listado">
      <h3 className="micro_subtitulo">Microciclos Registrados</h3>
      {mensaje && <div className="micro_mensaje">{mensaje}</div>}

      {microciclos.map((m) => (
        <div key={m.ID_Microciclo} className="micro_card">
          <h4>{m.nombre_Microciclo}</h4>
          <p><FileText size={16} /> {m.descripcion}</p>
          <p><Calendar size={16} /> {m.fecha_Inicio} a {m.fecha_Fin}</p>
          <p><Target size={16} /> {m.objetivos}</p>

          <div className="micro_intensidad">
            <div className="micro_intensidad_label">
              <Flame size={16} /> Intensidad: {m.intensidad}
            </div>
            <div className="micro_barra">
              <div
                className="micro_barra_relleno"
                style={{
                  width: obtenerAnchoIntensidad(m.intensidad),
                  backgroundColor: obtenerColorIntensidad(m.intensidad),
                }}
              ></div>
            </div>
          </div>

          <h5>Sesiones asignadas:</h5>
          {m.sesion?.length > 0 ? (
            <ul className="lista_sesiones">
              {m.sesion.map((s) => (
                <li key={s.ID_Sesion} className="sesion_item">
                  <strong>{s.nombre_Sesion}</strong>
                  <p><Clock size={14} /> {s.hora_Inicio} - {s.hora_Fin}</p>
                  <p><Target size={14} /> {s.objetivo}</p>
                  <p><FileText size={14} /> {s.observaciones}</p>
                  <p><Calendar size={14} /> Día: {diasSemana[s.Rel_Microciclo_Sesion?.dia_Semana]}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay sesiones asignadas</p>
          )}

          <div className="micro_botones">
            <button onClick={() => onEdit(m)}>
              <Edit size={16} /> Editar
            </button>
            <button onClick={() => handleEliminar(m.ID_Microciclo)}>
              <Trash2 size={16} /> Eliminar
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ListarMicrociclos;
