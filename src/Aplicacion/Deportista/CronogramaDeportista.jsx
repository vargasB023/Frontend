import { useEffect, useState } from "react";
import axios from "axios";
import "../../Components/Public/css/CronogramaDeportista.css";

export default function CronogramaDeportista() {
  const [deportista, setDeportista] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const raw = localStorage.getItem("deportista");
        if (!raw) return;

        const dep = JSON.parse(raw);
        setDeportista(dep);

        // Obtener datos del deportista y su equipo
        const res = await axios.get(`http://localhost:3000/api/deportista/${dep.ID_Deportista}`);
        
        if (res.data?.equipo && res.data.equipo.length > 0) {
          const eq = res.data.equipo[0];
          setEquipo(eq);

          // Obtener eventos del equipo
          const respEventos = await axios.get(`http://localhost:3000/api/cronograma/equipo/${eq.ID_Equipo}`);
          setEventos(respEventos.data);
        } else {
          setEquipo(null);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("Error al cargar el cronograma");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="cronograma-contenedor">
        <div className="cronograma-cargando">
          <p>Cargando cronograma...</p>
        </div>
      </div>
    );
  }

  if (!equipo) {
    return (

        
      <div className="cronograma-contenedor">
        <div className="cronograma-sin-equipo">
          <h2> CRONOGRAMA</h2>
          <p>⚠️ No estás asignado a ningún equipo activo.</p>
        </div>
      </div>
    );
  }

  // Ordenar eventos por fecha (mas recientes primero)
  const eventosOrdenados = [...eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className="cronograma-contenedor">
        <div className="cronograma-header">
        <div className="cronograma-title">
            <h2>📅 CRONOGRAMA</h2>
            <span className="equipo-badge">
            {equipo.nombre_Equipo} | {equipo.categoria}
            </span>
        </div>
        <p className="event-count">Total de eventos: {eventos.length}</p>
        </div>


      <div className="cronograma-eventos">
        {eventosOrdenados.length > 0 ? (
          eventosOrdenados.map((ev) => (
            <div key={ev.ID_Cronograma} className="cronograma-card-evento">
              <div className="evento-header">
                <h3>{ev.nombre_Evento.toUpperCase()}</h3>
                <span className={`evento-tipo ${ev.tipo_Evento?.toLowerCase()}`}>
                  {ev.tipo_Evento}
                </span>
              </div>
              
              <div className="evento-fecha-hora">
                <span className="fecha">
                  📅 {new Date(ev.fecha).toLocaleDateString("es-ES", { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="hora">⏰ {ev.hora?.slice(0, 5)} hrs</span>
              </div>

              <div className="evento-detalles">
                <p><strong>📍 Lugar:</strong> {ev.lugar}</p>
                <p><strong>📝 Descripción:</strong> {ev.descripcion}</p>
              </div>

              <div className="evento-equipo">
                <small>{ev.nombre_Equipo}</small>
              </div>
            </div>
          ))
        ) : (
          <div className="cronograma-sin-eventos">
            <p>No hay eventos programados para este equipo.</p>
          </div>
        )}
      </div>
    </div>
  );
}