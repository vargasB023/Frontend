import { useState, useEffect } from "react"
import { FaHome, FaHeartbeat, FaRunning, FaUser, FaCog } from "react-icons/fa"
import Footer from "./footer"
import "../../Components/Public/css/dashDeportista.css"
import Encabezado_Deportista from '../../Components/Public/encabezadoDepo'
import Perfil_Deportista from '../../Aplicacion/Deportista/perfilDeportista'
import ReporteEquipoDeportista from "../../Aplicacion/Deportista/reporteEquipo"
import ReporteAsistenciaDeportista from "../../Aplicacion/Deportista/reporteAsisDepor"
import LesionesDeportistaView from "../../Aplicacion/Deportista/lesionesDepo"
import ReporteEvaluacionesDeportista from "../../Aplicacion/Deportista/evaluaciones"

export default function DashboardDeportista() {
  const [seccion, setSeccion] = useState("deportista")

  useEffect(() => {
    setSeccion("deportista")
  }, [])

  return (
    <div className="dashboard-deportista">
      <Encabezado_Deportista setSeccion={setSeccion}/>
      <div className="estructura-dashboard">
        <aside className="barra-lateral-deportista">
          <ul className="lista-opciones">
            <li className="opcion-menu" onClick={() => setSeccion("inicio")}>
              <FaHome className="icono-menu" />
              <span>Inicio</span>
            </li>
            <li className="opcion-menu" onClick={() => setSeccion("Asistencia")}>
              <FaRunning className="icono-menu" />
              <span>Asistencia</span>
            </li>
            <li className="opcion-menu" onClick={() => setSeccion("lesionesDe")}>
              <FaCog className="icono-menu" />
              <span>Lesiones</span>
            </li>

            <li className="opcion-menu" onClick={() => setSeccion("Evaluaciones")}>
              <FaCog className="icono-menu" />
              <span>Evaluaciones</span>
            </li>
 
          </ul>
        </aside>

        <main className="contenido-deportista">
          {seccion === "inicio" &&  <ReporteEquipoDeportista/>}
          {seccion === "Asistencia" && <ReporteAsistenciaDeportista/>}
           {seccion === "lesionesDe" && <LesionesDeportistaView />}
          {seccion === "Evaluaciones" && <ReporteEvaluacionesDeportista />}
          {seccion === "perfil" && <Perfil_Deportista />}
          
        </main>
      </div>

      <Footer />
    </div>
  )
}
