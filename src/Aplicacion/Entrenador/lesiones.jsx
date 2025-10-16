import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../Components/Public/css/lesiones.css";
import FormularioLesionesDespues from "./formularioLesionesDespues";

const entrenadorGuardado = localStorage.getItem("entrenador");
const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

const LesionesView = () => {
  const [deportistas, setDeportistas] = useState([]);
  const [deportistasFiltrados, setDeportistasFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistroMenuOpen, setisRegistroMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDeportistas = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://backend-5gwv.onrender.com/api/deportista/lesionados`
        );
        setDeportistas(res.data);
      } catch (error) {
        console.error("Error al obtener deportistas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (entrenador) fetchDeportistas();
  }, []);

  useEffect(() => {
    if (location.state?.recargar) {
      setDeportistas();
    }
  }, [location.state]);

  const handleBuscar = () => {
    if (!busqueda.trim()) {
      setDeportistasFiltrados([]);
      return;
    }

    const resultados = deportistas.filter((d) =>
      d.no_Documento?.toString().includes(busqueda.trim())
    );
    setDeportistasFiltrados(resultados);
  };

  const verDetalles = async (id) => {
    try {
      const res = await axios.get(
        `https://backend-5gwv.onrender.com/api/deportista/lesiones/${id}`
      );
      setSeleccionado(res.data);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
    }
  };

  return (

    
    <div className="lesV_contenedor">

      {isRegistroMenuOpen ? <FormularioLesionesDespues  setisRegistroMenuOpen={setisRegistroMenuOpen} /> : (
        <>
      {/* Encabezado con botón */}
      <div className="lesV_encabezado">
        <h2 className="lesV_titulo">Lesiones</h2>
        <button
          className="lesV_boton_registro"
          onClick={() => setisRegistroMenuOpen(true)}
        >
          Registrar Lesión Después
        </button>
      </div>

      {/* Buscador */}
      <div className="lesV_busqueda_contenedor">
        <input
          type="text"
          placeholder="Buscar por número de cédula..."
          className="lesV_buscador"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="lesV_boton_buscar" onClick={handleBuscar}>
          Buscar
        </button>
      </div>

      {loading ? (
        <p>Cargando deportistas...</p>
      ) : (
        <ul className="lesV_lista_deportistas">
          {(deportistasFiltrados.length > 0
            ? deportistasFiltrados
            : deportistas
          ).map((dep, index) => (
            <li key={index} className="lesV_item_deportista lesionado">
              <div className="lesV_card_deportista">
                <strong>Nombre:</strong> {dep.nombre_Completo} <br />
                <strong>Cédula:</strong> {dep.no_Documento} <br />
                <strong>EPS:</strong> {dep.eps} <br />
                <strong>Tipo de sangre:</strong> {dep.tipo_De_Sangre} <br />
                <strong>Alergias:</strong> {dep.alergias || "Ninguna"}
              </div>

              <button
                className="lesV_boton_ver"
                onClick={() => verDetalles(dep.ID_Deportista)}
              >
                Ver Lesiones
              </button>
              {seleccionado?.ID_Deportista === dep.ID_Deportista && (
                <div className="lesV_detalles">
                  <div className="lesV_tarjeta_lesion">
                    <h4>Lesiones Después</h4>
                    {seleccionado.h_lesiones_despues?.length > 0 ? (
                      <div className="lesV_grid">
                        {seleccionado.h_lesiones_despues.map((lesion, i) => (
                          <div key={i} className="lesV_card">
                            <h5>Lesión #{i + 1}</h5>
                            <p>
                              <strong>Fecha Lesión:</strong>{" "}
                              {lesion.fecha_lesion}
                            </p>
                            <p>
                              <strong>Tipo de Lesión:</strong>{" "}
                              {lesion.tipo_de_lesion_producida}
                            </p>
                            <p>
                              <strong>Detalles:</strong>{" "}
                              {lesion.detalles_lesion}
                            </p>
                            <p>
                              <strong>Evento:</strong>{" "}
                              {lesion.tipo_evento_producido}
                            </p>
                            <p>
                              <strong>Gravedad:</strong> {lesion.gravedad}
                            </p>
                            <p>
                              <strong>Dolor/Molestia:</strong>{" "}
                              {lesion.dolor_molestia}
                            </p>
                            <p>
                              <strong>Primeros Auxilios:</strong>{" "}
                              {lesion.primeros_auxilios}
                            </p>
                            <p>
                              <strong>Traslado a Centro Médico:</strong>{" "}
                              {lesion.traslado_centro_medico}
                            </p>
                            <p>
                              <strong>Tratamiento Registro Médico:</strong>{" "}
                              {lesion.tratamiento_registro_medico}
                            </p>
                            <p>
                              <strong>Tiempo Fuera:</strong>{" "}
                              {lesion.tiempo_fuera}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No tiene registros en Lesiones Después</p>
                    )}
                  </div>

                  {/* Lesiones Antes */}
                  <div className="lesV_tarjeta_lesion">
                    <h4>Lesiones Antes</h4>
                    {seleccionado.h_lesiones_antes?.length > 0 ? (
                      <div className="lesV_grid">
                        {seleccionado.h_lesiones_antes.map((lesion, i) => (
                          <div key={i} className="lesV_card">
                            <h5>Lesión #{i + 1}</h5>
                            <p>
                              <strong>Añadir Lesión Antes:</strong>{" "}
                              {lesion.añadir_Lesion_Antes}
                            </p>
                            <p>
                              <strong>Fecha:</strong> {lesion.fecha}
                            </p>
                            <p>
                              <strong>Detalles:</strong>{" "}
                              {lesion.detalles_Lesion}
                            </p>
                            <p>
                              <strong>Tiempo Fuera Competencia:</strong>{" "}
                              {lesion.tiempo_Fuera_Competencia}
                            </p>
                            <p>
                              <strong>Gravedad:</strong> {lesion.gravedad}
                            </p>
                            <p>
                              <strong>Recaídas:</strong> {lesion.recaidas}
                            </p>
                            <p>
                              <strong>Lesiones Fuera:</strong>{" "}
                              {lesion.lesiones_Fuera}
                            </p>
                            <p>
                              <strong>Dolor/Molestia:</strong>{" "}
                              {lesion.dolor_Molestia}
                            </p>
                            <p>
                              <strong>Cirugías:</strong> {lesion.cirugias}
                            </p>
                            <p>
                              <strong>Posición:</strong> {lesion.posicion}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No tiene registros en Lesiones Antes</p>
                    )}
                  </div>

                  <button
                    className="lesV_boton_registro lesV_boton_cancelar"
                    onClick={() => setSeleccionado(null)}
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      </>)}

      
    </div>
  );
};

export default LesionesView;
