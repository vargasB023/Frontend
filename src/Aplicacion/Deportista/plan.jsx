import React from 'react';
import './planDe.css';

const PlanEntrenamiento = () => {
  return (
    <section className="vista">
      <h2 className="titulo">Plan de Entrenamiento</h2>
      <div className="tarjeta">
        <p><strong>Objetivos:</strong> Mejorar la técnica de saque y recepción.</p>
        <p><strong>Duración:</strong> 6 semanas</p>
        <p><strong>Fecha de inicio:</strong> 01/08/2025</p>
        <p><strong>Fecha de fin:</strong> 12/09/2025</p>
      </div>
    </section>
  );
};

export default PlanEntrenamiento;