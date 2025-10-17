import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipboardList, Activity, Dumbbell } from "lucide-react";
import "../../Components/Public/css/planEntrenamientoDe.css";

const API_DEPOR = "https://backend-5gwv.onrender.com/api/deportista";
const API_PLAN = "https://backend-5gwv.onrender.com/api/plan_de_entrenamiento";

const PlanEntrenamientoDeportista = () => {
  const [deportista, setDeportista] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Cargar deportista desde localStorage
  useEffect(() => {
    const raw = localStorage.getItem("deportista");
    if (raw) {
      setDeportista(JSON.parse(raw));
    } else {
      setError("⚠️ No se encontró el deportista en sesión.");
      setLoading(false);
    }
  }, []);

  // 🔹 Obtener el equipo activo del deportista
  useEffect(() => {
    if (!deportista) return;
    const obtenerEquipo = async () => {
      try {
        const res = await axios.get(`${API_DEPOR}/${deportista.ID_Deportista}`);
        const equipoActivo = res.data.equipo?.find(
          (eq) => eq.Rel_Deportista_Equipo?.estado === "ACTIVO"
        );
        if (equipoActivo) {
          setEquipo(equipoActivo);
        } else {
          setError("⚠️ No se encontró un equipo activo para este deportista.");
        }
      } catch (err) {
        console.error(err);
        setError("❌ Error al obtener el equipo del deportista.");
      } finally {
        setLoading(false);
      }
    };
    obtenerEquipo();
  }, [deportista]);

  // 🔹 Obtener planes del equipo activo
  useEffect(() => {
    if (!equipo) return;
    const obtenerPlanes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_PLAN}/equipo/${equipo.ID_Equipo}`);
        setPlanes(res.data || []);
      } catch (err) {
        console.error(err);
        setError("❌ Error al obtener los planes de entrenamiento.");
      } finally {
        setLoading(false);
      }
    };
    obtenerPlanes();
  }, [equipo]);

  // 🔹 Utilidades
  const formatearFecha = (fecha) =>
    fecha
      ? new Date(fecha).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Sin fecha";

  const formatearHora = (hora) => hora?.substring(0, 5) ?? "--:--";

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

  // 🔹 Estados de carga / error
  if (loading) return <p className="planDeCargando">Cargando plan...</p>;
  if (error) return <p className="planDeError">{error}</p>;

  return (
    <div className="planDeContenedor">
      <header className="planDeEncabezado">
        <h1 className="planDeTitulo">
          <ClipboardList size={26} /> Plan de Entrenamiento
        </h1>
      </header>

      {equipo ? (
        <>
          {/* 🔹 Solo mostrar “Reporte de Equipo X” */}
          <div className="planDeEquipoBanner">
            <Activity size={22} />
            <h2>Reporte de {equipo.nombre_Equipo}</h2>
          </div>

          {planes.length === 0 ? (
            <p className="planDeSinDatos">
              No hay planes de entrenamiento disponibles actualmente.
            </p>
          ) : (
            planes.map((plan) => (
              <article key={plan.ID_Plan} className="planDeTarjeta">
                <div className="planDeInfo">
                  <h2 className="planDeNombre">{plan.nombre_Plan}</h2>
                  <p>
                    <strong>Objetivo:</strong> {plan.objetivo}
                  </p>
                  <p>
                    <strong>Duración:</strong> {plan.duracion} semanas
                  </p>
                  <p>
                    <strong>Inicio:</strong> {formatearFecha(plan.fecha_inicio)}{" "}
                    | <strong>Fin:</strong> {formatearFecha(plan.fecha_fin)}
                  </p>
                  <span className={`planDeEstado ${plan.estado?.toLowerCase()}`}>
                    {plan.estado || "Sin estado"}
                  </span>
                </div>

                <h3 className="planDeSubtitulo">
                  <ClipboardList size={18} /> Microciclos
                </h3>

                {plan.microciclo?.length > 0 ? (
                  plan.microciclo.map((mc) => (
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
                      <p>
                        <strong>Objetivos:</strong> {mc.objetivos}
                      </p>

                      <div className="planDeIntensidad">
                        <p>
                          <strong>Intensidad:</strong> {mc.intensidad}
                        </p>
                        <div className="planDeBarra">
                          <div
                            className={`planDeRelleno ${mc.intensidad?.toLowerCase()}`}
                            style={{
                              width: `${obtenerPorcentajeIntensidad(
                                mc.intensidad
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <h5 className="planDeSubtitulo">
                        <Activity size={18} /> Sesiones
                      </h5>

                      {mc.sesion?.length > 0 ? (
                        <div className="planDeSesiones">
                          {mc.sesion.map((ses) => (
                            <div
                              key={ses.ID_Sesion}
                              className="planDeSesionTarjeta"
                            >
                              <p className="planDeSesionTitulo">
                                <strong>{ses.nombre_Sesion}</strong>
                              </p>
                              <p>
                                <strong>Día:</strong>{" "}
                                {obtenerDiaSemana(
                                  ses.Rel_Microciclo_Sesion?.dia_Semana
                                )}
                              </p>
                              <p>
                                <strong>Horario:</strong>{" "}
                                {formatearHora(ses.hora_Inicio)} -{" "}
                                {formatearHora(ses.hora_Fin)}
                              </p>
                              <p>
                                <strong>Objetivo:</strong> {ses.objetivo}
                              </p>
                              {ses.observaciones && (
                                <p className="planDeObservacion">
                                  {ses.observaciones}
                                </p>
                              )}

                              <h6 className="planDeSubtitulo">
                                <Dumbbell size={18} /> Ejercicios
                              </h6>

                              {ses.ejercicio?.length > 0 ? (
                                <div className="planDeEjerciciosGrid">
                                  {ses.ejercicio.map((ej) => (
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
                                        <p>
                                          <strong>Duración:</strong>{" "}
                                          {ej.rel_Ejercicio_Sesion?.duracion_min
                                            ? `${ej.rel_Ejercicio_Sesion.duracion_min} min`
                                            : "N/A"}
                                        </p>
                                        {ej.rel_Ejercicio_Sesion?.series && (
                                          <p>
                                            <strong>Series:</strong>{" "}
                                            {ej.rel_Ejercicio_Sesion.series} ×{" "}
                                            {
                                              ej.rel_Ejercicio_Sesion
                                                .repeticiones
                                            }
                                          </p>
                                        )}
                                      </div>
                                      {ej.descripcion && (
                                        <p className="planDeEjercicioDescripcion">
                                          {ej.descripcion}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="planDeSinDatos">
                                  No hay ejercicios asignados.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="planDeSinDatos">
                          No hay sesiones registradas.
                        </p>
                      )}
                    </section>
                  ))
                ) : (
                  <p className="planDeSinDatos">
                    No hay microciclos registrados.
                  </p>
                )}
              </article>
            ))
          )}
        </>
      ) : (
        <p className="planDeSinDatos">
          No se encontró equipo activo asociado al deportista.
        </p>
      )}
    </div>
  );
};

export default PlanEntrenamientoDeportista;
