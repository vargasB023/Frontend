import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Components/Public/css/ReporteEvaluacion.css";

const ReporteEvaluacion = ({ id, onCerrar }) => {
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      cargarReporte();
    }
  }, [id]);

  const cargarReporte = async () => {
    try {
      setCargando(true);
      const res = await axios.get(
        `https://backend-5gwv.onrender.com/api/evaluacion/reporte/${id}`
      );
      console.log("Reporte cargado:", res.data); 
      setReporte(res.data);
      setError("");
    } catch (err) {
      console.error("Error al cargar el reporte:", err);
      setError("Error al cargar el reporte de evaluación");
    } finally {
      setCargando(false);
    }
  };

  const imprimirReporte = () => {
    window.print();
  };


  const formatearClaveTecnica = (clave) => {
    const formato = clave
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
    return formato;
  };

  if (!id) return null;

  return (
    <div className="reporte-contenedor">
      {cargando ? (
        <div className="reporte-cargando">Cargando reporte...</div>
      ) : error ? (
        <div className="reporte-error">{error}</div>
      ) : reporte && reporte.evaluaciones ? (
        <>
          <div className="reporte-header">
            <h1 className="reporte-titulo">
              Reporte de {reporte.deportista?.nombre_Completo || "Deportista"}
            </h1>
            <div className="reporte-acciones">
              <button className="reporte-boton" onClick={imprimirReporte}>
                Imprimir
              </button>
              <button className="reporte-boton" onClick={onCerrar}>
                Cerrar
              </button>
            </div>
          </div>

          {/* Información del Deportista */}
          <section className="reporte-seccion">
            <h2 className="reporte-subtitulo">Información del Deportista</h2>
            <div className="reporte-grid">
              <div className="reporte-campo">
                <label>Nombre:</label>
                <span>{reporte.deportista?.nombre_Completo || "N/A"}</span>
              </div>
              <div className="reporte-campo">
                <label>Documento:</label>
                <span>{reporte.deportista?.no_Documento || "N/A"}</span>
              </div>
              <div className="reporte-campo">
                <label>Total de Evaluaciones:</label>
                <span>{reporte.total_evaluaciones}</span>
              </div>
            </div>
          </section>

          {/* Listado de TODAS las evaluaciones */}
          {reporte.evaluaciones.map((ev, index) => (
            <section key={ev.evaluacion_deportiva?.ID_Evaluacion_De || index} className="reporte-seccion">
              <h2 className="reporte-subtitulo">
                Evaluación #{index + 1}  
              </h2>
              
              {/* Información basica de la evaluación */}
              <div className="reporte-grid">
                <div className="reporte-campo">
                  <label>Fecha:</label>
                  <span>
                    {ev.evaluacion_deportiva?.fecha 
                      ? new Date(ev.evaluacion_deportiva.fecha).toLocaleDateString("es-ES")
                      : "N/A"}
                  </span>
                </div>
                <div className="reporte-campo">
                  <label>Resultados:</label>
                  <span>{ev.evaluacion_deportiva?.resultados || "N/A"}</span>
                </div>
                <div className="reporte-campo">
                  <label>Observaciones:</label>
                  <span>{ev.evaluacion_deportiva?.observaciones || "Ninguna"}</span>
                </div>
                <div className="reporte-campo">
                  <label>Entrenador:</label>
                  <span>{ev.entrenador?.nombre_Completo || "N/A"}</span>
                </div>
              </div>

              {/* Evaluación Física */}
              {ev.evaluacion_Fisica && (
                <div className="reporte-subbloque">
                  <h3>📊 Evaluación Física</h3>
                  <div className="reporte-grid">
                    {Object.entries(ev.evaluacion_Fisica).map(([key, value]) => {
                      if (value !== null && value !== undefined && 
                          !['ID_Evaluacion_Fisica', 'ID_Evaluacion_De', 'createdAt', 'updatedAt'].includes(key)) {
                        return (
                          <div key={key} className="reporte-campo">
                            <label>{formatearClaveTecnica(key)}:</label>
                            <span>
                              {typeof value === 'number' ? value.toFixed(2) : String(value)}
                              {key === 'peso' ? ' kg' : ''}
                              {key === 'estatura' ? ' m' : ''}
                              {key === 'tasa_Corporal' ? '%' : ''}
                              {['sprint', 'agilidad'].includes(key) ? ' seg' : ''}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {/* Evaluación Técnica */}
              {ev.evaluacion_Tecnica && (
                <div className="reporte-subbloque">
                  <h3>🏐 Evaluación Técnica</h3>
                  <div className="reporte-grid">
                    {Object.entries(ev.evaluacion_Tecnica).map(([key, value]) => {
                      if (value !== null && value !== undefined && 
                          !['ID_Evaluacion_Tecnica', 'ID_Evaluacion_De', 'createdAt', 'updatedAt'].includes(key)) {
                        return (
                          <div key={key} className="reporte-campo">
                            <label>{formatearClaveTecnica(key)}:</label>
                            <span>{String(value)}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {!ev.evaluacion_Fisica && !ev.evaluacion_Tecnica && (
                <div className="reporte-vacio">
                  No hay datos de evaluación física o técnica para esta evaluación.
                </div>
              )}
            </section>
          ))}
        </>
      ) : (
        <div className="reporte-error">No se pudo cargar el reporte</div>
      )}
    </div>
  );
};

export default ReporteEvaluacion;