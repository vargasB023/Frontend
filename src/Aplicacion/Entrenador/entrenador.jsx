import React, { useState } from "react";
import axios from "axios";
import "../../Components/Public/css/entrenador.css";
import Iniciopagina from "../../Components/Public/inicioHome";
import Footer from "../../Components/Public/footer";
import { useNavigate } from "react-router-dom";

const FormularioEntrenador = () => {
  const [datos, setDatos] = useState({
    nombre_Completo: "",
    no_Documento: "",
    fecha_Nacimiento: "",
    genero: "",
    direccion: "",
    telefono: "",
    especialidad: "",
    certificacion: null, // archivo
    experiencia: "",
    email: "",
    contrasena: "",
  });

  const navigate = useNavigate();
  const [errores, setErrores] = useState({});

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
    const regexContrasena =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;

    const obligatorios = [
      "nombre_Completo",
      "no_Documento",
      "fecha_Nacimiento",
      "genero",
      "telefono",
      "certificacion",
      "email",
      "contrasena",
    ];

    obligatorios.forEach((campo) => {
      if (!datos[campo] || datos[campo].toString().trim() === "") {
        nuevosErrores[campo] = "Este campo es obligatorio";
      }
    });

    if (datos.no_Documento && !regexNumerico.test(datos.no_Documento)) {
      nuevosErrores.no_Documento = "El documento debe ser numérico";
    }

    if (datos.telefono && !regexNumerico.test(datos.telefono)) {
      nuevosErrores.telefono = "El teléfono debe ser numérico";
    }

    if (datos.fecha_Nacimiento) {
      const edad = calcularEdad(datos.fecha_Nacimiento);
      if (edad < 18 || edad > 75) {
        nuevosErrores.fecha_Nacimiento =
          "La edad debe estar entre 18 y 75 años";
      }
    }

    if (datos.email && !regexCorreo.test(datos.email)) {
      nuevosErrores.email = "Correo inválido. Ej: nombre@dominio.com";
    }

    if (datos.contrasena && !regexContrasena.test(datos.contrasena)) {
      nuevosErrores.contrasena =
        "Contraseña débil. Debe tener mayúscula, minúscula, número, símbolo y mínimo 6 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleFileChange = (e) => {
    setDatos({ ...datos, certificacion: e.target.files[0] }); 
    setErrores((prev) => ({ ...prev, certificacion: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    try {
      const formData = new FormData();
      for (const key in datos) {
        formData.append(key, datos[key]);
      }

      await axios.post(
        "https://backend-5gwv.onrender.com/api/entrenador",
        formData
      );

      alert("Entrenador registrado con éxito");
      navigate("/inicio");

      setDatos({
        nombre_Completo: "",
        no_Documento: "",
        fecha_Nacimiento: "",
        genero: "",
        direccion: "",
        telefono: "",
        especialidad: "",
        certificacion: null,
        experiencia: "",
        email: "",
        contrasena: "",
      });
      setErrores({});
    } catch (error) {
      const res = error.response;
      let mensaje = "";

      if (res?.data?.errors && Array.isArray(res.data.errors) && res.data.errors.length > 0) {
        mensaje = res.data.errors[0].msg;
      } else if (res?.data?.mensaje) {
        mensaje = res.data.mensaje;
      } else {
        mensaje = "Error desconocido";
      }

      const nuevosErrores = {};

      if (mensaje.includes("documento ya existe")) {
        nuevosErrores.no_Documento = "Este número de documento ya está registrado";
      }
      if (mensaje.includes("email")) {
        nuevosErrores.email = "Este correo ya está registrado";
      }
      if (mensaje.includes("Error al subir el archivo")) {
        nuevosErrores.certificacion = "Hubo un problema al subir el archivo";
      }

      if (Object.keys(nuevosErrores).length) {
        setErrores((prev) => ({ ...prev, ...nuevosErrores }));
      } else {
        alert(mensaje);
      }
    }
  };

  return (
    <div>
      <Iniciopagina />
      <div className="contenedor_formulario_entrenador">
        <h2 className="titulo_formulario">Registro de Entrenador</h2>
        <form className="formulario_entrenador" onSubmit={handleSubmit}>
          <div>
            <label className="etiqueta-reg obligatorio">Nombre Completo:</label>
            <input
              className="campo_entrada"
              type="text"
              name="nombre_Completo"
              placeholder="Juanito Perez"
              value={datos.nombre_Completo}
              onChange={handleChange}
            />
            {errores.nombre_Completo && (
              <p className="alerta_error">{errores.nombre_Completo}</p>
            )}
          </div>

          <div>
            <label className="etiqueta-reg obligatorio">Numero de documento:</label>
            <input
              className="campo_entrada"
              type="text"
              name="no_Documento"
              placeholder="1061800442"
              value={datos.no_Documento}
              onChange={handleChange}
            />
            {errores.no_Documento && (
              <p className="alerta_error">{errores.no_Documento}</p>
            )}
          </div>

          <div>
            <label className="etiqueta-reg obligatorio">Fecha de nacimiento:</label>
            <input
              className="campo_entrada"
              type="date"
              name="fecha_Nacimiento"
              value={datos.fecha_Nacimiento}
              onChange={handleChange}
            />
            {errores.fecha_Nacimiento && (
              <p className="alerta_error">{errores.fecha_Nacimiento}</p>
            )}
          </div>

          <div>
            <label className="etiqueta-reg obligatorio">Genero:</label>
            <select
              className="campo_entrada"
              name="genero"
              value={datos.genero}
              onChange={handleChange}
            >
              <option value="">Seleccione género *</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
            </select>
            {errores.genero && <p className="alerta_error">{errores.genero}</p>}
          </div>

          <div>
            <label className="etiqueta-reg">Direccion:</label>
            <input
              className="campo_entrada"
              type="text"
              name="direccion"
              placeholder="Calle falsa 20 # 22-20"
              value={datos.direccion}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="etiqueta-reg obligatorio">Telefono:</label>
            <input
              className="campo_entrada"
              type="text"
              name="telefono"
              placeholder="3106613204"
              value={datos.telefono}
              onChange={handleChange}
            />
            {errores.telefono && (
              <p className="alerta_error">{errores.telefono}</p>
            )}
          </div>

          <div>
            <label className="etiqueta-reg">Especialidad:</label>
            <input
              className="campo_entrada"
              type="text"
              name="especialidad"
              value={datos.especialidad}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="etiqueta-reg">Subir certificado (PDF o imagen):</label>
            <input
              className="campo_entrada"
              type="file"
              name="certificacion"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
            {errores.certificacion && (
              <p className="alerta_error">{errores.certificacion}</p>
            )}
          </div>

          <div>
            <label className="etiqueta-reg obligatorio">Experiencia:</label>
            <textarea
              className="campo_entrada expe"
              name="experiencia"
              value={datos.experiencia}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label className="etiqueta-reg obligatorio">Correo electrónico:</label>
            <input
              className="campo_entrada"
              type="email"
              name="email"
              placeholder="tunombre@dominio.com"
              value={datos.email}
              onChange={handleChange}
            />
            {errores.email && <p className="alerta_error">{errores.email}</p>}
          </div>

          <div>
            <label className="etiqueta-reg obligatorio">Contraseña:</label>
            <input
              className="campo_entrada"
              type="password"
              name="contrasena"
              placeholder="**********"
              value={datos.contrasena}
              onChange={handleChange}
            />
            {errores.contrasena && (
              <p className="alerta_error">{errores.contrasena}</p>
            )}
          </div>

          <div className="contenedor_botones">
            <button type="submit" className="boton_enviar">
              Registrar
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FormularioEntrenador;
