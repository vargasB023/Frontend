import { useState, useEffect } from "react"
import { FaHome, FaRunning } from "react-icons/fa"
import { Bandage, ClipboardCheck, Dumbbell, Home, UserCheck } from "lucide-react"
import Footer from "./footer"
import "../../Components/Public/css/dashDeportista.css"
import Encabezado_Deportista from '../../Components/Public/encabezadoDepo'
import Perfil_Deportista from '../../Aplicacion/Deportista/perfilDeportista'
import ReporteEquipoDeportista from "../../Aplicacion/Deportista/reporteEquipo"
import ReporteAsistenciaDeportista from "../../Aplicacion/Deportista/reporteAsisDepor"
import LesionesDeportistaView from "../../Aplicacion/Deportista/lesionesDepo"
import ReporteEvaluacionesDeportista from "../../Aplicacion/Deportista/evaluaciones"
import PlanEntrenamientoDeportista from "../../Aplicacion/Deportista/PlanEntrenamientoDeportista"

export default function DashboardDeportista() {
  // 🔹 Estado inicial: que empiece en "inicio" (ReporteEquipoDeportista)
  const [seccion, setSeccion] = useState("inicio")

  // 🔹 Si deseas guardar la última sección en localStorage (opcional)
  useEffect(() => {
    const ultimaSeccion = localStorage.getItem("seccionDeportista")
    if (ultimaSeccion) {
      setSeccion(ultimaSeccion)
    } else {
      setSeccion("inicio")
    }
  }, [])

  // 🔹 Guardar sección seleccionada (opcional)
  useEffect(() => {
    localStorage.setItem("seccionDeportista", seccion)
  }, [seccion])

  return (
    <div className="dashboard-deportista">
      <Encabezado_Deportista setSeccion={setSeccion} />

      <div className="estructura-dashboard">
        <aside className="barra-lateral-deportista">
          <ul className="lista-opciones">
            <li className={`opcion-menu ${seccion === "inicio" ? "activo" : ""}`} onClick={() => setSeccion("inicio")}>
              <Home  className="icono-menu" />
              <span>Inicio</span>
            </li>

            <li className={`opcion-menu ${seccion === "Asistencia" ? "activo" : ""}`} onClick={() => setSeccion("Asistencia")}>
              <UserCheck  className="icono-menu" />
              <span>Asistencia</span>
            </li>

            <li className={`opcion-menu ${seccion === "lesionesDe" ? "activo" : ""}`} onClick={() => setSeccion("lesionesDe")}>
              <Bandage className="icono-menu" />
              <span>Lesiones</span>
            </li>

            <li className={`opcion-menu ${seccion === "Evaluaciones" ? "activo" : ""}`} onClick={() => setSeccion("Evaluaciones")}>
              <ClipboardCheck className="icono-menu" />
              <span>Evaluaciones</span>
            </li>

            <li className={`opcion-menu ${seccion === "Plan" ? "activo" : ""}`} onClick={() => setSeccion("Plan")}>
              <Dumbbell className="icono-menu" />
              <span>Plan de entrenamiento</span>
            </li>
          </ul>
        </aside>

        <main className="contenido-deportista">
          {seccion === "inicio" && <ReporteEquipoDeportista />}
          {seccion === "Asistencia" && <ReporteAsistenciaDeportista />}
          {seccion === "lesionesDe" && <LesionesDeportistaView />}
          {seccion === "Evaluaciones" && <ReporteEvaluacionesDeportista />}
          {seccion === "perfil" && <Perfil_Deportista />}
          {seccion === "Plan" && <PlanEntrenamientoDeportista />}
        </main>
      </div>

      <Footer />
    </div>
  )
}
