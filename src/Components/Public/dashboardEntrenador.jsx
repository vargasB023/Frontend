import { useEffect, useState } from "react";
import {
  Home,
  Dumbbell,
  Users,
  CalendarDays,
  ClipboardCheck,
  Bandage,
  UserCheck,
  Bot,
  Eye,
} from "lucide-react";
import "./css/dashboardEntrenador.css";

// 📁 Importación de componentes
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
  const [seccion, setSeccion] = useState("DashEn");
  const [reporteId, setReporteId] = useState(null);
  const [entrenador, setEntrenador] = useState(null);

  // 🔹 Cargar entrenador desde localStorage
  useEffect(() => {
    const entrenadorGuardado = localStorage.getItem("entrenador");

    if (entrenadorGuardado) {
      const entrenadorParseado = JSON.parse(entrenadorGuardado);
      setEntrenador(entrenadorParseado);
      console.log("✅ Entrenador cargado:", entrenadorParseado);
    } else {
      console.warn("⚠️ No se encontró un entrenador en localStorage.");
    }

    // Mostrar inicio por defecto
    setSeccion("DashEn");
  }, []);

  return (
    <div className="dashboard">
      <EncabezadoSimple setSeccion={setSeccion} />

      <div className="dashboard_layout">
        {/* --- MENÚ LATERAL --- */}
        <aside className="sidebar">
          <ul className="sidebar_menu">
            <li
              className={`sidebar_item ${seccion === "DashEn" ? "active" : ""}`}
              onClick={() => setSeccion("DashEn")}
            >
              <Home className="sidebar_icon" />
              <span className="sidebar_text">Inicio</span>
            </li>

            <li
              className={`sidebar_item ${seccion === "planEntrenamiento" ? "active" : ""}`}
              onClick={() => setSeccion("planEntrenamiento")}
            >
              <Dumbbell className="sidebar_icon" />
              <span className="sidebar_text">Plan de entrenamiento</span>
            </li>

            <li
              className={`sidebar_item ${seccion === "lesiones" ? "active" : ""}`}
              onClick={() => setSeccion("lesiones")}
            >
              <Bandage className="sidebar_icon" />
              <span className="sidebar_text">Lesiones</span>
            </li>

            <li
              className={`sidebar_item ${seccion === "equipo" ? "active" : ""}`}
              onClick={() => setSeccion("equipo")}
            >
              <Users className="sidebar_icon" />
              <span className="sidebar_text">Equipo</span>
            </li>

            <li
              className={`sidebar_item ${seccion === "cronograma" ? "active" : ""}`}
              onClick={() => setSeccion("cronograma")}
            >
              <CalendarDays className="sidebar_icon" />
              <span className="sidebar_text">Cronograma</span>
            </li>

            <li
              className={`sidebar_item ${seccion === "evaluacion" ? "active" : ""}`}
              onClick={() => setSeccion("evaluacion")}
            >
              <ClipboardCheck className="sidebar_icon" />
              <span className="sidebar_text">Evaluación Deportiva</span>
            </li>

            <li
              className={`sidebar_item ${seccion === "asistencia" ? "active" : ""}`}
              onClick={() => setSeccion("asistencia")}
            >
              <UserCheck className="sidebar_icon" />
              <span className="sidebar_text">Asistencia</span>
            </li>

            <li
              className={`sidebar_item ${seccion === "Chatbot" ? "active" : ""}`}
              onClick={() => setSeccion("Chatbot")}
            >
              <Bot className="sidebar_icon" />
              <span className="sidebar_text">Chatbot</span>
            </li>

            <li
              className={`sidebar_item ${seccion === "visionA" ? "active" : ""}`}
              onClick={() => setSeccion("visionA")}
            >
              <Eye className="sidebar_icon" />
              <span className="sidebar_text">Visión Artificial</span>
            </li>
          </ul>
        </aside>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="dashboard_contenido">
          {/* Inicio */}
          {seccion === "DashEn" && (
            entrenador ? (
              <InicioEntrenador ID_Entrenador={entrenador.ID_Entrenador} />
            ) : (
              <p className="mensaje-error">
                ⚠️ No se encontró un entrenador válido.
              </p>
            )
          )}

          {/* Perfil */}
          {seccion === "entrenador" && <PerfilEntrenador />}

          {/* Plan de entrenamiento */}
          {seccion === "planEntrenamiento" && <PlanEntrenamiento />}

          {/* Equipo */}
          {seccion === "equipo" && <Equipo />}

          {/* Asistencia */}
          {seccion === "asistencia" && <Asistencia />}

          {/* Lesiones */}
          {seccion === "lesiones" && <LesionesView />}

          {/* Cronograma */}
          {seccion === "cronograma" && <Cronograma />}

          {/* Chatbot */}
          {seccion === "Chatbot" && <Ia />}

          {/* Visión Artificial */}
          {seccion === "visionA" && <ExerciseChecker />}

          {/* Evaluaciones */}
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
