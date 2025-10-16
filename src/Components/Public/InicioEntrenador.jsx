import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Public/css/InicioEntrenador.css";
import { FaCalendarAlt, FaUsers, FaTrophy } from "react-icons/fa";

const InicioEntrenador = ({ ID_Entrenador }) => {
  const [eventosHoy, setEventosHoy] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🟡 ID_Entrenador recibido:", ID_Entrenador);

    const cargarDatos = async () => {
      if (!ID_Entrenador) {
        console.warn("⚠️ No se recibió un ID_Entrenador válido, cancelando carga.");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);

        const API_CRONOGRAMAS = "http://localhost:3000/api/cronograma";
        const API_EQUIPOS = "http://localhost:3000/api/equipo";

        // 🔹 Petición de eventos
        const respCrono = await axios.get(`${API_CRONOGRAMAS}/entrenador/${ID_Entrenador}`);
        const dataCrono = Array.isArray(respCrono.data) ? respCrono.data : [];

        // 🔹 Filtramos los eventos del día actual
        const hoy = new Date().toISOString().split("T")[0];
        const eventosDelDia = dataCrono.filter(item => {
          const fechaEvento = new Date(item.fecha).toISOString().split("T")[0];
          return fechaEvento === hoy;
        });
        setEventosHoy(eventosDelDia);

        // 🔹 Petición de equipos
        const respEquipos = await axios.get(`${API_EQUIPOS}/entrenador/${ID_Entrenador}`);
        setEquipos(Array.isArray(respEquipos.data) ? respEquipos.data : []);

        console.log("✅ Datos cargados correctamente.");
      } catch (error) {
        console.error("❌ Error al cargar datos del dashboard:", error);
        setError("Hubo un problema al obtener la información del servidor.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [ID_Entrenador]);

  // 🔹 Estado de carga
  if (cargando) {
    return <p className="mensaje-cargando">Cargando información del dashboard...</p>;
  }

  // 🔹 Error de carga
  if (error) {
    return <p className="mensaje-error">{error}</p>;
  }

  // 🔹 Sin ID válido
  if (!ID_Entrenador) {
    return <p className="mensaje-error">No se encontró un entrenador activo.</p>;
  }

  return (
    <div className="dashboard-entrenador">
      {/* SECCIÓN EVENTOS */}
      <section className="seccion-eventos">
        <h2>📅 Eventos de Hoy</h2>
        {eventosHoy.length === 0 ? (
          <p>No hay eventos programados para hoy.</p>
        ) : (
          <div className="lista-eventos">
            {eventosHoy.map((evento) => (
              <div key={evento.ID_Cronograma} className="tarjeta-evento">
                <h3>
                  <FaCalendarAlt /> {evento.titulo || "Evento sin título"}
                </h3>
                <p>
                  <strong>Hora:</strong> {evento.hora_Inicio} - {evento.hora_Fin}
                </p>
                <p>
                  <strong>Equipo:</strong>{" "}
                  {evento.Equipo?.nombre_Equipo || "Sin equipo asignado"}
                </p>
                <p>
                  <strong>Lugar:</strong> {evento.lugar || "No especificado"}
                </p>
                <p>
                  <FaUsers /> {evento.Equipo?.Deportista?.length || 0} deportistas
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN EQUIPOS */}
      <section className="seccion-equipos">
        <h2>
          <FaTrophy /> Equipos del Entrenador
        </h2>
        {equipos.length === 0 ? (
          <p>No tienes equipos creados todavía.</p>
        ) : (
          <div className="lista-equipos">
            {equipos.map((equipo) => (
              <div key={equipo.ID_Equipo} className="tarjeta-equipo">
                <h3>{equipo.nombre_Equipo}</h3>
                <p>
                  <strong>Deportistas:</strong> {equipo.Deportista?.length || 0}
                </p>
                {equipo.Deportista?.length > 0 && (
                  <ul>
                    {equipo.Deportista.map((dep) => (
                      <li key={dep.ID_Deportista}>
                        {dep.nombre} {dep.apellido}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default InicioEntrenador;
