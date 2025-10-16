import React, { useState, useEffect} from "react";
import axios from "axios";
import Ejercicio from '../Entrenador/ejercicio'
import Sesion from '../Entrenador/sesion'
import Microciclo from "./microciclo";
import Plan from './Plan'


export default function plan_EntrenanmientoRegistro() {

  
  const [ejercicios, setEjercicios] = useState([]);

  
  const [sesiones, setSesiones] = useState([]);
 
  const obtenerSesiones = async () => {
    try {
      const { data } = await axios.get('https://backend-5gwv.onrender.com/api/sesion');
      setSesiones(data);
    } catch (err) {
      console.error('Error al obtener sesiones:', err);
    }
  };

  return (
    <>
      <Ejercicio ejercicios={ejercicios} setEjercicios={setEjercicios}/>
      <Sesion ejercicios={ejercicios} setEjercicios={setEjercicios} obtenerSesiones={obtenerSesiones}/>
      <Microciclo  sesiones={sesiones} obtenerSesiones={obtenerSesiones}/>
      <Plan/>

    </>
  )
}