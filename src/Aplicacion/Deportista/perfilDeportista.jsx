import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FaCamera, FaEdit, FaSave, FaTimes, FaUser, FaIdCard, FaBirthdayCake,FaVenusMars, FaMapMarkerAlt, FaPhone, FaHeartbeat, FaTint,
  FaTrophy, FaHashtag, FaNotesMedical, FaUsers} from "react-icons/fa";
import '../../Components/Public/css/perfilDeportista.css'

export default function PerfilDeportista() {
  const [datosDeportista, setDatosDeportista] = useState(null);
  const [datosTemporales, setDatosTemporales] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensajeFoto, setMensajeFoto] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const inputArchivoRef = useRef(null);

  const deportistaGuardado = localStorage.getItem("deportista");
  const deportista = deportistaGuardado ? JSON.parse(deportistaGuardado) : null;

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const response = await axios.get(
          `https://backend-5gwv.onrender.com/api/perfil_deportista/${deportista.perfil_Deportista.ID_Perfil_Deportista}`
        );
        setDatosDeportista(deportista);
        setDatosTemporales(deportista);
        setFotoPerfil(response.data.perfil_Deportista.foto_Perfil || null);
        if (response.data.perfil_Deportista.foto_Perfil) {
          setPreview(response.data.perfil_Deportista.foto_Perfil);
        }
      } catch (error) {
        console.error("Error al obtener el perfil del deportista:", error);
      }
    };
    if (deportista) {
      obtenerPerfil();
    }
  }, [deportista.ID_Deportista]);

  const manejarCambioCampo = (campo, valor) =>
    setDatosTemporales(prev => ({ ...prev, [campo]: valor }));

  const guardarCambios = async () => {
    try {
      await axios.put(
        `https://backend-5gwv.onrender.com/api/deportista/${deportista.ID_Deportista}`,
        {
          ...deportista,
          direccion: datosTemporales.direccion,
          telefono: datosTemporales.telefono,
          eps: datosTemporales.eps,
          posicion: datosTemporales.posicion,
          dorsal: datosTemporales.dorsal,
          tipo_De_Sangre: datosTemporales.tipo_De_Sangre,
          alergias: datosTemporales.alergias,
          nombre_Contacto: datosTemporales.nombre_Contacto,
          parentesco_Contacto: datosTemporales.parentesco_Contacto,
          telefono_Contacto: datosTemporales.telefono_Contacto,
          genero: datosTemporales.genero,
        }
      );
      setDatosDeportista(datosTemporales);
      setModoEdicion(false);
    } catch (err) {
      console.error("Error al guardar los cambios:", err);
    }
  };

  const cancelarEdicion = () => {
    setDatosTemporales({ ...datosDeportista });
    setModoEdicion(false);
  };

  // ==== FOTO PERFIL ====
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

      const perfilId = deportista.perfil_Deportista.ID_Perfil_Deportista;

      const response = await axios.put(
        `https://backend-5gwv.onrender.com/api/perfil_deportista/${perfilId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const nuevaFoto = response.data.perfil_Deportista?.foto_Perfil;
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

  const formatearFecha = f =>
    new Date(f).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

  const calcularEdad = f => {
    const hoy = new Date(),
      nac = new Date(f);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  };

  if (!datosDeportista) return <p>Cargando perfil…</p>;

  const opcionesGenero = ["MASCULINO", "FEMENINO"];
  const opcionesPosicion = [
    "CENTRAL", "REMATADOR", "LIBERO", "ARMADOR",
    "ZAGUERO DERECHO", "ZAGUERO IZQUIERDO"
  ];
  const opcionesSangre = ["B+","B-","A+","A-","AB+","AB-","O+","O-"];
  const opcionesParentesco = ["PADRE","MADRE","HERMANO","HERMANA","TUTOR LEGAL"];

  return (
    <div className="horizontal">
      <div className="contenedor-perfil-columnas">
        <div className="tarjeta-perfil-columnas">
  
          <div className="encabezado-acciones-perfil">
            <h1 className="titulo-pagina-perfil">Mi Perfil</h1>
            <div className="botones-accion-perfil">
              {modoEdicion ? (
                <>
                  <button className="boton-guardar-columnas" onClick={guardarCambios}>
                    <FaSave className="icono-boton-columnas" /> Guardar
                  </button>
                  <button className="boton-cancelar-columnas" onClick={cancelarEdicion}>
                    <FaTimes className="icono-boton-columnas" /> Cancelar
                  </button>
                </>
              ) : (
                <button className="boton-editar-columnas" onClick={() => setModoEdicion(true)}>
                  <FaEdit className="icono-boton-columnas" /> Editar Perfil
                </button>
              )}
            </div>
          </div>

          <div className="contenido-columnas-perfil">
            <div className="columna-foto-nombre">
              {/* ==== FOTO PERFIL ==== */}
              <div className="seccion-foto-perfil">
                <div className="contenedor-foto-limpia">
                  {preview ? (
                    <img src={preview} alt="Perfil" className="imagen-perfil-limpia" />
                  ) : (
                    <div className="placeholder-foto-limpia">
                      <FaUser className="icono-usuario-grande" />
                    </div>
                  )}
                  <button className="boton-camara-limpia" onClick={abrirSelectorArchivo}>
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
                <h2 className="nombre-completo-perfil">{datosDeportista.nombre_Completo}</h2>
                <p className="rol-deportista">Deportista</p>
                <p className="edad-deportista">{calcularEdad(datosDeportista.fecha_Nacimiento)} años</p>
              </div>
            </div>

            {/* ---- Columna Personal ---- */}
            <div className="columna-datos-personales">
              <h3 className="titulo-seccion-columna">Información Personal</h3>
              <div className="lista-campos-personales">
                <CampoValor label="Documento" icon={FaIdCard} valor={datosDeportista.no_Documento}/>
                <CampoValor label="Fecha de Nacimiento" icon={FaBirthdayCake} valor={formatearFecha(datosDeportista.fecha_Nacimiento)}/>
                <CampoEditable
                  modoEdicion={modoEdicion} label="Género" icon={FaVenusMars}
                  campo="genero" valor={datosTemporales.genero}
                  renderEdit={() => (
                    <SelectOpciones valor={datosTemporales.genero} opciones={opcionesGenero} onChange={v => manejarCambioCampo("genero", v)} />
                  )}
                />
                <CampoEditableInput campo="direccion" label="Dirección" icon={FaMapMarkerAlt}/>
                <CampoEditableInput campo="telefono" label="Teléfono" icon={FaPhone}/>
                <CampoEditableInput campo="eps" label="EPS" icon={FaHeartbeat}/>
                <CampoEditable
                  modoEdicion={modoEdicion} label="Tipo de Sangre" icon={FaTint}
                  campo="tipo_De_Sangre" valor={datosTemporales.tipo_De_Sangre}
                  renderEdit={() => (
                    <SelectOpciones valor={datosTemporales.tipo_De_Sangre} opciones={opcionesSangre} onChange={v => manejarCambioCampo("tipo_De_Sangre", v)} />
                  )}
                />
                <CampoEditable
                  modoEdicion={modoEdicion} label="Posición" icon={FaTrophy}
                  campo="posicion" valor={datosTemporales.posicion}
                  renderEdit={() => (
                    <SelectOpciones valor={datosTemporales.posicion} opciones={opcionesPosicion} onChange={v => manejarCambioCampo("posicion", v)} />
                  )}
                />
                <CampoEditableInput campo="dorsal" label="Dorsal" icon={FaHashtag}/>
                <CampoEditableInput campo="alergias" label="Alergias" icon={FaNotesMedical}/>
              </div>
            </div>

            <div className="columna-datos-profesionales">
              <h3 className="titulo-seccion-columna">Contacto Emergencia</h3>
              <div className="lista-campos-profesionales">
                <CampoEditableInput campo="nombre_Contacto" label="Nombre" icon={FaUser}/>
                <CampoEditable
                  modoEdicion={modoEdicion} label="Parentesco" icon={FaUsers}
                  campo="parentesco_Contacto" valor={datosTemporales.parentesco_Contacto}
                  renderEdit={() => (
                    <SelectOpciones valor={datosTemporales.parentesco_Contacto} opciones={opcionesParentesco} onChange={v => manejarCambioCampo("parentesco_Contacto", v)} />
                  )}
                />
                <CampoEditableInput campo="telefono_Contacto" label="Teléfono" icon={FaPhone}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ========= COMPONENTES INTERNOS ========= */
  function CampoValor({ label, icon: Icono, valor }) {
    return (
      <div className="campo-dato-personal">
        <div className="etiqueta-con-icono">
          <Icono className="icono-campo-columna" />
          <span className="etiqueta-campo-columna">{label}</span>
        </div>
        <span className="valor-campo-columna">{valor}</span>
      </div>
    );
  }

  function CampoEditableInput({ campo, label, icon: Icono }) {
    return (
      <CampoEditable
        modoEdicion={modoEdicion} label={label} icon={Icono}
        campo={campo} valor={datosTemporales[campo]}
        renderEdit={() => (
          <input
            type="text"
            value={datosTemporales[campo] || ""}
            onChange={e => manejarCambioCampo(campo, e.target.value)}
            className="input-campo-columna"
          />
        )}
      />
    );
  }

  function CampoEditable({ modoEdicion, label, icon: Icono, campo, valor, renderEdit }) {
    return (
      <div className="campo-dato-personal">
        <div className="etiqueta-con-icono">
          <Icono className="icono-campo-columna" />
          <span className="etiqueta-campo-columna">{label}</span>
        </div>
        {modoEdicion ? renderEdit() : (
          <span className="valor-campo-columna">{valor}</span>
        )}
      </div>
    );
  }

  function SelectOpciones({ valor, opciones, onChange }) {
    return (
      <select
        value={valor || ""}
        onChange={e => onChange(e.target.value)}
        className="input-campo-columna"
      >
        <option value="" disabled>Seleccione…</option>
        {opciones.map(op => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    );
  }
}
