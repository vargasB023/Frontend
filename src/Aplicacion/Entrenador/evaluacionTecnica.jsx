import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Components/Public/css/evaluaciontecnica.css';

const Evaluacion_Tecnica = ({ evaluacionId }) => {
  const [formulario, setFormulario] = useState({
    ID_Evaluacion_De: evaluacionId || '',
    SAQUE: '',
    potencia_1: '',
    tecnica_1: '',
    consistencia: '',
    dificultad: '',
    RECEPCION: '',
    tecnica_2: '',
    presicion: '',
    control: '',
    desplazamiento: '',
    ATAQUE: '',
    tecnica_3: '',
    potencia_2: '',
    direccion: '',
    colocacion: '',
    variedad_De_Golpes: '',
    BLOQUEO: '',
    DEFENSA: ''
  });

  useEffect(() => {
    if (evaluacionId) {
      setFormulario(prev => ({
        ...prev,
        ID_Evaluacion_De: evaluacionId
      }));
    }
  }, [evaluacionId]);

  const opcionesPuntaje = ['1', '2', '3'];


  const opcionesSaque = ['POTENCIA', 'TECNICA', 'CONSISTENCIA', 'DIFICULTAD'];
  const opcionesRecepcion = ['TECNICA', 'PRESICION', 'CONTROL', 'DESPLAZAMIENTO'];
  const opcionesAtaque = ['TECNICA', 'POTENCIA', 'DIRECCION', 'COLOCACION', 'VARIEDAD DE GOLPES'];

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!formulario.ID_Evaluacion_De) {
      alert('Error: No se ha creado una evaluación deportiva previa.');
      return;
    }

    axios.post('https://backend-5gwv.onrender.com/api/evaluacion_Tecnica', formulario)
      .then(() => {
        alert('Evaluación técnica registrada con éxito.');
        setFormulario({
          ID_Evaluacion_De: evaluacionId || '',
          SAQUE: '',
          potencia_1: '',
          tecnica_1: '',
          consistencia: '',
          dificultad: '',
          RECEPCION: '',
          tecnica_2: '',
          presicion: '',
          control: '',
          desplazamiento: '',
          ATAQUE: '',
          tecnica_3: '',
          potencia_2: '',
          direccion: '',
          colocacion: '',
          variedad_De_Golpes: '',
          BLOQUEO: '',
          DEFENSA: ''
        });
      })
      .catch(err => {
        console.error(err);
        alert('Error al registrar la evaluación técnica');
      });
  };

  if (!evaluacionId) {
    return (
      <div className="evaTec_formulario">
        <h2 className="evaTec_titulo">Evaluación Técnica</h2>
        <p>Primero debe crear una evaluación deportiva de tipo "Técnica".</p>
      </div>
    );
  }

  return (
    <form className="evaTec_formulario" onSubmit={manejarEnvio}>
      <h2 className="evaTec_titulo">Evaluación Técnica</h2>
      <p className="evaTec_mensaje">Califica cada aspecto donde 1 es malo y 3 es bueno.</p>

      <input type="hidden" name="ID_Evaluacion_De" value={formulario.ID_Evaluacion_De} />

      <div className="evaTec_grupo">
        <label className="evaTec_etiqueta">Evaluación Deportiva Actual</label>
        <input
          type="text"
          value={`Evaluación #${formulario.ID_Evaluacion_De} (Técnica)`}
          className="evaTec_input"
          disabled
        />
      </div>

      {/* SAQUE */}
      <h3 className="evaTec_subtitulo">SAQUE</h3>
      <div className="evaTec_grupo">
        <label className="evaTec_etiqueta">Categoría SAQUE:</label>
        <select
          className="evaTec_input"
          name="SAQUE"
          value={formulario.SAQUE}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccione</option>
          {opcionesSaque.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
      </div>
      {['potencia_1', 'tecnica_1', 'consistencia', 'dificultad'].map((campo) => (
        <div key={campo} className="evaTec_grupo">
          <label className="evaTec_etiqueta">{campo.toUpperCase().replace(/_/g, ' ')}:</label>
          <select
            className="evaTec_input"
            name={campo}
            value={formulario[campo]}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione</option>
            {opcionesPuntaje.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      ))}

      {/* RECEPCIÓN */}
      <h3 className="evaTec_subtitulo">RECEPCIÓN</h3>
      <div className="evaTec_grupo">
        <label className="evaTec_etiqueta">Categoría RECEPCIÓN:</label>
        <select
          className="evaTec_input"
          name="RECEPCION"
          value={formulario.RECEPCION}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccione</option>
          {opcionesRecepcion.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
      </div>
      {['tecnica_2', 'presicion', 'control', 'desplazamiento'].map((campo) => (
        <div key={campo} className="evaTec_grupo">
          <label className="evaTec_etiqueta">{campo.toUpperCase().replace(/_/g, ' ')}:</label>
          <select
            className="evaTec_input"
            name={campo}
            value={formulario[campo]}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione</option>
            {opcionesPuntaje.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      ))}

      {/* ATAQUE */}
      <h3 className="evaTec_subtitulo">ATAQUE</h3>
      <div className="evaTec_grupo">
        <label className="evaTec_etiqueta">Categoría ATAQUE:</label>
        <select
          className="evaTec_input"
          name="ATAQUE"
          value={formulario.ATAQUE}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccione</option>
          {opcionesAtaque.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
      </div>
      {['tecnica_3', 'potencia_2', 'direccion', 'colocacion', 'variedad_De_Golpes'].map((campo) => (
        <div key={campo} className="evaTec_grupo">
          <label className="evaTec_etiqueta">{campo.toUpperCase().replace(/_/g, ' ')}:</label>
          <select
            className="evaTec_input"
            name={campo}
            value={formulario[campo]}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione</option>
            {opcionesPuntaje.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      ))}

      {/* BLOQUEO Y DEFENSA */}
      <h3 className="evaTec_subtitulo">BLOQUEO y DEFENSA</h3>
      {['BLOQUEO', 'DEFENSA'].map((campo) => (
        <div key={campo} className="evaTec_grupo">
          <label className="evaTec_etiqueta">{campo}:</label>
          <select
            className="evaTec_input"
            name={campo}
            value={formulario[campo]}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione</option>
            {opcionesPuntaje.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      ))}

      <button type="submit" className="evaTec_boton">Enviar Evaluación Técnica</button>
    </form>
  );
};

export default Evaluacion_Tecnica;

