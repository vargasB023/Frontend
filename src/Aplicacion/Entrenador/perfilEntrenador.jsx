import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {FaCamera,FaEdit,FaSave,FaTimes,FaUser,FaIdCard,FaBirthdayCake,FaVenusMars,
  FaMapMarkerAlt,FaPhone,FaStar,FaCertificate,FaClock,} from "react-icons/fa";
import "../../Components/Public/css/perfilEntrenador.css";
 

export default function PerfilEntrenador() {
  const [datosEntrenador, setDatosEntrenador] = useState(null);
  const [datosTemporales, setDatosTemporales] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensajeFoto, setMensajeFoto] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const inputArchivoRef = useRef(null);

  const entrenadorGuardado = localStorage.getItem("entrenador");
  const entrenador = entrenadorGuardado ? JSON.parse(entrenadorGuardado) : null;

  useEffect(() => {
    
    const obtenerDatosPerfil = async () => {
      try {
        const response = await axios.get(
          `https://backend-5gwv.onrender.com/api/perfil_entrenador/${entrenador.perfil_Entrenador.ID_Perfil_Entrenador}`
        );
        setDatosEntrenador(entrenador);
        setDatosTemporales(entrenador);
        setFotoPerfil(response.data.perfil_Entrenador.foto_Perfil || null);
        if (response.data.perfil_Entrenador.foto_Perfil) {
          setPreview(response.data.perfil_Entrenador.foto_Perfil);
        }
      } catch (error) {
        console.error("Error al obtener el perfil del entrenador:", error);
      }
    };

    if (entrenador) {
      obtenerDatosPerfil();
    }
  }, [entrenador.ID_Entrenador]);

  const manejarCambioCampo = (campo, valor) => {
    setDatosTemporales((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarCambios = async () => {
    try {
      await axios.put(
        `https://backend-5gwv.onrender.com/api/entrenador/${entrenador.ID_Entrenador}`,
        {
          ...entrenador,
          direccion: datosTemporales.direccion,
          telefono: datosTemporales.telefono,
          especialidad: datosTemporales.especialidad,
          certificacion: datosTemporales.certificacion,
          experiencia: datosTemporales.experiencia,
        }
      );

      setDatosEntrenador(datosTemporales);
      setModoEdicion(false);
      console.log("Datos actualizados");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const cancelarEdicion = () => {
    setDatosTemporales({ ...datosEntrenador });
    setModoEdicion(false);
  };

   const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
        setMensajeFoto("El archivo debe ser una imagen válida (jpg, jpeg, png, webp)");
        return;
      }
      setFotoPerfil(file);
      setPreview(URL.createObjectURL(file));
      setMensajeFoto("");
    }
  };

  const handleSubmitFoto = async () => {
    if (!fotoPerfil || typeof fotoPerfil === "string") {
      setMensajeFoto("Por favor selecciona una imagen.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("foto_Perfil", fotoPerfil);

      const perfilId = entrenador.perfil_Entrenador.ID_Perfil_Entrenador;

      const response = await axios.put(
        `https://backend-5gwv.onrender.com/api/perfil_entrenador/${perfilId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const nuevaFoto = response.data.perfil_Entrenador?.foto_Perfil;
      setMensajeFoto(response.data.mensaje);
      setFotoPerfil(nuevaFoto);
      setPreview(nuevaFoto);

      console.log("Respuesta:", response.data);
    } catch (error) {
      console.error("Error al subir:", error.response?.data || error.message);
      setMensajeFoto("Error al subir la imagen.");
    }
  };

  const abrirSelectorArchivo = () => inputArchivoRef.current?.click();

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  if (!datosEntrenador) return <p>Cargando perfil...</p>;

  return (
    <div>
      <div className="horizontal">
      <div className="contenedor-perfil-columnas">
        <div className="tarjeta-perfil-columnas">
          <div className="encabezado-acciones-perfil">
            <h1 className="titulo-pagina-perfil">Mi Perfil</h1>
            <div className="botones-accion-perfil">
              {!modoEdicion ? (
                <button
                  className="boton-editar-columnas"
                  onClick={() => setModoEdicion(true)}
                >
                  <FaEdit className="icono-boton-columnas" /> Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    className="boton-guardar-columnas"
                    onClick={guardarCambios}
                  >
                    <FaSave className="icono-boton-columnas" /> Guardar
                  </button>
                  <button
                    className="boton-cancelar-columnas"
                    onClick={cancelarEdicion}
                  >
                    <FaTimes className="icono-boton-columnas" /> Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
            <div className="contenido-columnas-perfil">
              <div className="columna-foto-nombre">
                <div className="seccion-foto-perfil">
                  <div className="contenedor-foto-limpia">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Perfil"
                        className="imagen-perfil-limpia"
                      />
                    ) : (
                      <div className="placeholder-foto-limpia">
                        <FaUser className="icono-usuario-grande" />
                      </div>
                    )}
                    <button
                      className="boton-camara-limpia"
                      onClick={abrirSelectorArchivo}
                    >
                      <FaCamera />
                    </button>
                  </div>

                  <input
                    ref={inputArchivoRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input-archivo-oculto"
                  />
                  <button
                    onClick={handleSubmitFoto}
                    className="w-full bg-[#1a6f9d] text-white py-1 px-2 rounded-lg mt-2 hover:bg-[#235eb5] transition"
                  >
                    Guardar Imagen
                  </button>
                  {mensajeFoto && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {mensajeFoto}
                    </p>
                  )}
                </div>
              <div className="info-nombre-perfil">
                <h2 className="nombre-completo-perfil">
                  {datosEntrenador.nombre_Completo}
                </h2>
                <p className="rol-entrenador">Entrenador Personal</p>
                <p className="edad-entrenador">
                  {calcularEdad(datosEntrenador.fecha_Nacimiento)} años
                </p>
              </div>
            </div>

            {/* Datos personales */}
            <div className="columna-datos-personales">
              <h3 className="titulo-seccion-columna">Información Personal</h3>
              <div className="lista-campos-personales">
                {[
                  ["no_Documento", "Documento", FaIdCard],
                  ["fecha_Nacimiento", "Fecha de Nacimiento", FaBirthdayCake],
                  ["genero", "Género", FaVenusMars],
                  ["direccion", "Dirección", FaMapMarkerAlt],
                  ["telefono", "Teléfono", FaPhone],
                ].map(([campo, etiqueta, Icono]) => (
                  <div key={campo} className="campo-dato-personal">
                    <div className="etiqueta-con-icono">
                      <Icono className="icono-campo-columna" />
                      <span className="etiqueta-campo-columna">{etiqueta}</span>
                    </div>
                    {modoEdicion &&
                    ["direccion", "telefono"].includes(campo) ? (
                      <input
                        type={campo === "telefono" ? "tel" : "text"}
                        value={datosTemporales[campo]}
                        onChange={(e) =>
                          manejarCambioCampo(campo, e.target.value)
                        }
                        className="input-campo-columna"
                      />
                    ) : campo === "fecha_Nacimiento" ? (
                      <span className="valor-campo-columna">
                        {formatearFecha(datosEntrenador[campo])}
                      </span>
                    ) : (
                      <span className="valor-campo-columna">
                        {datosEntrenador[campo]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Datos profesionales */}
            <div className="columna-datos-profesionales">
              <h3 className="titulo-seccion-columna">
                Información Profesional
              </h3>
              <div className="lista-campos-profesionales">
                {[
                  ["especialidad", "Especialidad", FaStar],
                  ["certificacion", "Certificaciones", FaCertificate],
                  ["experiencia", "Experiencia", FaClock],
                ].map(([campo, etiqueta, Icono]) => (
                  <div key={campo} className="campo-dato-profesional">
                    <div className="etiqueta-con-icono">
                      <Icono className="icono-campo-columna" />
                      <span className="etiqueta-campo-columna">{etiqueta}</span>
                    </div>
                    {modoEdicion ? (
                      <textarea
                        value={datosTemporales[campo]}
                        onChange={(e) =>
                          manejarCambioCampo(campo, e.target.value)
                        }
                        className="textarea-campo-columna"
                        rows="3"
                      />
                    ) : (
                      <p className="valor-texto-columna">
                        {datosEntrenador[campo]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
