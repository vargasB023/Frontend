import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Public/css/InicioEntrenador.css";
import {
  CalendarDays,
  Users,
  Trophy,
  Clock,
  MapPin,
  AlertCircle,
} from "lucide-react";

const InicioEntrenador = () => {
  const [eventosHoy, setEventosHoy] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const entrenadorGuardado = localStorage.getItem("entrenador");
    const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

    if (!entrenador || !entrenador.ID_Entrenador) {
      console.warn("⚠️ No se encontró un entrenador en el localStorage.");
      setError("No se encontró un entrenador activo.");
      setCargando(false);
      return;
    }

    const ID_Entrenador = entrenador.ID_Entrenador;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        const API_CRONOGRAMAS = "https://backend-5gwv.onrender.com/api/cronograma";
        const API_EQUIPOS = "https://backend-5gwv.onrender.com/api/equipo";

        const respCrono = await axios.get(`${API_CRONOGRAMAS}/entrenador/${ID_Entrenador}`);
        const dataCrono = Array.isArray(respCrono.data) ? respCrono.data : [];

        const hoy = new Date().toISOString().split("T")[0];
        const eventosDelDia = dataCrono
          .map((item) => ({
            ...item,
            fecha: item.fecha ? new Date(item.fecha).toISOString().split("T")[0] : "",
            nombre_Evento: item.nombre_Evento || "Evento sin título",
            hora: item.hora || "-",
            lugar: item.lugar || "No especificado",
          }))
          .filter((evento) => evento.fecha === hoy);

        setEventosHoy(eventosDelDia);

        const respEquipos = await axios.get(`${API_EQUIPOS}/entrenador/${ID_Entrenador}`);
        const equiposData = Array.isArray(respEquipos.data) ? respEquipos.data : [];
        setEquipos(equiposData);
      } catch (err) {
        console.error("❌ Error al cargar datos del dashboard:", err);
        setError("Hubo un problema al obtener la información del servidor.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return <p className="mensaje-cargando">Cargando información del dashboard...</p>;
  }

  if (error) {
    return (
      <p className="mensaje-error">
        <AlertCircle size={18} /> {error}
      </p>
    );
  }

  return (
    <div className="dashboard-entrenador">
      {/* SECCIÓN EVENTOS */}
      <section className="seccion-eventos">
        <h2 className="titulo-seccion">
          <CalendarDays className="icono-seccion" /> Eventos de Hoy
        </h2>

        {eventosHoy.length === 0 ? (
          <p>No hay eventos programados para hoy.</p>
        ) : (
          <div className="lista-eventos">
            {eventosHoy.map((evento) => (
              <div key={evento.ID_Cronograma} className="tarjeta-evento">
                <h3 className="titulo-evento">{evento.nombre_Evento}</h3>
                <p>
                  <Clock size={16} /> <strong>Hora:</strong> {evento.hora}
                </p>
                <p>
                  <strong>Tipo:</strong> {evento.tipo_Evento || "No especificado"}
                </p>
                <p>
                  <MapPin size={16} /> <strong>Lugar:</strong> {evento.lugar}
                </p>
                <p>
                  <Users size={16} /> 0 deportistas
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN EQUIPOS */}
      <section className="seccion-equipos">
        <h2 className="titulo-seccion">
          <Trophy className="icono-seccion" /> Equipos del Entrenador
        </h2>
        {equipos.length === 0 ? (
          <p>No tienes equipos creados todavía.</p>
        ) : (
          <div className="lista-equipos">
            {equipos.map((equipo) => (
              <div key={equipo.ID_Equipo} className="tarjeta-equipo">
                <h3>{equipo.nombre_Equipo}</h3>
                <p>
                  <strong>Categoría:</strong> {equipo.categoria}
                </p>
                <p>
                  <strong>Liga:</strong> {equipo.liga}
                </p>
                <p>
                  <strong>Deportistas activos:</strong>{" "}
                  {equipo.deportista?.filter(
                    (d) => d.Rel_Deportista_Equipo?.estado === "ACTIVO"
                  ).length || 0}
                </p>

                {equipo.deportista &&
                  equipo.deportista
                    .filter((d) => d.Rel_Deportista_Equipo?.estado === "ACTIVO")
                    .map((dep) => (
                      <li key={dep.ID_Deportista}>
                        {dep.nombre_Completo} — {dep.posicion} #{dep.dorsal}
                      </li>
                    ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default InicioEntrenador;
