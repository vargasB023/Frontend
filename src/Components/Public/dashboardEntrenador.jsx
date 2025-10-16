import { useEffect, useState } from "react";
import {
  FaHome,
  FaExclamationTriangle,
  FaRunning,
  FaCog,
  FaUsers,
  FaCalendarAlt,
  FaClipboardCheck,
  FaBandAid,
  FaUserCheck,
  FaRobot,
  FaEye,
} from "react-icons/fa";
import "./css/dashboardEntrenador.css";

import Equipo from "../../Aplicacion/Equipo/equipo";
import Cronograma from "../../Aplicacion/Entrenador/cronograma";
import Asistencia from "../../Aplicacion/Entrenador/asistencia";
import LesionesView from "../../Aplicacion/Entrenador/lesiones";
import PlanEntrenamiento from "../../Aplicacion/Entrenador/planEntrenamiento";
import Ia from "../../Aplicacion/IA/Ia";
import EncabezadoSimple from "../Public/encabezado";
import Footer from "./footer";
import ListaEvaluaciones from "../../Aplicacion/Entrenador/ListaEvaluaciones";
import InicioEntrenador from "../../Components/Public/InicioEntrenador";
import PerfilEntrenador from "../../Aplicacion/Entrenador/perfilEntrenador";
import ExerciseChecker from "../../Aplicacion/IA/Vision";

export default function DashboardEntrenadorMenu() {
  const [seccion, setSeccion] = useState("entrenador");
  const [reporteId, setReporteId] = useState(null);
  const [entrenador, setEntrenador] = useState(null);

  // 🧠 Cargar entrenador del localStorage
  useEffect(() => {
    const entrenadorGuardado = localStorage.getItem("entrenador");
    if (entrenadorGuardado) {
      const entrenadorParseado = JSON.parse(entrenadorGuardado);
      setEntrenador(entrenadorParseado);
      console.log("✅ Entrenador cargado desde localStorage:", entrenadorParseado);
    } else {
      console.warn("⚠️ No se encontró un entrenador guardado en localStorage.");
    }

    setSeccion("entrenador");
  }, []);

  return (
    <div className="dashboard">
      <EncabezadoSimple setSeccion={setSeccion} />

      <div className="dashboard_layout">
        {/* --- SIDEBAR --- */}
        <aside className="sidebar">
          <ul>
            <li className="texto_sidebar" onClick={() => setSeccion("DashEn")}>
              <FaHome className="sidebar_icon" />
              <span>Inicio</span>
            </li>
            <li className="texto_sidebar" onClick={() => setSeccion("planEntrenamiento")}>
              <FaRunning className="sidebar_icon" />
              <span>Plan de entrenamiento</span>
            </li>
            <li className="texto_sidebar" onClick={() => setSeccion("lesiones")}>
              <FaBandAid className="sidebar_icon" />
              <span>Lesiones</span>
            </li>
            <li className="texto_sidebar" onClick={() => setSeccion("equipo")}>
              <FaUsers className="sidebar_icon" />
              <span>Equipo</span>
            </li>
            <li className="texto_sidebar" onClick={() => setSeccion("cronograma")}>
              <FaCalendarAlt className="sidebar_icon" />
              <span>Cronograma</span>
            </li>
            <li className="texto_sidebar" onClick={() => setSeccion("evaluacion")}>
              <FaClipboardCheck className="sidebar_icon" />
              <span>Evaluación Deportiva</span>
            </li>
            <li className="texto_sidebar" onClick={() => setSeccion("asistencia")}>
              <FaUserCheck className="sidebar_icon" />
              <span>Asistencia</span>
            </li>
            <li className="texto_sidebar" onClick={() => setSeccion("Chatbot")}>
              <FaRobot className="sidebar_icon" />
              <span>Chatbot</span>
            </li>
            <li className="texto_sidebar" onClick={() => setSeccion("visionA")}>
              <FaEye className="sidebar_icon" />
              <span>Visión Artificial</span>
            </li>
          </ul>
        </aside>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="dashboard_contenido">
          {seccion === "DashEn" && entrenador ? (
            <InicioEntrenador ID_Entrenador={entrenador.ID_Entrenador} />
          ) : seccion === "DashEn" ? (
            <p className="mensaje-error">⚠️ No se encontró un entrenador válido.</p>
          ) : null}

          {seccion === "entrenador" && <PerfilEntrenador />}
          {seccion === "planEntrenamiento" && <PlanEntrenamiento />}
          {seccion === "equipo" && <Equipo />}
          {seccion === "asistencia" && <Asistencia />}
          {seccion === "lesiones" && <LesionesView />}
          {seccion === "cronograma" && <Cronograma />}
          {seccion === "Chatbot" && <Ia />}
          {seccion === "visionA" && <ExerciseChecker/>}

          {seccion === "evaluacion" && (
            <div className="evaluacion-layout">
              <div className="evaluacion-lista">
                <ListaEvaluaciones onVerReporte={(id) => setReporteId(id)} />
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
