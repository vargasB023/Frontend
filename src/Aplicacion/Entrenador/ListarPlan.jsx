import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Zap } from "lucide-react";
import "../../Components/Public/css/plan.css";

const ListarPlan = () => {
  const entrenadorGuardado = localStorage.getItem("entrenador");
  const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const cargarPlanes = async () => {
      if (!entrenador?.ID_Entrenador) return;
      try {
        const { data } = await axios.get(
          `https://backend-5gwv.onrender.com/api/plan_de_entrenamiento/entrenador/${entrenador.ID_Entrenador}`
        );
        setPlanes(data || []);
      } catch (error) {
        console.error("Error al cargar planes", error);
      }
    };
    cargarPlanes();
  }, [entrenador?.ID_Entrenador]);

  return (
    <section className="pln_listado">
      <h3 className="pln_subtitulo">Planes de Entrenamiento Registrados</h3>
      {planes.length === 0 ? (
        <p>No hay planes registrados.</p>
      ) : (
        <table className="pln_tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Equipo</th>
              <th>Duración</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Microciclos</th>
            </tr>
          </thead>
          <tbody>
            {planes.map((plan) => (
              <tr key={plan.ID_Plan}>
                <td>{plan.nombre_Plan}</td>
                <td>{plan.equipo?.nombre_Equipo || "Sin equipo"}</td>
                <td>{plan.duracion} semanas</td>
                <td>{plan.fecha_Inicio}</td>
                <td>{plan.fecha_fin}</td>
                <td>{plan.estado}</td>
                <td>
                  {plan.microciclo?.length > 0 ? (
                    <details className="pln_detalle_micro">
                      <summary>
                        {plan.microciclo.length} microciclo
                        {plan.microciclo.length > 1 ? "s" : ""}
                      </summary>
                      <ul className="pln_lista_micro">
                        {plan.microciclo.map((micro) => (
                          <li key={micro.ID_Microciclo}>
                            <strong>{micro.nombre_Microciclo}</strong> <br />
                            <Calendar size={12} /> {micro.fecha_Inicio} →{" "}
                            {micro.fecha_Fin} <br />
                            <Zap size={12} /> {micro.intensidad || "No definida"}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    "Sin microciclos"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default ListarPlan;
