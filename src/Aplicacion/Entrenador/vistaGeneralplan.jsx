import React, { useState } from "react";
import "../../Components/Public/css/vistaGeneralPlan.css";

// 🔹 Imports de componentes
import FormularioMicrociclo from "./microciclo";
import ListarMicrociclos from "./ListarMicrociclos";

import FormularioPlan from "./Plan";
import ListarPlan from "./ListarPlan"; 

// Ejercicios
import ListadoEjercicio from "./ListadoEjercicio";
import FormularioEjercicio from "./ejercicio";

// Sesiones
import FormularioSesion from "./sesion";
import ListarSesiones from "./ListarSesiones";

const VistaGeneralPlan = () => {
  const [activeTab, setActiveTab] = useState("ejercicios");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Configuración de pestañas principales
  const tabs = [
    { id: "ejercicios", label: "Ejercicios" },
    { id: "sesiones", label: "Sesiones" },
    { id: "microciclos", label: "Microciclos" },
    { id: "plan", label: "Planes de Entrenamiento" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMostrarFormulario(false); // 🔸 Cierra formulario al cambiar de pestaña
  };

  const handleToggleFormulario = () => setMostrarFormulario((prev) => !prev);

  const handleCloseFormulario = () => setMostrarFormulario(false);

  if (loading) return <div className="loading">Cargando datos...</div>;

  return (
    <div className="vista-general-container">
      {/* 🔹 Encabezado con tabs y botón */}
      <div className="header">
        <nav className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button className="create-button" onClick={handleToggleFormulario}>
          {mostrarFormulario ? "Ver Listado" : "Crear"}{" "}
          {activeTab === "plan"
            ? "Plan"
            : activeTab.slice(0, -1).charAt(0).toUpperCase() +
              activeTab.slice(1, -1)}{" "}
        </button>
      </div>

      {/* 🔹 Contenido dinámico */}
      <div className="contentt">
        {/* ======================= FORMULARIOS ======================= */}
        {mostrarFormulario ? (
          <div className="form-container">
            {activeTab === "ejercicios" && (
              <FormularioEjercicio onClose={handleCloseFormulario} />
            )}

            {activeTab === "sesiones" && (
              <FormularioSesion onClose={handleCloseFormulario} />
            )}

            {activeTab === "microciclos" && (
              <FormularioMicrociclo onClose={handleCloseFormulario} />
            )}

            {activeTab === "plan" && (
              <FormularioPlan onClose={handleCloseFormulario} />
            )}
          </div>
        ) : (

          <div className="contenido-listado">
            {activeTab === "ejercicios" && <ListadoEjercicio />}

            {activeTab === "sesiones" && <ListarSesiones />}

            {activeTab === "microciclos" && <ListarMicrociclos />}

            {activeTab === "plan" && (<ListarPlan/> )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaGeneralPlan;
