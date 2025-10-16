import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaClipboardList, FaBolt, FaDumbbell } from "react-icons/fa";
import "../../Components/Public/css/planEntrenamientoDe.css";

const API_DEPOR = "https://backend-5gwv.onrender.com/api/deportista";
const API_PLAN = "https://backend-5gwv.onrender.com/api/planEntrenamiento";

const PlanEntrenamientoDeportista = () => {
  const [deportista, setDeportista] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Cargar deportista del localStorage
  useEffect(() => {
    const raw = localStorage.getItem("deportista");
    if (raw) {
      setDeportista(JSON.parse(raw));
    } else {
      setError("No se encontró el deportista en sesión.");
      setCargando(false);
    }
  }, []);

  // 🔹 Obtener el equipo activo del deportista
  useEffect(() => {
    if (!deportista) return;
    const obtenerEquipo = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`${API_DEPOR}/${deportista.ID_Deportista}`);
        const equipoActivo = res.data.equipo?.find(
          (eq) => eq.Rel_Deportista_Equipo?.estado === "ACTIVO"
        );
        if (equipoActivo) {
          setEquipo(equipoActivo);
        } else {
          setError("No se encontró un equipo activo para este deportista.");
        }
      } catch {
        setError("Error al obtener el equipo del deportista.");
      } finally {
        setCargando(false);
      }
    };
    obtenerEquipo();
  }, [deportista]);

  // 🔹 Obtener planes del equipo
  useEffect(() => {
    if (!equipo) return;
    const obtenerPlanes = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`${API_PLAN}/equipo/${equipo.ID_Equipo}`);
        setPlanes(res.data);
      } catch {
        setError("Error al obtener los planes de entrenamiento.");
      } finally {
        setCargando(false);
      }
    };
    obtenerPlanes();
  }, [equipo]);

  // 🔹 Utilidades de formato
  const formatearFecha = (fecha) =>
    fecha
      ? new Date(fecha).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  const formatearHora = (hora) => hora?.substring(0, 5) ?? "";

  const obtenerDiaSemana = (dia) => {
    const dias = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return dias[dia] || "Día no especificado";
  };

  const obtenerPorcentajeIntensidad = (intensidad) => {
    switch (intensidad?.toUpperCase()) {
      case "ALTA":
        return 100;
      case "MEDIA":
        return 60;
      case "BAJA":
        return 30;
      default:
        return 0;
    }
  };

  if (cargando) return <p className="planDeCargando">Cargando...</p>;
  if (error) return <p className="planDeError">{error}</p>;

  return (
    <div className="planDeContenedor">
      <header className="planDeEncabezado">
        <h1 className="planDeTitulo">
          <FaClipboardList /> Plan de Entrenamiento del Equipo
        </h1>
      </header>

      {equipo ? (
        <>
          <p className="planDeTextoEquipo">
            Mostrando plan de entrenamiento del equipo{" "}
            <strong>{equipo.nombre_Equipo}</strong>
          </p>

          {planes.length === 0 ? (
            <p className="planDeSinDatos">
              No hay planes de entrenamiento disponibles.
            </p>
          ) : (
            planes.map((plan) => (
              <article key={plan.ID_Plan} className="planDeTarjeta">
                <div className="planDeInfo">
                  <p><strong>Nombre:</strong> {plan.nombre_Plan}</p>
                  <p><strong>Objetivo:</strong> {plan.objetivo}</p>
                  <p><strong>Duración:</strong> {plan.duracion} semanas</p>
                  <p><strong>Inicio:</strong> {formatearFecha(plan.fecha_inicio)}</p>
                  <p><strong>Fin:</strong> {formatearFecha(plan.fecha_fin)}</p>
                  <span className={`planDeEstado ${plan.estado?.toLowerCase()}`}>
                    {plan.estado}
                  </span>
                </div>

                <h3 className="planDeSubtitulo">
                  <FaClipboardList /> Microciclos
                </h3>

                {plan.Microciclos?.map((mc) => (
                  <section
                    key={mc.ID_Microciclo}
                    className="planDeMicrocicloTarjeta"
                  >
                    <div className="planDeMicrocicloCabecera">
                      <h4>{mc.nombre_Microciclo}</h4>
                      <span>
                        {formatearFecha(mc.fecha_Inicio)} -{" "}
                        {formatearFecha(mc.fecha_Fin)}
                      </span>
                    </div>
                    <p className="planDeDescripcion">{mc.descripcion}</p>
                    <p><strong>Objetivos:</strong> {mc.objetivos}</p>

                    <div className="planDeIntensidad">
                      <p><strong>Intensidad:</strong> {mc.intensidad}</p>
                      <div className="planDeBarra">
                        <div
                          className={`planDeRelleno ${mc.intensidad?.toLowerCase()}`}
                          style={{
                            width: `${obtenerPorcentajeIntensidad(mc.intensidad)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <h5 className="planDeSubtitulo">
                      <FaBolt /> Sesiones
                    </h5>

                    <div className="planDeSesiones">
                      {mc.Sesions?.map((ses) => (
                        <div key={ses.ID_Sesion} className="planDeSesionTarjeta">
                          <p className="planDeSesionTitulo">
                            <strong>{ses.nombre_Sesion}</strong>
                          </p>
                          <p><strong>Día:</strong>{" "}
                            {obtenerDiaSemana(ses.Rel_Microciclo_Sesion?.dia_Semana)}
                          </p>
                          <p><strong>Horario:</strong>{" "}
                            {formatearHora(ses.hora_Inicio)} -{" "}
                            {formatearHora(ses.hora_Fin)}
                          </p>
                          <p><strong>Objetivo:</strong> {ses.objetivo}</p>
                          <p className="planDeObservacion">
                            {ses.observaciones}
                          </p>

                          <h6 className="planDeSubtitulo">
                            <FaDumbbell /> Ejercicios
                          </h6>
                          <div className="planDeEjerciciosGrid">
                            {ses.Ejercicios?.map((ej) => (
                              <div
                                key={ej.ID_Ejercicio}
                                className="planDeEjercicioTarjeta"
                              >
                                <div className="planDeEjercicioCabecera">
                                  <span className="planDeEjercicioNombre">
                                    {ej.nombre_Ejer}
                                  </span>
                                  <span className="planDeEjercicioTipo">
                                    {ej.tipo_Ejer}
                                  </span>
                                </div>
                                <div className="planDeEjercicioDetalles">
                                  <p><strong>Duración:</strong>{" "}
                                    {ej.rel_Ejercicio_Sesion?.duracion_min} min
                                  </p>
                                  {ej.rel_Ejercicio_Sesion?.series && (
                                    <p>
                                      <strong>Series:</strong>{" "}
                                      {ej.rel_Ejercicio_Sesion.series} ×{" "}
                                      {ej.rel_Ejercicio_Sesion.repeticiones}
                                    </p>
                                  )}
                                </div>
                                <p className="planDeEjercicioDescripcion">
                                  {ej.descripcion}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </article>
            ))
          )}
        </>
      ) : (
        <p className="planDeSinDatos">
          No se encontró equipo asociado al deportista.
        </p>
      )}
    </div>
  );
};

export default PlanEntrenamientoDeportista;
