import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaCalendarAlt, FaSearch } from "react-icons/fa";
import "../../Components/Public/css/reporteAsistencia.css";

const entrenadorGuardado = localStorage.getItem("entrenador");
const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

const ReporteAsistenciaEntrenador = () => {
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
  const [equipoDatos, setEquipoDatos] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Traer equipos del entrenador
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await axios.get(
          `https://backend-5gwv.onrender.com/api/equipo/entrenador/${entrenador?.ID_Entrenador}`
        );
        setEquipos(res.data);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
      }
    };
    if (entrenador?.ID_Entrenador) fetchEquipos();
  }, []);

  // 🔹 Buscar asistencias del equipo
  const handleBuscar = async () => {
    if (!equipoSeleccionado) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://backend-5gwv.onrender.com/api/asistencia/equipo/${equipoSeleccionado}`
      );
      setEquipoDatos(res.data);
    } catch (error) {
      console.error("Error al cargar asistencias:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Agrupar y ordenar asistencias por evento
  const agruparPorEvento = (equipoDatos) => {
    const hoy = new Date().toISOString().split("T")[0]; // fecha actual YYYY-MM-DD
    const eventos = {};

    equipoDatos.deportista.forEach((depor) => {
      depor.asistencia.forEach((asis) => {
        if (!asis.cronograma) return;

        const eventoId = asis.cronograma.ID_Cronograma;
        if (!eventos[eventoId]) {
          eventos[eventoId] = {
            nombre: asis.cronograma.nombre_Evento,
            fecha: asis.cronograma.fecha,
            deportistas: [],
          };
        }

        eventos[eventoId].deportistas.push({
          nombre: depor.Nombre_Completo,
          estado: asis.estado,
          observaciones: asis.observaciones || "-",
        });
      });
    });

    // 🔹 Convertir a array y ordenar por fecha descendente
    let listaEventos = Object.values(eventos).sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    // 🔹 Poner primero los del día actual si existen
    const hoyEventos = listaEventos.filter((e) => e.fecha === hoy);
    const otrosEventos = listaEventos.filter((e) => e.fecha !== hoy);

    return [...hoyEventos, ...otrosEventos];
  };

  return (
    <div className="repAsisEn contenedor">
      <h2 className="repAsisEn titulo">
        <FaUsers /> Reporte de Asistencia
      </h2>

      {/* 🔹 Selector de equipo */}
      <div className="repAsisEn buscador">
        <select
          className="repAsisEn selector"
          value={equipoSeleccionado}
          onChange={(e) => setEquipoSeleccionado(e.target.value)}
        >
          <option value="">Seleccione un equipo</option>
          {equipos.map((eq) => (
            <option key={eq.ID_Equipo} value={eq.ID_Equipo}>
              {eq.nombre_Equipo} ({eq.categoria} - {eq.liga})
            </option>
          ))}
        </select>

        <button className="repAsisEn boton" onClick={handleBuscar}>
          <FaSearch /> Buscar
        </button>
      </div>

      {/* 🔹 Contenedor resultados */}
      {loading && <p className="repAsisEn cargando">Cargando...</p>}
      {equipoDatos && (
        <div className="repAsisEn resultados">
          <h3 className="repAsisEn subtitulo">
            <FaCalendarAlt /> {equipoDatos.nombre_Equipo}
          </h3>
          <p className="repAsisEn descripcion">
            Categoría: {equipoDatos.categoria} | Liga: {equipoDatos.liga}
          </p>

          <div className="repAsisEn gridEventos">
            {agruparPorEvento(equipoDatos).map((evento, idx) => (
              <div key={idx} className="repAsisEn cardEvento">
                <h4 className="repAsisEn eventoTitulo">
                  📅 {evento.fecha} - {evento.nombre}
                  {evento.fecha === new Date().toISOString().split("T")[0] && (
                    <span className="repAsisEn etiquetaHoy"> (Hoy)</span>
                  )}
                </h4>
                <table className="repAsisEn tabla">
                  <thead>
                    <tr>
                      <th>Deportista</th>
                      <th>Estado</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evento.deportistas.map((dep, i) => (
                      <tr key={i}>
                        <td>{dep.nombre}</td>
                        <td>{dep.estado}</td>
                        <td>{dep.observaciones}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteAsistenciaEntrenador;
