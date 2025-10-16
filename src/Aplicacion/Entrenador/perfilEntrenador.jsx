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
    <div className="PerfilEnHorizontal">
      <div className="PerfilEnContenedorColumnas">
        <div className="PerfilEnTarjetaColumnas">
          <div className="PerfilEnEncabezadoAcciones">
            <h1 className="PerfilEnTituloPagina">Mi Perfil</h1>
            <div className="PerfilEnBotonesAccion">
              {!modoEdicion ? (
                <button
                  className="PerfilEnBotonEditar"
                  onClick={() => setModoEdicion(true)}
                >
                  <FaEdit className="PerfilEnIconoBoton" /> Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    className="PerfilEnBotonGuardar"
                    onClick={guardarCambios}
                  >
                    <FaSave className="PerfilEnIconoBoton" /> Guardar
                  </button>
                  <button
                    className="PerfilEnBotonCancelar"
                    onClick={cancelarEdicion}
                  >
                    <FaTimes className="PerfilEnIconoBoton" /> Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="PerfilEnContenidoColumnas">
            {/* === FOTO Y NOMBRE === */}
            <div className="PerfilEnColumnaFotoNombre">
              <div className="PerfilEnSeccionFoto">
                <div className="PerfilEnContenedorFoto">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Perfil"
                      className="PerfilEnImagen"
                    />
                  ) : (
                    <div className="PerfilEnFotoPlaceholder">
                      <FaUser className="PerfilEnIconoUsuario" />
                    </div>
                  )}
                  <button
                    className="PerfilEnBotonCamara"
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
                  className="PerfilEnInputArchivoOculto"
                />

                <button
                  onClick={handleSubmitFoto}
                  className="PerfilEnBotonGuardarImagen"
                >
                  Guardar Imagen
                </button>

                {mensajeFoto && (
                  <p className="PerfilEnMensajeFoto">{mensajeFoto}</p>
                )}
              </div>

              <div className="PerfilEnInfoNombre">
                <h2 className="PerfilEnNombreCompleto">
                  {datosEntrenador.nombre_Completo}
                </h2>
                <p className="PerfilEnRol">Entrenador Personal</p>
                <p className="PerfilEnEdad">
                  {calcularEdad(datosEntrenador.fecha_Nacimiento)} años
                </p>
              </div>
            </div>

            {/* === DATOS PERSONALES === */}
            <div className="PerfilEnColumnaDatosPersonales">
              <h3 className="PerfilEnTituloSeccion">Información Personal</h3>
              <div className="PerfilEnListaCamposPersonales">
                {[
                  ["no_Documento", "Documento", FaIdCard],
                  ["fecha_Nacimiento", "Fecha de Nacimiento", FaBirthdayCake],
                  ["genero", "Género", FaVenusMars],
                  ["direccion", "Dirección", FaMapMarkerAlt],
                  ["telefono", "Teléfono", FaPhone],
                ].map(([campo, etiqueta, Icono]) => (
                  <div key={campo} className="PerfilEnCampoDatoPersonal">
                    <div className="PerfilEnEtiquetaIcono">
                      <Icono className="PerfilEnIconoCampo" />
                      <span className="PerfilEnEtiquetaCampo">{etiqueta}</span>
                    </div>
                    {modoEdicion &&
                    ["direccion", "telefono"].includes(campo) ? (
                      <input
                        type={campo === "telefono" ? "tel" : "text"}
                        value={datosTemporales[campo]}
                        onChange={(e) =>
                          manejarCambioCampo(campo, e.target.value)
                        }
                        className="PerfilEnInputCampo"
                      />
                    ) : campo === "fecha_Nacimiento" ? (
                      <span className="PerfilEnValorCampo">
                        {formatearFecha(datosEntrenador[campo])}
                      </span>
                    ) : (
                      <span className="PerfilEnValorCampo">
                        {datosEntrenador[campo]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* === DATOS PROFESIONALES === */}
            <div className="PerfilEnColumnaDatosProfesionales">
              <h3 className="PerfilEnTituloSeccion">Información Profesional</h3>
              <div className="PerfilEnListaCamposProfesionales">
                {[
                  ["especialidad", "Especialidad", FaStar],
                  ["certificacion", "Certificaciones", FaCertificate],
                  ["experiencia", "Experiencia", FaClock],
                ].map(([campo, etiqueta, Icono]) => (
                  <div key={campo} className="PerfilEnCampoDatoProfesional">
                    <div className="PerfilEnEtiquetaIcono">
                      <Icono className="PerfilEnIconoCampo" />
                      <span className="PerfilEnEtiquetaCampo">{etiqueta}</span>
                    </div>
                    {modoEdicion ? (
                      <textarea
                        value={datosTemporales[campo]}
                        onChange={(e) =>
                          manejarCambioCampo(campo, e.target.value)
                        }
                        className="PerfilEnTextareaCampo"
                        rows="3"
                      />
                    ) : (
                      <p className="PerfilEnValorTexto">
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
