import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Components/Public/css/lesionesDepo.css"; 
import FormularioLesiones from "./formularioLesiones";

const deportistaGuardado = localStorage.getItem("deportista");
const deportista = deportistaGuardado ? JSON.parse(deportistaGuardado) : null;

const LesionesDeportistaView = () => {
  const [lesiones, setLesiones] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistroAntesOpen, setIsRegistroAntesOpen] = useState(false);

  useEffect(() => {
    const fetchLesiones = async () => {
      if (!deportista) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `https://backend-5gwv.onrender.com/api/deportista/lesiones/${deportista.ID_Deportista}`
        );
        setLesiones(res.data);
      } catch (error) {
        console.error("Error al obtener lesiones del deportista:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesiones();
  }, []);

  if (!deportista) return <p>No se encontró información del deportista.</p>;

  return (
    <div className="lesVD_contenedor">

      {/* Encabezado con título y botón alineados */}
      <div className="lesVD_encabezado_card">
        <h2 className="lesVD_titulo">Mis Lesiones</h2>
        <button
          className="lesVD_boton_agregar"
          onClick={() => setIsRegistroAntesOpen(true)}
        >
          Añadir Lesión Antes
        </button>
      </div>

      {/* Modal / Formulario */}
      {isRegistroAntesOpen && (
        <FormularioLesiones
          setIsRegistroAntesOpen={setIsRegistroAntesOpen}
          actualizarLesiones={async () => {
            try {
              setLoading(true);
              const res = await axios.get(
                `https://backend-5gwv.onrender.com/api/deportista/lesiones/${deportista.ID_Deportista}`
              );
              setLesiones(res.data);
            } catch (error) {
              console.error("Error al actualizar lesiones:", error);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        lesiones && (
          <div className="lesVD_detalles">

            {/* Lesiones Después */}
            <div className="lesVD_tarjeta_lesion">
              <h4>Lesiones Después</h4>
              {lesiones.h_lesiones_despues?.length > 0 ? (
                <div className="lesVD_grid">
                  {lesiones.h_lesiones_despues.map((lesion, i) => (
                    <div key={i} className="lesVD_card">
                      <h5>Lesión #{i + 1}</h5>
                      <p><strong>Fecha Lesión:</strong> {lesion.fecha_lesion}</p>
                      <p><strong>Tipo de Lesión:</strong> {lesion.tipo_de_lesion_producida}</p>
                      <p><strong>Detalles:</strong> {lesion.detalles_lesion}</p>
                      <p><strong>Evento:</strong> {lesion.tipo_evento_producido}</p>
                      <p><strong>Gravedad:</strong> {lesion.gravedad}</p>
                      <p><strong>Dolor/Molestia:</strong> {lesion.dolor_molestia}</p>
                      <p><strong>Primeros Auxilios:</strong> {lesion.primeros_auxilios}</p>
                      <p><strong>Traslado a Centro Médico:</strong> {lesion.traslado_centro_medico}</p>
                      <p><strong>Tratamiento Registro Médico:</strong> {lesion.tratamiento_registro_medico}</p>
                      <p><strong>Tiempo Fuera:</strong> {lesion.tiempo_fuera}</p>
                    </div>
                  ))}
                </div>
              ) : <p>No tiene registros en Lesiones Después</p>}
            </div>

            {/* Lesiones Antes */}
            <div className="lesVD_tarjeta_lesion">
              <h4>Lesiones Antes</h4>
              {lesiones.h_lesiones_antes?.length > 0 ? (
                <div className="lesVD_grid">
                  {lesiones.h_lesiones_antes.map((lesion, i) => (
                    <div key={i} className="lesVD_card">
                      <h5>Lesión #{i + 1}</h5>
                      <p><strong>Añadir Lesión Antes:</strong> {lesion.añadir_Lesion_Antes}</p>
                      <p><strong>Fecha:</strong> {lesion.fecha}</p>
                      <p><strong>Detalles:</strong> {lesion.detalles_Lesion}</p>
                      <p><strong>Tiempo Fuera Competencia:</strong> {lesion.tiempo_Fuera_Competencia}</p>
                      <p><strong>Gravedad:</strong> {lesion.gravedad}</p>
                      <p><strong>Recaídas:</strong> {lesion.recaidas}</p>
                      <p><strong>Lesiones Fuera:</strong> {lesion.lesiones_Fuera}</p>
                      <p><strong>Dolor/Molestia:</strong> {lesion.dolor_Molestia}</p>
                      <p><strong>Cirugías:</strong> {lesion.cirugias}</p>
                      <p><strong>Posición:</strong> {lesion.posicion}</p>
                    </div>
                  ))}
                </div>
              ) : <p>No tiene registros en Lesiones Antes</p>}
            </div>

          </div>
        )
      )}
    </div>
  );
};

export default LesionesDeportistaView;
