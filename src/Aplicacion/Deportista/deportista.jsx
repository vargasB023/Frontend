import React, { useState } from "react";
import axios from "axios";
import "../../Components/Public/css/deportista.css";
import Iniciopagina from "../../Components/Public/inicioHome";
import Footer from "../../Components/Public/footer";
import { useNavigate } from "react-router-dom";

const FormularioDeportista = () => {
  const [datos, setDatos] = useState({
    nombre_Completo: "",
    no_Documento: "",
    fecha_Nacimiento: "",
    genero: "",
    direccion: "",
    telefono: "",
    email: "",
    contrasena: "",
    eps: "",
    posicion: "",
    dorsal: "",
    tipo_De_Sangre: "",
    alergias: "",
    nombre_Contacto: "",
    parentesco_Contacto: "",
    telefono_Contacto: "",
  });

  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setErrores((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const calcularEdad = (fecha) => {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const validar = () => {
    const nuevosErrores = {};
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexNumerico = /^\d+$/;
    const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    const camposObligatorios = [
      "nombre_Completo",
      "no_Documento",
      "fecha_Nacimiento",
      "genero",
      "telefono",
      "email",
      "contrasena",
      "eps",
      "posicion",
      "tipo_De_Sangre",
      "alergias",
      "nombre_Contacto",
      "parentesco_Contacto",
      "telefono_Contacto",
    ];

    camposObligatorios.forEach((campo) => {
      if (!datos[campo] || datos[campo].trim() === "") {
        nuevosErrores[campo] = "Este campo es obligatorio";
      }
    });

    if (datos.no_Documento && !regexNumerico.test(datos.no_Documento)) {
      nuevosErrores.no_Documento = "Debe ser un número válido";
    }

    if (datos.telefono && !regexNumerico.test(datos.telefono)) {
      nuevosErrores.telefono = "Debe contener solo números";
    }

    if (
      datos.telefono_Contacto &&
      !regexNumerico.test(datos.telefono_Contacto)
    ) {
      nuevosErrores.telefono_Contacto = "Debe contener solo números";
    }

    if (datos.fecha_Nacimiento) {
      const edad = calcularEdad(datos.fecha_Nacimiento);
      if (edad < 4 || edad > 80) {
        nuevosErrores.fecha_Nacimiento = "La edad debe estar entre 4 y 80 años";
      }
    }

    if (datos.email && !regexCorreo.test(datos.email)) {
      nuevosErrores.email = "Formato de correo no válido";
    }

    if (datos.contrasena && !regexContrasena.test(datos.contrasena)) {
      nuevosErrores.contrasena =
        "Debe tener mayúscula, minúscula, número y símbolo";
    }

    if (
      datos.dorsal &&
      (!regexNumerico.test(datos.dorsal) || datos.dorsal.length > 3)
    ) {
      nuevosErrores.dorsal = "Debe ser un número de hasta 3 dígitos";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      await axios.post(
        "https://backend-5gwv.onrender.com/api/deportista",
        datos
      );
      alert("Deportista registrado con éxito");
      navigate("/inicioD");
    } catch (error) {
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg;
        });
        setErrores(backendErrors);
      } else {
        alert("Error al registrar. Intenta más tarde.");
      }
    }
  };
  return (
    <div>
      <Iniciopagina />
      <main className="contenedor_formulario_deportista">
        <h2 className="titulo_formulario_deportista">Registro de Deportista</h2>
        <form
          className="formulario_deportista"
          onSubmit={handleSubmit}
          noValidate
        >
          {[
            {
              label: "Nombre completo*",
              name: "nombre_Completo",
              type: "text",
            },
            { label: "Documento*", name: "no_Documento", type: "text" },
            {
              label: "Fecha de nacimiento*",
              name: "fecha_Nacimiento",
              type: "date",
            },
            { label: "Dirección", name: "direccion", type: "text" },
            { label: "Teléfono*", name: "telefono", type: "text" },
            { label: "Correo electrónico*", name: "email", type: "email" },
            { label: "Contraseña*", name: "contrasena", type: "password" },
            { label: "EPS*", name: "eps", type: "text" },
            { label: "Dorsal", name: "dorsal", type: "text" },
            { label: "Alergias*", name: "alergias", type: "text" },
          ].map((campo) => (
            <div key={campo.name}>
              <label className="etiqueta-reg">{campo.label}</label>
              <input
                className="campo_entrada_deportista"
                type={campo.type}
                name={campo.name}
                value={datos[campo.name]}
                onChange={handleChange}
              />
              {errores[campo.name] && (
                <p className="alerta_error_deportista">{errores[campo.name]}</p>
              )}
            </div>
          ))}
           <div>
            <label className="etiqueta-reg">Género*</label>
            <select name="genero" value={datos.genero} onChange={handleChange} className="campo_entrada_deportista">
              <option value="">Seleccione</option>
              <option value="MASCULINO">MASCULINO</option>
              <option value="FEMENINO">FEMENINO</option>
            </select>
            {errores.genero && <p className="alerta_error_deportista">{errores.genero}</p>}
          </div>

          {/* Posición */}
          <div>
            <label className="etiqueta-reg">Posición*</label>
            <select
              name="posicion"
              value={datos.posicion}
              onChange={handleChange}
              className="campo_entrada_deportista"
            >
              <option value="">Seleccione</option>
              <option value="CENTRAL">CENTRAL</option>
              <option value="REMATADOR">REMATADOR</option>
              <option value="LIBERO">LIBERO</option>
              <option value="ARMADOR">ARMADOR</option>
              <option value="ZAGUERO DERECHO">ZAGUERO DERECHO</option>
              <option value="ZAGUERO IZQUIERDO">ZAGUERO IZQUIERDO</option>
            </select>
            {errores.posicion && (
              <p className="alerta_error_deportista">{errores.posicion}</p>
            )}
          </div>

         

          {/* Tipo de sangre */}
          <div>
            <label className="etiqueta-reg">Tipo de sangre*</label>
            <select
              name="tipo_De_Sangre"
              value={datos.tipo_De_Sangre}
              onChange={handleChange}
              className="campo_entrada_deportista"
            >
              <option value="">Seleccione</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errores.tipo_De_Sangre && (
              <p className="alerta_error_deportista">
                {errores.tipo_De_Sangre}
              </p>
            )}
          </div>

          <div className="bloque_contacto">
            <div>
            <label className="etiqueta-reg">Nombre del contacto*</label>
            <input
              className="campo_contacto"
              type="text"
              name="nombre_Contacto"
              value={datos.nombre_Contacto}
              onChange={handleChange}
            />
            {errores.nombre_Contacto && (
              <p className="alerta_error_deportista">
                {errores.nombre_Contacto}
              </p>
            )}
            </div>

            <div>
            <label className="etiqueta-reg">Teléfono del contacto*</label>
            <input
              className="campo_contacto"
              type="text"
              name="telefono_Contacto"
              value={datos.telefono_Contacto}
              onChange={handleChange}
            />
            {errores.telefono_Contacto && (
              <p className="alerta_error_deportista">
                {errores.telefono_Contacto}
              </p>
            )}
            </div>
            
            <div>
            <label className="etiqueta-reg">Parentesco*</label>
            <select
              name="parentesco_Contacto"
              value={datos.parentesco_Contacto}
              onChange={handleChange}
              className="parentesco campo_contacto"
            >
              <option value="">Seleccione</option>
              <option value="PADRE">PADRE</option>
              <option value="MADRE">MADRE</option>
              <option value="HERMANO">HERMANO</option>
              <option value="HERMANA">HERMANA</option>
              <option value="TUTOR LEGAL">TUTOR LEGAL</option>
            </select>
            {errores.parentesco_Contacto && (
              <p className="alerta_error_deportista">
                {errores.parentesco_Contacto}
              </p>
            )}
          </div>
          </div>

          <div className="contenedor_botones_deportista">
            <button type="submit" className="boton_enviar_deportista">
              Registrar
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default FormularioDeportista;
