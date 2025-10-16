import { useEffect, useState } from "react";
import axios from "axios";
import "../../Components/Public/css/evaluacionesDeportista.css";

export default function ReporteEvaluacionesDeportista() {
  const [deportista, setDeportista] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [totalEvaluaciones, setTotalEvaluaciones] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarEvaluaciones = async () => {
      try {
        setCargando(true);
        setError(null);

        const raw = localStorage.getItem("deportista");
        if (!raw) {
          setError("No se encontraron datos del deportista en el almacenamiento local");
          setCargando(false);
          return;
        }

        const dep = JSON.parse(raw);
        
        if (!dep.ID_Deportista) {
          setError("ID de deportista no válido");
          setCargando(false);
          return;
        }
        const responseEvaluaciones = await axios.get(`http://localhost:3000/api/evaluacion`);
        const todasEvaluaciones = responseEvaluaciones.data;

        const evaluacionDelDeportista = todasEvaluaciones.find(
          evaluacion => evaluacion.ID_Deportista === dep.ID_Deportista
        );

        if (!evaluacionDelDeportista) {
          setDeportista(null);
          setEvaluaciones([]);
          setTotalEvaluaciones(0);
          setCargando(false);
          return;
        }
        const responseReporte = await axios.get(
          `http://localhost:3000/api/evaluacion/reporte/${evaluacionDelDeportista.ID_Evaluacion_De}`
        );

        setDeportista(responseReporte.data.deportista);
        setEvaluaciones(responseReporte.data.evaluaciones || []);
        setTotalEvaluaciones(responseReporte.data.total_evaluaciones || 0);
        
      } catch (error) {
        console.error("Error al cargar evaluaciones:", error);
        
        if (error.response?.status === 404) {
          setError("No se encontraron evaluaciones para este deportista");
        } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          setError("Error de conexión con el servidor. Verifica que el servidor esté ejecutándose.");
        } else {
          setError("Error al cargar las evaluaciones del deportista");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarEvaluaciones();
  }, []);

  if (cargando) {
    return (
      <div className="Rep-contenedor">
        <div className="Rep-cargando">
          <p>Cargando evaluaciones...</p>
          <div className="Rep-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Rep-contenedor">
        <div className="Rep-error">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="Rep-boton-volver"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="Rep-contenedor">
      <div className="Rep-header">
            <h3>📊 RESUMEN DE TUS EVALUACIONES</h3> 
      </div>
       
      <div className="Rep-resumen-evaluaciones">
        <div className="Rep-stats-container">
          <div className="Rep-stat-card">
            <span className="Rep-stat-number">{totalEvaluaciones}</span>
            <span className="Rep-stat-label">Total Evaluaciones</span>
          </div>
          <div className="Rep-stat-card">
            <span className="Rep-stat-number">
              {evaluaciones.filter(e => e.evaluacion_deportiva?.tipo_Evaluacion === 'FISICA').length}
            </span>
            <span className="Rep-stat-label">Evaluaciones Físicas</span>
          </div>
          <div className="Rep-stat-card">
            <span className="Rep-stat-number">
              {evaluaciones.filter(e => e.evaluacion_deportiva?.tipo_Evaluacion === 'TECNICA').length}
            </span>
            <span className="Rep-stat-label">Evaluaciones Técnicas</span>
          </div>
        </div>
      </div>

      <div className="Rep-seccion-evaluaciones">
        <div className="Rep-header-evaluaciones">
          <h3>Historial de Evaluaciones</h3>
        </div>
        
        {evaluaciones.length > 0 ? (
          <div className="Rep-lista-evaluaciones">
            {evaluaciones.map((evaluacion, index) => (
              <div key={evaluacion.evaluacion_deportiva?.ID_Evaluacion_De || index} className="Rep-card-evaluacion">
                <div className="Rep-evaluacion-header">
                  <div className="Rep-header-izquierda">
                    <h4>
                      Evaluación {evaluacion.evaluacion_deportiva?.tipo_Evaluacion?.toLowerCase() || 'Deportiva'}
                      <span className={`Rep-etiqueta-tipo ${evaluacion.evaluacion_deportiva?.tipo_Evaluacion}`}>
                        {evaluacion.evaluacion_deportiva?.tipo_Evaluacion || 'SIN TIPO'}
                      </span>
                    </h4>
                    <p className="Rep-entrenador">
                      <strong>Evaluado por:</strong> {evaluacion.entrenador?.nombre_Completo || "No especificado"}
                    </p>
                  </div>
                  <span className="Rep-fecha">
                    {evaluacion.evaluacion_deportiva?.fecha ? 
                      new Date(evaluacion.evaluacion_deportiva.fecha).toLocaleDateString("es-ES", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Fecha no disponible'
                    }
                  </span>
                </div>

                <div className="Rep-evaluacion-content">
                  <div className="Rep-evaluacion-info">
                    <p><strong>Resultados:</strong> {evaluacion.evaluacion_deportiva?.resultados || "No especificado"}</p>
                    {evaluacion.evaluacion_deportiva?.observaciones && (
                      <p><strong>Observaciones:</strong> {evaluacion.evaluacion_deportiva.observaciones}</p>
                    )}
                  </div>
                  {evaluacion.evaluacion_deportiva?.tipo_Evaluacion === 'FISICA' && evaluacion.evaluacion_Fisica && (
                    <div className="Rep-detalles-fisica">
                      <h5>Resultados Físicos</h5>
                      <div className="Rep-metricas-grid">
                        <div className="Rep-metrica">
                          <span>Peso:</span>
                          <strong>{evaluacion.evaluacion_Fisica.peso || "N/A"} kg</strong>
                        </div>
                        <div className="Rep-metrica">
                          <span>Estatura:</span>
                          <strong>{evaluacion.evaluacion_Fisica.estatura || "N/A"} m</strong>
                        </div>
                        <div className="Rep-metrica">
                          <span>IMC:</span>
                          <strong>{evaluacion.evaluacion_Fisica.imc || "N/A"}</strong>
                        </div>
                        <div className="Rep-metrica">
                          <span>Tasa Corporal:</span>
                          <strong>{evaluacion.evaluacion_Fisica.tasa_Corporal || "N/A"}%</strong>
                        </div>
                        <div className="Rep-metrica">
                          <span>Sprint:</span>
                          <strong>{evaluacion.evaluacion_Fisica.sprint || "N/A"} s</strong>
                        </div>
                        <div className="Rep-metrica">
                          <span>Agilidad:</span>
                          <strong>{evaluacion.evaluacion_Fisica.agilidad || "N/A"} s</strong>
                        </div>
                        <div className="Rep-metrica">
                          <span>Flexibilidad Hombro:</span>
                          <strong>{evaluacion.evaluacion_Fisica.flexibilidad_Hombro || "N/A"}</strong>
                        </div>
                        {evaluacion.evaluacion_Fisica.test_Course_Navette && (
                          <div className="Rep-metrica">
                            <span>Test Navette:</span>
                            <strong>{evaluacion.evaluacion_Fisica.test_Course_Navette}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {evaluacion.evaluacion_deportiva?.tipo_Evaluacion === 'TECNICA' && evaluacion.evaluacion_Tecnica && (
                    <div className="Rep-detalles-tecnica">
                      <h5>Resultados Técnicos</h5>
                      <div className="Rep-habilidades-grid">
                        <div className="Rep-subseccion">
                          <h6>Saque - {evaluacion.evaluacion_Tecnica.SAQUE || "N/A"}</h6>
                          <div className="Rep-submetricas">
                            <div className="Rep-submetrica">
                              <span>Potencia:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.potencia_1 || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Técnica:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.tecnica_1 || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Consistencia:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.consistencia || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Dificultad:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.dificultad || "N/A"}/3</strong>
                            </div>
                          </div>
                        </div>
                        <div className="Rep-subseccion">
                          <h6>Recepción - {evaluacion.evaluacion_Tecnica.RECEPCION || "N/A"}</h6>
                          <div className="Rep-submetricas">
                            <div className="Rep-submetrica">
                              <span>Técnica:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.tecnica_2 || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Precisión:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.presicion || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Control:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.control || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Desplazamiento:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.desplazamiento || "N/A"}/3</strong>
                            </div>
                          </div>
                        </div>
                        <div className="Rep-subseccion">
                          <h6>Ataque - {evaluacion.evaluacion_Tecnica.ATAQUE || "N/A"}</h6>
                          <div className="Rep-submetricas">
                            <div className="Rep-submetrica">
                              <span>Técnica:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.tecnica_3 || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Potencia:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.potencia_2 || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Dirección:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.direccion || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Colocación:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.colocacion || "N/A"}/3</strong>
                            </div>
                            <div className="Rep-submetrica">
                              <span>Variedad de Golpes:</span>
                              <strong>{evaluacion.evaluacion_Tecnica.variedad_De_Golpes || "N/A"}/3</strong>
                            </div>
                          </div>
                        </div>
                        <div className="Rep-subseccion">
                          <h6>Defensivas:</h6>
                          <div className="Rep-submetricas">
                            {evaluacion.evaluacion_Tecnica.BLOQUEO && (
                              <div className="Rep-submetrica">
                                <span>Bloqueo:</span>
                                <strong>{evaluacion.evaluacion_Tecnica.BLOQUEO}/3</strong>
                              </div>
                            )}
                            {evaluacion.evaluacion_Tecnica.DEFENSA && (
                              <div className="Rep-submetrica">
                                <span>Defensa:</span>
                                <strong>{evaluacion.evaluacion_Tecnica.DEFENSA}/3</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="Rep-sin-evaluaciones">
            <div className="Rep-sin-evaluaciones-icono">📭</div>
            <h4>No hay evaluaciones registradas</h4>
            <p>Este deportista no tiene evaluaciones en el sistema.</p>
          </div>
        )}
      </div>
    </div>
  );
}