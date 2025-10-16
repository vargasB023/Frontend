import React, { useEffect, useState } from "react";
import axios from "axios"; // 👉 npm install axios
import { Eye, Edit2, Trash2 } from "lucide-react"; // 👉 npm install lucide-react
import "../../Components/Public/css/Deportistas.css";


export default function ListaDeportistas() {
  const [deportistas, setDeportistas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [detalleActivo, setDetalleActivo] = useState(null);

  const porPagina = 10;
  const API_URL = "https://backend-5gwv.onrender.com/api/deportista";

  useEffect(() => {
    const cargarDeportistas = async () => {
      try {
        const { data } = await axios.get(API_URL, {
          headers: { "Content-Type": "application/json" },
        });
        setDeportistas(data);
      } catch (error) {
        console.error("Error al cargar deportistas:", error);
        alert("No se pudieron cargar los deportistas. Verifica el servidor o CORS.");
      }
    };
    cargarDeportistas();
  }, []);

  const deportistasFiltrados = deportistas.filter((d) =>
    d.nombre_Completo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(deportistasFiltrados.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const deportistasPaginados = deportistasFiltrados.slice(
    inicio,
    inicio + porPagina
  );

  const eliminarDeportista = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este deportista?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDeportistas((prev) => prev.filter((d) => d.ID_Deportista !== id));
    } catch (error) {
      console.error("Error al eliminar deportista:", error);
      alert("Error al eliminar deportista.");
    }
  };

  const editarDeportista = async (id) => {
    const nuevoNombre = prompt("Nuevo nombre del deportista:");
    if (!nuevoNombre) return;
    try {
      await axios.put(`${API_URL}/${id}`, { nombre_Completo: nuevoNombre });
      setDeportistas((prev) =>
        prev.map((d) =>
          d.ID_Deportista === id ? { ...d, nombre_Completo: nuevoNombre } : d
        )
      );
    } catch (error) {
      console.error("Error al editar deportista:", error);
      alert("Error al editar deportista.");
    }
  };

  return (
    <div className="contenedor">
      <h1 className="titulo">Lista de Deportistas</h1>
      <input
        className="busqueda"
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Equipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {deportistasPaginados.map((d) => (
            <React.Fragment key={d.ID_Deportista}>
              <tr>
                <td>{d.nombre_Completo}</td>
                <td>{d.no_Documento}</td>
                <td>{d.direccion}</td>
                <td>{d.telefono}</td>
                <td>{d.email}</td>
                <td>{d.Equipo?.nombre_Equipo || "—"}</td>
                <td className="acciones">
                  <button
                    onClick={() =>
                      setDetalleActivo(
                        detalleActivo === d.ID_Deportista ? null : d.ID_Deportista
                      )
                    }
                  >
                    <Eye size={18} />
                  </button>
                  <button onClick={() => editarDeportista(d.ID_Deportista)}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => eliminarDeportista(d.ID_Deportista)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
              {detalleActivo === d.ID_Deportista && (
                <tr className="fila-detalle">
                  <td colSpan="7">
                    <strong>Detalles:</strong>
                    <div>ID: {d.ID_Deportista}</div>
                    <div>Fecha creación: {d.createdAt}</div>
                    <div>Estado: {d.estado || "—"}</div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="paginacion">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPaginaActual(num)}
            className={paginaActual === num ? "activo" : ""}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
