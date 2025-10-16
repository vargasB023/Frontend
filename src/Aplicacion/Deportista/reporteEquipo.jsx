import { useEffect, useState } from "react";
import axios from "axios";
import "../../Components/Public/css/reporteEquipoDep.css";

export default function ReporteEquipoDeportista() {
  const [deportista, setDeportista] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [integrantes, setIntegrantes] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("deportista");
    if (!raw) return;

    const dep = JSON.parse(raw);
    setDeportista(dep);

    axios
      .get(`http://localhost:3000/api/deportista/${dep.ID_Deportista}`)
      .then((res) => {
        if (res.data?.equipo && res.data.equipo.length > 0) {
          const eq = res.data.equipo[0];
          setEquipo(eq);

          axios
            .get(`http://localhost:3000/api/equipo/${eq.ID_Equipo}`)
            .then((resp) => setIntegrantes(resp.data.deportista ?? []))
            .catch(() => alert("Error al cargar integrantes"));
        }
      })
      .catch(() => alert("Error al cargar datos del deportista"));
  }, []);

  if (!equipo) {
    return (
      <p style={{ padding: 20 }}>
        ⚠️ No estás asignado a ningún equipo activo.
      </p>
    );
  }

  return (
    <div className="Rep-contenedor">
      {/* Info del equipo */}
      <div className="Rep-card-equipo">
        <img
          src={equipo.foto_Equipo || "/default-team.png"}
          alt="Foto equipo"
          className="Rep-foto-equipo"
        />
        <div className="Rep-info-equipo">
          <h2>{equipo.nombre_Equipo}</h2>
          <p>Categoría: {equipo.categoria}</p>
          <p>
            Liga: {equipo.liga}, Estado: {equipo.estado_Equipo}
          </p>
        </div>
      </div>

      {/* Integrantes */}
      <div className="Rep-seccion-integrantes">
        <h3>Integrantes del Equipo</h3>
        <table className="Rep-tabla-integrantes">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Posición</th>
              <th>Número</th>
            </tr>
          </thead>
          <tbody>
            {integrantes.map((dep) => (
              <tr key={dep.ID_Deportista}>
                <td>{dep.nombre_Completo}</td>
                <td>{dep.posicion}</td>
                <td>{dep.dorsal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
