import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaClipboardList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../Components/Public/css/RepoAsisDe.css";



const ReporteAsistenciaDeportista = () => {
  // 👉 Función para crear la fecha en hora local Bogotá
const parseToBogota = (dateStr, timeStr) => {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);

  // Si hay hora usamos esa, si no, usamos mediodía para evitar corrimientos
  let hours = 12,
    minutes = 0;
  if (timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    hours = h;
    minutes = m || 0;
  }

  // ✅ construimos fecha como local (no UTC)
  return new Date(year, month - 1, day, hours, minutes, 0);
};
  const deportistaGuardado = localStorage.getItem("deportista");
  const deportistaLS = deportistaGuardado ? JSON.parse(deportistaGuardado) : null;

  const [deportista, setDeportista] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!deportistaLS?.ID_Deportista) {
      setCargando(false);
      return;
    }
    let mounted = true;
    axios
      .get(`http://localhost:3000/api/asistencia/deportista/${deportistaLS.ID_Deportista}`)
      .then((res) => {
        if (mounted) setDeportista(res.data);
      })
      .catch((err) => console.error("Error al traer el reporte:", err))
      .finally(() => mounted && setCargando(false));
    return () => (mounted = false);
  }, [deportistaLS?.ID_Deportista]);

  if (cargando) return <p className="repAsisDep-cargando">Cargando reporte...</p>;
  if (!deportista) return <p className="repAsisDep-vacio">No se encontró información</p>;

  return (
    <div className="repAsisDep-contenedor">
      <div className="repAsisDep-header">
        <FaUser className="repAsisDep-iconoUsuario" />
        <h2 className="repAsisDep-nombre">{deportista.Nombre_Completo}</h2>
      </div>

      <h3 className="repAsisDep-titulo">
        <FaClipboardList className="repAsisDep-iconoTitulo" />
        Reporte de Asistencias
      </h3>

      <div className="repAsisDep-lista">
        {deportista.asistencia.map((asis) => {
          // 📌 1️⃣ Convertimos la fecha y hora a un objeto Date en hora Bogotá
          const dt = parseToBogota(asis.cronograma.fecha, asis.cronograma.hora);

          // 📌 2️⃣ Formateamos la fecha + hora usando Intl.DateTimeFormat en Bogotá
          const fechaHora = dt
            ? new Intl.DateTimeFormat("sv-SE", {
                timeZone: "America/Bogota",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(dt)
            : asis.cronograma.fecha || "";

          // 🔍 3️⃣ Console log para verificar que la fecha se está calculando bien
          console.log("Asistencia:", asis.ID_Asistencia, "FechaHora:", fechaHora);

          // 📌 4️⃣ Normalizamos el estado de asistencia para manejar mayúsculas/minúsculas
          const estaPresente = ["presente", "asistio"].includes(asis.estado.toLowerCase());

          return (
            <div key={asis.ID_Asistencia} className="repAsisDep-card">
              <div className="repAsisDep-info">
                <p className="repAsisDep-evento">{asis.cronograma.nombre_Evento}</p>
                <p className="repAsisDep-fecha">{fechaHora}</p>
                {asis.observaciones && (
                  <p className="repAsisDep-observacion">💬 {asis.observaciones}</p>
                )}
              </div>

              <div className="repAsisDep-estado">
                {estaPresente ? (
                  <FaCheckCircle className="repAsisDep-iconoPresente" />
                ) : (
                  <FaTimesCircle className="repAsisDep-iconoAusente" />
                )}
                <span
                  className={`repAsisDep-textoEstado ${
                    estaPresente ? "repAsisDep-textoPresente" : "repAsisDep-textoAusente"
                  }`}
                >
                  {asis.estado}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReporteAsistenciaDeportista;
