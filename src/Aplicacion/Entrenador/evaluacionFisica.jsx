import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Components/Public/css/evaluacionfisica.css';

const Evaluacion_Fisica = ({ evaluacionId }) => {
  const [formulario, setFormulario] = useState({
    ID_Evaluacion_De: evaluacionId || '',
    peso: '',
    estatura: '',
    imc: '',
    tasa_Corporal: '',
    sprint: '',
    test_Course_Navette: '',
    flexibilidad_Hombro: '',
    agilidad: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  console.log("Evaluacion_Fisica recibió evaluacionId:", evaluacionId);
  
  useEffect(() => {
    console.log("useEffect ejecutándose con evaluacionId:", evaluacionId);
    if (evaluacionId) {
      setFormulario(prev => ({
        ...prev,
        ID_Evaluacion_De: evaluacionId.toString()
      }));
    }
  }, [evaluacionId]);

  // Calcular IMC automáticamente
  useEffect(() => {
    const pesoNum = parseFloat(formulario.peso);
    const estaturaNum = parseFloat(formulario.estatura);

    if (!isNaN(pesoNum) && !isNaN(estaturaNum) && estaturaNum > 0) {
      const imcCalculado = (pesoNum / Math.pow(estaturaNum, 2)).toFixed(2);
      if (formulario.imc !== imcCalculado) {
        setFormulario((prev) => ({ ...prev, imc: imcCalculado }));
      }
    } else {
      if (formulario.imc !== "") {
        setFormulario((prev) => ({ ...prev, imc: "" }));
      }
    }
  }, [formulario.peso, formulario.estatura]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    console.log("📤 Enviando evaluación física con datos:", formulario);

    // Validar que tenemos un ID de evaluación
    if (!formulario.ID_Evaluacion_De) {
      setMensaje('❌ Error: No se ha creado una evaluación deportiva previa.');
      setCargando(false);
      return;
    }

    // Validar campos obligatorios (sin IMC)
    const { peso, estatura, tasa_Corporal, sprint, flexibilidad_Hombro, agilidad } = formulario;
    if (!peso || !estatura || !tasa_Corporal || !sprint || !flexibilidad_Hombro || !agilidad) {
      setMensaje('❌ Por favor complete todos los campos obligatorios.');
      setCargando(false);
      return;
    }

    try {
      const res = await axios.post('https://backend-5gwv.onrender.com/api/evaluacion_Fisica', formulario);
      
      console.log("✅ Respuesta del servidor:", res.data);
      
      if (res.status === 201) {
        setMensaje('✅ Evaluación física registrada con éxito.');
        
        // Limpiar formulario pero mantener el ID
        setFormulario({
          ID_Evaluacion_De: evaluacionId || '',
          peso: '',
          estatura: '',
          imc: '',
          tasa_Corporal: '',
          sprint: '',
          test_Course_Navette: '',
          flexibilidad_Hombro: '',
          agilidad: ''
        });
      }
    } catch (error) {
      console.error('❌ Error al registrar evaluación física:', error);
      
      // Mostrar mensaje de error detallado
      if (error.response) {
        console.error('📋 Respuesta del servidor:', error.response.data);
        
        if (error.response.data.errors) {
          // Mostrar errores de validación del middleware
          const errores = error.response.data.errors.map(err => err.msg).join(', ');
          setMensaje(`❌ Errores de validación: ${errores}`);
        } else {
          setMensaje(`❌ Error: ${error.response.data.error || error.response.data.message || 'Error del servidor'}`);
        }
      } else if (error.request) {
        setMensaje('❌ Error de conexión: No se pudo contactar al servidor');
      } else {
        setMensaje(`❌ Error: ${error.message}`);
      }
    } finally {
      setCargando(false);
    }
  };

  if (!evaluacionId) {
    return (
      <div className="evaDe_formulario">
        <h2 className="evaDe_titulo">Evaluación Física</h2>
        <p className="evaDe_mensaje error">❌ Error: No se recibió el ID de evaluación. Vuelva a intentarlo.</p>
      </div>
    );
  }

  return (
    <form className="evaDe_formulario" onSubmit={manejarEnvio}>
      <h2 className="evaDe_titulo">Evaluación Física</h2>
      
      <input 
        type="hidden" 
        name="ID_Evaluacion_De" 
        value={formulario.ID_Evaluacion_De} 
      />

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">Evaluación Deportiva Actual</label>
        <input
          type="text"
          value={`Evaluación #${formulario.ID_Evaluacion_De} (Física)`}
          className="evaDe_input"
          disabled
        />
      </div>

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">Peso (kg)*</label>
        <input
          type="number"
          step="0.01"
          name="peso"
          value={formulario.peso}
          onChange={manejarCambio}
          className="evaDe_input"
          required
          min="20"
          max="200"
          placeholder="Ej: 70.5"
        />
      </div>

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">Estatura (m)*</label>
        <input
          type="number"
          step="0.01"
          name="estatura"
          value={formulario.estatura}
          onChange={manejarCambio}
          className="evaDe_input"
          required
          min="1.0"
          max="3.0"
          placeholder="Ej: 1.75"
        />
      </div>

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">IMC (automático)</label>
        <input
          type="text"
          name="imc"
          value={formulario.imc}
          className="evaDe_input"
          readOnly
          placeholder="Se calcula automáticamente"
        />
      </div>

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">Tasa Corporal (%)*</label>
        <input
          type="number"
          step="0.01"
          name="tasa_Corporal"
          value={formulario.tasa_Corporal}
          onChange={manejarCambio}
          className="evaDe_input"
          required
          min="5"
          max="50"
          placeholder="Ej: 15.5"
        />
      </div>

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">Sprint (segundos)*</label>
        <input
          type="number"
          step="0.01"
          name="sprint"
          value={formulario.sprint}
          onChange={manejarCambio}
          className="evaDe_input"
          required
          min="3"
          max="15"
          placeholder="Ej: 8.5"
        />
      </div>

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">Test Course Navette (etapas)</label>
        <input
          type="number"
          step="0.1"
          name="test_Course_Navette"
          value={formulario.test_Course_Navette}
          onChange={manejarCambio}
          className="evaDe_input"
          min="0"
          max="30"
          placeholder="Opcional"
        />
      </div>

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">Flexibilidad de Hombro*</label>
        <input
          type="text"
          name="flexibilidad_Hombro"
          value={formulario.flexibilidad_Hombro}
          onChange={manejarCambio}
          className="evaDe_input"
          required
          placeholder="Ej: Buena, Regular, Excelente"
        />
      </div>

      <div className="evaDe_grupo">
        <label className="evaDe_etiqueta">Agilidad (segundos)*</label>
        <input
          type="number"
          step="0.01"
          name="agilidad"
          value={formulario.agilidad}
          onChange={manejarCambio}
          className="evaDe_input"
          required
          min="5"
          max="30"
          placeholder="Ej: 12.3"
        />
      </div>

      <button 
        type="submit" 
        className="evaDe_boton"
        disabled={cargando}
      >
        {cargando ? 'Registrando...' : 'Registrar Evaluación Física'}
      </button>
      
      {mensaje && (
        <p className={`evaDe_mensaje ${mensaje.includes('❌') ? 'error' : 'success'}`}>
          {mensaje}
        </p>
      )}
    </form>
  );
};

export default Evaluacion_Fisica;