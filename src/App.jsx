import { useState } from 'react'
import {Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom'
import FormularioEntrenador from './Aplicacion/Entrenador/entrenador'
import Login from './Aplicacion/Public/inicioSesion'
import Inicio from './Aplicacion/Public/inicioSesionDe'
import Home from './Aplicacion/Public/home'
import  DashboardEntrenador from './Components/Public/dashboardEntrenador'

import Deportista from './Aplicacion/Deportista/deportista'
import FormularioLesiones from './Aplicacion/Deportista/formularioLesiones'
import FormularioLesionesDespues from './Aplicacion/Entrenador/formularioLesionesDespues'
import PlanEntrenamiento from './Aplicacion/Entrenador/planEntrenamiento'
import DashboardDeportista from './Components/Public/dashDeportista'
import Ejercicios from './Aplicacion/Entrenador/ejercicio'
import Microciclo from './Aplicacion/Entrenador/microciclo'
import Cronograma from './Aplicacion/Entrenador/cronograma'

import Evaluacion_Deportiva from './Aplicacion/Entrenador/evaluacionDeportiva'
import Evaluacion_Tecnica from './Aplicacion/Entrenador/evaluacionTecnica'
import Evaluacion_Fisica from './Aplicacion/Entrenador/evaluacionFisica'

import Asistencias from './Aplicacion/Entrenador/asistencia'
import LesionesView from './Aplicacion/Entrenador/lesiones'
import ForgotPassword from './Aplicacion/Public/olvidarContrasena'
import ResetPassword from './Aplicacion/Public/restablecerContrasena'
import ReporteEquipoDeportista from './Aplicacion/Deportista/reporteEquipo'
import ReporteAsistenciaEntrenador from './Aplicacion/Entrenador/reporteAsistencia'
import ReporteAsistenciaDeportista from './Aplicacion/Deportista/reporteAsisDepor'
import LesionesDeportistaView from './Aplicacion/Deportista/lesionesDepo'
import VistaGeneralPlan from './Aplicacion/Entrenador/vistaGeneralplan'
import CronogramaDeportista from './Aplicacion/Deportista/CronogramaDeportista'
import Ejercicio from './Aplicacion/Entrenador/ejercicio'
import CrearEjercicio from './Aplicacion/Entrenador/ejercicio'
import CrearMicrociclo from './Aplicacion/Entrenador/microciclo'
import CrearSesion from './Aplicacion/Entrenador/sesion'
import  Crear_Plan_Entrenamiento from './Aplicacion/Entrenador/Plan'
import InicioEntrenador from './Components/Public/InicioEntrenador'
import ExerciseChecker from './Aplicacion/IA/Vision'

function App() {


  const [user, setUser] = useState(null);
  return (
    <>
    <BrowserRouter>
    <Routes>

      
      <Route path='/' element={<Home/>}> </Route>
      
      <Route path='/entrenador' element={<FormularioEntrenador/>}> </Route>
      <Route path='/deportista' element={<Deportista/>}> </Route>
      
      <Route path='/inicio' element={<Login  setUser={setUser}/>}> </Route>
      <Route path='/inicioD' element={<Inicio  setUser={setUser}/>}> </Route>
      <Route path='/asistencia' element={<Asistencias/>}> </Route>
      <Route path='/olvidarContrasena/:token' element={<ForgotPassword/>}> </Route>
      <Route path="/restablecerContrasena/:token" element={<ResetPassword />} />
      <Route path="/visionA" element={<ExerciseChecker/>} />

      
      <Route path="/ejercicio" element={<CrearEjercicio />} />
       <Route path="/sesion" element={<CrearSesion/>} />
       <Route path="/microciclo" element={<CrearMicrociclo />} />
       <Route path="/plan" element={<Crear_Plan_Entrenamiento />} />
      <Route path='/cronogramaDeportista' element={<CronogramaDeportista/>}> </Route>
      <Route path='/planDepo' element={<PlanEntrenamiento/>}> </Route>
      <Route path='/lesionesDe' element={<LesionesDeportistaView/>}> </Route>
      <Route path='/lesiones' element={<FormularioLesiones/>}> </Route>
      <Route path='/lesion' element={<LesionesView/>}> </Route>
      <Route path='/lesiones_despues' element={<FormularioLesionesDespues/>}> </Route>
      <Route path='/ReporteEquipo' element={<ReporteEquipoDeportista/>}> </Route>
      <Route path='/ReporteAsistencia' element={<ReporteAsistenciaEntrenador/>}> </Route>
      <Route path='/ReporteAsistenciaDeportista' element={<ReporteAsistenciaDeportista/>}> </Route>
      <Route path='/planes' element={<PlanEntrenamiento/>}> </Route>
      <Route path='/visionGeneral' element={<VistaGeneralPlan/>}> </Route>
      <Route element={<ProtectedRotes user={user}/>}> 
      
      <Route path='/dashEntrenador' element={<DashboardEntrenador/>}> </Route>
      <Route path='/dashDeportista' element={<DashboardDeportista/>}> </Route>
      <Route path="/DashEn" element={<InicioEntrenador />} />

      
      <Route path='/evaluacionTecnica' element={<Evaluacion_Tecnica/>}> </Route>
      <Route path='/evaluacion' element={<Evaluacion_Deportiva/>}> </Route>
      <Route path='/evaluacionFisica' element={<Evaluacion_Deportiva/>}> </Route>
      <Route path='/ReporteAsistenciaDeportista' element={<ReporteAsistenciaDeportista/>}> </Route>
      
      </Route>
 
    </Routes>
    </BrowserRouter>
    </>
  )
}

const ProtectedRotes= ( {user, children}) =>{

  if (!user) {
    return <Navigate to="/" />;
  }
  
  return children ? children : <Outlet/>;
}

export default App
