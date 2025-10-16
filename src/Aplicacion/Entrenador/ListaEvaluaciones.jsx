import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Components/Public/css/ListaEvaluaciones.css";
import ReporteEvaluacion from "./ReporteEvaluacion";
import Evaluacion_Deportiva from "./evaluacionDeportiva";

const ListaEvaluaciones = () => {
  const [deportistas, setDeportistas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [reporteId, setReporteId] = useState(null);
  const [mostrarModalEvaluacion, setMostrarModalEvaluacion] = useState(false);

  const navigate = useNavigate();
  const entrenador = JSON.parse(localStorage.getItem("entrenador") || "{}");

  useEffect(() => {
    if (entrenador.ID_Entrenador) {
      cargarDeportistas();
    }
  }, [entrenador.ID_Entrenador]);

  const cargarDeportistas = async () => {
    try {
      setCargando(true);
      const res = await axios.get(
        `https://backend-5gwv.onrender.com/api/evaluacion/entrenador/${entrenador.ID_Entrenador}/deportistas`
      );
      setDeportistas(res.data || []);
      setError("");
    } catch (error) {
      console.error("Error al cargar deportistas:", error);
      setError("Error al cargar los deportistas");
    } finally {
      setCargando(false);
    }
  };

  const verReporte = (idEvaluacion) => {
    setReporteId(idEvaluacion);
  };

  const cerrarModal = () => {
    setReporteId(null);
  };

  const abrirModalEvaluacion = () => {
    setMostrarModalEvaluacion(true);
  };

  const cerrarModalEvaluacion = () => {
    setMostrarModalEvaluacion(false);
    cargarDeportistas();
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  if (!entrenador.ID_Entrenador) {
    return (
      <div className="lista-eval-contenedor">
        <div className="lista-eval-error">
          No se encontraron datos del entrenador. Por favor, inicie sesión.
        </div>
      </div>
    );
  }

  return (
    <div className="lista-eval-contenedor">
      <div className="lista-eval-header">
        <h1 className="lista-eval-titulo">Mis Deportistas Evaluados</h1>
        <button
          className="lista-eval-boton-primario"
          onClick={abrirModalEvaluacion}
        >
          Registrar Evaluación
        </button>
      </div>

      {error && <div className="lista-eval-error">{error}</div>}

      {cargando ? (
        <div className="lista-eval-cargando">Cargando deportistas...</div>
      ) : (
        <>
          <div className="lista-eval-info">
            Mostrando {deportistas.length} deportista(s) evaluado(s)
          </div>

          <div className="lista-eval-tabla-contenedor">
            <table className="lista-eval-tabla">
              <thead>
                <tr>
                  <th>Deportista</th>
                  <th>Última Evaluación</th>
                  <th>Tipo</th>
                  <th>Resultados</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {deportistas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="lista-eval-vacio">
                      No hay deportistas evaluados
                    </td>
                  </tr>
                ) : (
                  deportistas.map((evaluacion) => (
                    <tr
                      key={`${evaluacion.ID_Deportista}-${evaluacion.ID_Evaluacion_De}`}
                    >
                      <td>{evaluacion.deportista?.nombre_Completo || "N/A"}</td>
                      <td>{formatearFecha(evaluacion.fecha)}</td>
                      <td>
                        <span
                          className={`lista-eval-tipo ${evaluacion.tipo_Evaluacion?.toLowerCase()}`}
                        >
                          {evaluacion.tipo_Evaluacion}
                        </span>
                      </td>
                      <td className="lista-eval-resultados">
                        {evaluacion.resultados}
                      </td>
                      <td>
                        <button
                          className="lista-eval-boton-secundario"
                          onClick={() =>
                            verReporte(evaluacion.ID_Evaluacion_De)
                          }
                          title="Ver reporte completo con todas las evaluaciones"
                        >
                          Ver Reporte Completo
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal para el formulario de evaluación */}
      {mostrarModalEvaluacion && (
        <div className="modal-overlay">
          <div className="modal-contenido modal-grande">
            <div className="modal-header">
              <h2>Registrar Nueva Evaluación</h2>
              <button 
                className="btn-cerrar-modal"
                onClick={cerrarModalEvaluacion}
              >
                ✕
              </button>
            </div>
            <Evaluacion_Deportiva 
              onEvaluacionRegistrada={cerrarModalEvaluacion}
              modoModal={true}
            />
          </div>
        </div>
      )}

      {/* Modal del reporte */}
      {reporteId && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <ReporteEvaluacion id={reporteId} onCerrar={cerrarModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaEvaluaciones;