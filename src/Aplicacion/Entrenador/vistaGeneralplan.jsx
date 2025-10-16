import React, { useState } from "react";
import "../../Components/Public/css/vistaGeneralPlan.css";
import CrearMicrociclo from "./microciclo";
import CrearPlanEntrenamiento from "./Plan";
import CrearEjercicio from "./ejercicio";
import CrearSesion from "./sesion";

const VistaGeneralPlan = () => {
  const [activeTab, setActiveTab] = useState("ejercicios");
  const [mostrarFormulario, setMostrarFormulario] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMostrarFormulario(null); // 👈 Al cambiar de pestaña, cierra cualquier formulario abierto
  };

  const handleCreateClick = () => {
    switch (activeTab) {
      case "ejercicios":
        setMostrarFormulario("ejercicio");
        break;
      case "sesiones":
        setMostrarFormulario("sesion");
        break;
      case "microciclos":
        setMostrarFormulario("microciclo");
        break;
      case "plan":
        setMostrarFormulario("plan");
        break;
      default:
        setMostrarFormulario(null);
        break;
    }
  };

  const handleCloseFormulario = () => setMostrarFormulario(null);

  const getCreateButtonText = () => {
    switch (activeTab) {
      case "ejercicios":
        return "Crear Ejercicio";
      case "sesiones":
        return "Crear Sesión";
      case "microciclos":
        return "Crear Microciclo";
      case "plan":
        return "Crear Plan";
      default:
        return "Crear";
    }
  };

  if (loading) return <div className="loading">Cargando datos...</div>;

  return (
    <div className="vista-general-container">
      {/* 🔹 Barra de navegación siempre visible */}
      <div className="header">
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "ejercicios" ? "active" : ""}`}
            onClick={() => handleTabClick("ejercicios")}
          >
            Ejercicios
          </button>
          <button
            className={`tab-button ${activeTab === "sesiones" ? "active" : ""}`}
            onClick={() => handleTabClick("sesiones")}
          >
            Sesiones
          </button>
          <button
            className={`tab-button ${activeTab === "microciclos" ? "active" : ""}`}
            onClick={() => handleTabClick("microciclos")}
          >
            Microciclos
          </button>
          <button
            className={`tab-button ${activeTab === "plan" ? "active" : ""}`}
            onClick={() => handleTabClick("plan")}
          >
            Planes de Entrenamiento
          </button>
        </nav>

        {/* 🔹 Botón de crear (también siempre visible) */}
        <button className="create-button" onClick={handleCreateClick}>
          {getCreateButtonText()}
        </button>
      </div>

      {/* 🔹 Contenido principal debajo del encabezado */}
      <div className="content">
        {mostrarFormulario ? (
          <div className="form-container">
            {mostrarFormulario === "ejercicio" && (
              <CrearEjercicio onClose={handleCloseFormulario} />
            )}
            {mostrarFormulario === "sesion" && (
              <CrearSesion onClose={handleCloseFormulario} />
            )}
            {mostrarFormulario === "microciclo" && (
              <CrearMicrociclo onClose={handleCloseFormulario} />
            )}
            {mostrarFormulario === "plan" && (
              <CrearPlanEntrenamiento onClose={handleCloseFormulario} />
            )}
          </div>
        ) : (
          <h2 style={{ textAlign: "center", marginTop: "40px", color: "#333" }}>
            {activeTab === "ejercicios" && "Gestión de Ejercicios"}
            {activeTab === "sesiones" && "Gestión de Sesiones"}
            {activeTab === "microciclos" && "Gestión de Microciclos"}
            {activeTab === "plan" && "Gestión de Planes de Entrenamiento"}
          </h2>
        )}
      </div>
    </div>
  );
};

export default VistaGeneralPlan;
