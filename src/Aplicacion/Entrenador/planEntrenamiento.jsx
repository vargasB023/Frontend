import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaClipboardList, 
    FaBolt, 
    FaDumbbell, 
    FaEye, 
    FaEyeSlash 
} from "react-icons/fa";
import '../../Components/Public/css/planEntrenamiento.css';
import VistaGeneralPlan from './vistaGeneralplan';

const entrenadorGuardado = localStorage.getItem("entrenador");
const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

const PlanEntrenamiento = () => {
    const [planes, setPlanes] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
    const [mostrarPlanes, setMostrarPlanes] = useState(true);

    useEffect(() => {
        obtenerEquipos();
    }, []);

    useEffect(() => {
        if (equipoSeleccionado) {
            fetchPlanesEntrenamiento();
        }
    }, [equipoSeleccionado]);

    const obtenerEquipos = async () => {
        try {
            const res = await axios.get(`https://backend-5gwv.onrender.com/api/equipo/entrenador/${entrenador.ID_Entrenador}`);
            setEquipos(res.data);
        } catch (error) {
            setError("Error al obtener los equipos del entrenador");
        } finally {
            setLoading(false);
        }
    };

    const fetchPlanesEntrenamiento = async () => {
        if (!equipoSeleccionado) return;
        try {
            const response = await fetch(`https://backend-5gwv.onrender.com/api/plan_de_entrenamiento/equipo/${equipoSeleccionado}`);
            if (!response.ok) {
                setPlanes([]);
                return;
            }
            const data = await response.json();
            setPlanes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) =>
        new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

    const formatearHora = (hora) => hora.substring(0, 5);

    const obtenerDiaSemana = (dia) => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[dia] || 'Día no especificado';
    };

    const obtenerClaseEstado = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'EN CURSO': return 'estado en-curso';
            case 'FINALIZADO': return 'estado finalizado';
            case 'PENDIENTE': return 'estado pendiente';
            default: return 'estado';
        }
    };

    const obtenerPorcentajeIntensidad = (intensidad) => {
        switch (intensidad?.toUpperCase()) {
            case 'ALTA': return 100;
            case 'MEDIA': return 60;
            case 'BAJA': return 30;
            default: return 0;
        }
    };

    if (loading) return <p className="loading">Cargando...</p>;

    return (
        <div>
            <div className="plan-container">
                {/* 🔹 Encabezado principal */}
                <div className="plan-banner">
                    <h1><FaClipboardList /> Plan de Entrenamiento</h1>
                    <button 
                        className="toggle-btn"
                        onClick={() => setMostrarPlanes(!mostrarPlanes)}
                    >
                        {mostrarPlanes ? <><FaEyeSlash /> Ocultar</> : <><FaEye /> Mostrar</>}
                    </button>
                </div>

                {/* 🔹 Sección de selección de equipo */}
                <div className="plan-header">
                    <div className="equipo-selector">
                        <p className="texto-seleccion-equipo">
                            Elige el equipo para ver su reporte
                        </p>

                        <label><strong>Equipo:</strong></label>
                        <select 
                            value={equipoSeleccionado} 
                            onChange={(e) => setEquipoSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione un equipo</option>
                            {equipos.map((eq) => (
                                <option key={eq.ID_Equipo} value={eq.ID_Equipo}>
                                    {eq.nombre_Equipo}
                                </option>
                            ))}
                        </select>

                        {equipoSeleccionado && (
                            <p className="texto-reporte-activo">
                                Mostrando reporte de <strong>
                                {equipos.find(eq => eq.ID_Equipo === parseInt(equipoSeleccionado))?.nombre_Equipo}
                                </strong>
                            </p>
                        )}
                    </div>
                </div>

                {/* 🔹 Contenido condicional */}
                {mostrarPlanes && (
                    planes.length === 0 ? (
                        <p className="sin-datos">No hay planes de entrenamiento disponibles.</p>
                    ) : (
                        planes.map((plan) => (
                            <div key={plan.nombre_Plan} className="plan-card">
                                <div className="plan-info">
                                    <p><strong>Nombre:</strong> {plan.nombre_Plan}</p>
                                    <p><strong>Objetivo:</strong> {plan.objetivo}</p>
                                    <p><strong>Duración:</strong> {plan.duracion} Semanas</p>
                                    <p><strong>Inicio:</strong> {formatearFecha(plan.fecha_inicio)}</p>
                                    <p><strong>Fin:</strong> {formatearFecha(plan.fecha_fin)}</p>
                                    <span className={obtenerClaseEstado(plan.estado)}>{plan.estado}</span>
                                </div>

                                <h3 className="subtitulo"><FaClipboardList /> Microciclos</h3>
                                {plan.microciclo.map((mc) => (
                                    <div key={mc.nombre_Microciclo} className="microciclo-card">
                                        <div className="microciclo-header">
                                            <h4>{mc.nombre_Microciclo}</h4>
                                            <span>{formatearFecha(mc.fecha_Inicio)} - {formatearFecha(mc.fecha_Fin)}</span>
                                        </div>
                                        <p>{mc.descripcion}</p>
                                        <p><strong>Objetivos:</strong> {mc.objetivos}</p>

                                        <div className="intensidad">
                                            <p><strong>Intensidad:</strong> {mc.intensidad}</p>
                                            <div className="barra">
                                                <div
                                                    className={`relleno ${mc.intensidad.toLowerCase()}`}
                                                    style={{ width: `${obtenerPorcentajeIntensidad(mc.intensidad)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <h5 className="subtitulo"><FaBolt /> Sesiones</h5>
                                        <div className="sesiones">
                                            {mc.sesion.map((ses) => (
                                                <div key={ses.nombre_Sesion} className="sesion-card">
                                                    <p className="sesion-titulo"><strong>{ses.nombre_Sesion}</strong></p>
                                                    <p><strong>Día:</strong> {obtenerDiaSemana(ses.Rel_Microciclo_Sesion?.dia_Semana)}</p>
                                                    <p><strong>Horario:</strong> {formatearHora(ses.hora_Inicio)} - {formatearHora(ses.hora_Fin)}</p>
                                                    <p><strong>Objetivo:</strong> {ses.objetivo}</p>
                                                    <p className="observacion">{ses.observaciones}</p>

                                                    <h6><FaDumbbell /> Ejercicios</h6>
                                                    <div className="ejercicios-grid">
                                                        {ses.ejercicio.map((ej) => (
                                                            <div key={ej.nombre_Ejer} className="ejercicio-card">
                                                                <div className="ejercicio-header">
                                                                    <span className="ejercicio-nombre">{ej.nombre_Ejer}</span>
                                                                    <span className="ejercicio-tipo">{ej.tipo_Ejer}</span>
                                                                </div>
                                                                <div className="ejercicio-detalles">
                                                                    <p><strong>Duración:</strong> {ej.rel_Ejercicio_Sesion?.duracion_min} min</p>
                                                                    {ej.rel_Ejercicio_Sesion?.series && (
                                                                        <p><strong>Series:</strong> {ej.rel_Ejercicio_Sesion.series} x {ej.rel_Ejercicio_Sesion.repeticiones}</p>
                                                                    )}
                                                                </div>
                                                                <p className="ejercicio-descripcion">{ej.descripcion}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )
                )}
            </div>

            <VistaGeneralPlan/>
        </div>
    );
};

export default PlanEntrenamiento;
