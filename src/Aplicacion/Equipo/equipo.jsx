import { useEffect, useState } from "react";
import axios from "axios";
import "../../Components/Public/css/equipo.css";

const API_EQUIPO = "https://backend-5gwv.onrender.com/api/equipo";
const API_DEPOR = "https://backend-5gwv.onrender.com/api/deportista";

export default function Equipo() {
  const [entrenador, setEntrenador] = useState(() => {
    const raw = localStorage.getItem("entrenador");
    return raw ? JSON.parse(raw) : null;
  });

  const [equipos, setEquipos] = useState([]);
  const [deportistas, setDeportistas] = useState([]);
  const [deportistasEquipo, setDeportistasEquipo] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [nuevoDeportista, setNuevoDeportista] = useState("");
  const [previews, setPreviews] = useState({});
  const [nuevoEquipo, setNuevoEquipo] = useState({
    ID_Entrenador: entrenador?.ID_Entrenador ?? null,
    nombre_Equipo: "",
    categoria: "INFANTIL",
    liga: "MASCULINO",
    estado_Equipo: "ACTIVO",
  });
  const [updatingEquipoId, setUpdatingEquipoId] = useState(null);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "entrenador") {
        setEntrenador(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (entrenador?.ID_Entrenador) {
      cargarEquipos(entrenador.ID_Entrenador);
      setNuevoEquipo((prev) => ({ ...prev, ID_Entrenador: entrenador.ID_Entrenador }));
    } else {
      setEquipos([]);
    }
  }, [entrenador]);

  const cargarEquipos = async (idParam) => {
    try {
      const id = idParam ?? entrenador?.ID_Entrenador;
      if (!id) {
        setEquipos([]);
        return;
      }
      const res = await axios.get(`${API_EQUIPO}/entrenador/${id}`);
      setEquipos(res.data);
    } catch (err) {
      console.error("Error al cargar equipos:", err);
      if (err.response) console.error("Response:", err.response.data);
    }
  };

  // --- FILTRO DE DEPORTISTAS (LOGICA DEL PRIMER CODIGO) ---
  const cargarTodosLosDeportistas = async (seleccionado) => {
    try {
      const res = await axios.get(API_DEPOR);
      const data = res.data;
      const deportistasDisponibles = data.filter((dep) => {
        if (!dep.equipo || dep.equipo.length === 0) return true;

        const equiposActivos = dep.equipo.filter((eq) => {
          if (eq.Rel_Deportista_Equipo?.estado === "ACTIVO") return true;
          if (eq.ID_Equipo === seleccionado?.ID_Equipo) return true;
          return false;
        });

        return equiposActivos.length === 0;
      });
      setDeportistas(deportistasDisponibles);
    } catch (err) {
      console.error("Error al cargar deportistas:", err);
      if (err.response) console.error("Response:", err.response.data);
    }
  };

  const cargarDeportistasDelEquipo = async (idEquipo) => {
    try {
      const res = await axios.get(`${API_EQUIPO}/${idEquipo}`);
      setDeportistasEquipo(res.data.deportista ?? []);
    } catch (err) {
      console.error("Error al cargar deportistas del equipo:", err);
      if (err.response) console.error("Response:", err.response.data);
    }
  };

  const manejarCambio = (e) => {
    setNuevoEquipo({ ...nuevoEquipo, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!entrenador?.ID_Entrenador) return alert("No autenticado.");

    try {
      setCreating(true);
      await axios.post(API_EQUIPO, { ...nuevoEquipo, ID_Entrenador: entrenador.ID_Entrenador });
      await cargarEquipos(entrenador.ID_Entrenador);
      setNuevoEquipo({
        ID_Entrenador: entrenador.ID_Entrenador,
        nombre_Equipo: "",
        categoria: "INFANTIL",
        liga: "MASCULINO",
        estado_Equipo: "ACTIVO",
      });
    } catch (err) {
      console.error("Error al crear equipo:", err);
    } finally {
      setCreating(false);
    }
  };

  const manejarActualizarFoto = async (idEquipo, archivo) => {
    if (!archivo || !archivo.type.startsWith("image/") || archivo.size > 2 * 1024 * 1024) return;

    setPreviews((prev) => ({ ...prev, [idEquipo]: URL.createObjectURL(archivo) }));

    try {
      const formData = new FormData();
      formData.append("foto_Equipo", archivo);
      await axios.put(`${API_EQUIPO}/${idEquipo}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await cargarEquipos();
      if (equipoSeleccionado?.ID_Equipo === idEquipo) {
        const res = await axios.get(`${API_EQUIPO}/${idEquipo}`);
        setEquipoSeleccionado(res.data);
      }
    } catch (err) {
      console.error("Error al actualizar foto:", err);
    }
  };

  const seleccionarEquipo = (equipo) => {
    if (updatingEquipoId === equipo.ID_Equipo) return;
    setEquipoSeleccionado(equipo);
    cargarDeportistasDelEquipo(equipo.ID_Equipo);
    cargarTodosLosDeportistas(equipo);
  };

  const asignarDeportista = async () => {
    if (!nuevoDeportista || !equipoSeleccionado) return;
    try {
      await axios.put(`${API_EQUIPO}/agregar/${equipoSeleccionado.ID_Equipo}`, {
        deportista: nuevoDeportista,
      });
      const res = await axios.get(`${API_EQUIPO}/${equipoSeleccionado.ID_Equipo}`);
      setEquipoSeleccionado(res.data);
      setNuevoDeportista("");
      cargarDeportistasDelEquipo(equipoSeleccionado.ID_Equipo);
      cargarEquipos();
      cargarTodosLosDeportistas(equipoSeleccionado);
    } catch (err) {
      console.error("Error al asignar deportista:", err);
    }
  };

const inactivarDeportista = async (relacion) => {
  try {
    // 1️⃣ Inactivar en la base de datos
    await axios.put(`${API_DEPOR}/inactivar`, {
      ID_Equipo: relacion.ID_Equipo,
      ID_Deportista: relacion.ID_Deportista,
    });

    // 2️⃣ Quitar el deportista del equipo localmente
    setDeportistasEquipo((prev) =>
      prev.filter((dep) => dep.ID_Deportista !== relacion.ID_Deportista)
    );

    // 3️⃣ Refrescar la lista de deportistas disponibles
    cargarTodosLosDeportistas(equipoSeleccionado);
  } catch (err) {
    console.error("Error al cambiar estado del deportista:", err);
  }
};

  const cambiarEstadoEquipo = async (equipo) => {
    if (updatingEquipoId === equipo.ID_Equipo) return;
    const nuevoEstado = equipo.estado_Equipo === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    try {
      setUpdatingEquipoId(equipo.ID_Equipo);
      await axios.put(`${API_EQUIPO}/${equipo.ID_Equipo}`, { estado_Equipo: nuevoEstado });
      setEquipos((prev) =>
        prev.map((e) => (e.ID_Equipo === equipo.ID_Equipo ? { ...e, estado_Equipo: nuevoEstado } : e))
      );
      setEquipoSeleccionado((prev) =>
        prev && prev.ID_Equipo === equipo.ID_Equipo ? { ...prev, estado_Equipo: nuevoEstado } : prev
      );
    } catch (err) {
      console.error("Error al cambiar estado del equipo:", err);
    } finally {
      setUpdatingEquipoId(null);
    }
  };

  return (
    <div className="contenedor_vista_equipos">
      {/* Formulario crear equipo */}
      <form className="formulario_crear_equipo" onSubmit={manejarEnvio}>
        <h3 className="titulo_formulario_equipo">Crear Nuevo Equipo</h3>

        <input
          className="campo_equipo"
          type="text"
          name="nombre_Equipo"
          placeholder="Nombre del Equipo"
          value={nuevoEquipo.nombre_Equipo}
          onChange={manejarCambio}
          required
        />
        <select className="campo_equipo" name="categoria" value={nuevoEquipo.categoria} onChange={manejarCambio}>
          <option value="INFANTIL">INFANTIL</option>
          <option value="JUVENIL">JUVENIL</option>
          <option value="MAYOR">MAYOR</option>
        </select>
        <select className="campo_equipo" name="liga" value={nuevoEquipo.liga} onChange={manejarCambio}>
          <option value="MASCULINO">MASCULINO</option>
          <option value="FEMENINO">FEMENINO</option>
          <option value="MIXTO">MIXTO</option>
        </select>
        <select className="campo_equipo" name="estado_Equipo" value={nuevoEquipo.estado_Equipo} onChange={manejarCambio}>
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>
        <button className="boton_guardar_equipo" type="submit" disabled={creating}>
          {creating ? "Creando..." : "Guardar Equipo"}
        </button>
      </form>

      {/* Lista equipos */}
      <div className="lista_equipos_existentes">
        <h3>Mis Equipos</h3>
        <ul className="lista_equipos">
          {equipos.map((eq) => {
            const isUpdating = updatingEquipoId === eq.ID_Equipo;
            const botonLabel = eq.estado_Equipo === "ACTIVO" ? "Inactivar" : "Activar";

            return (
              <li
                key={eq.ID_Equipo}
                className={`item_equipo ${equipoSeleccionado?.ID_Equipo === eq.ID_Equipo ? "seleccionado" : ""}`}
                onClick={() => seleccionarEquipo(eq)}
              >
                <div className="item_equipo_left">
                  <div className="foto_equipo_contenedor">
                    {eq.foto_Equipo ? (
                      <img
                        src={eq.foto_Equipo}
                        alt={`Foto ${eq.nombre_Equipo}`}
                        className="foto_equipo_circular"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFotoAmpliada(eq.foto_Equipo);
                        }}
                      />
                    ) : (
                      <div className="foto_equipo_placeholder">SF</div>
                    )}

                    <label className="icono_camara">
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => manejarActualizarFoto(eq.ID_Equipo, e.target.files[0])}
                      />
                    </label>
                  </div>

                  <div className="equipo_textos">
                    <span className="equipo_nombre">
                      {eq.nombre_Equipo} - {eq.categoria} - {eq.estado_Equipo}
                    </span>
                  </div>
                </div>

                <div className="acciones_equipo">
                  <button
                    type="button"
                    className="boton_estado_equipo"
                    onClick={(e) => {
                      e.stopPropagation();
                      cambiarEstadoEquipo(eq);
                    }}
                    disabled={isUpdating}
                  >
                    {botonLabel}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal ampliar foto */}
      {fotoAmpliada && (
        <div className="modal_foto_equipo">
          <div className="modal_contenido">
            <button className="cerrar_modal" onClick={() => setFotoAmpliada(null)}>
              ✖
            </button>
            <img src={fotoAmpliada} alt="Foto equipo ampliada" />
          </div>
        </div>
      )}

      {/* Sección deportistas */}
      {equipoSeleccionado && (
        <div className="seccion_deportistas_equipo">
          <h3>Deportistas del equipo: {equipoSeleccionado.nombre_Equipo}</h3>

          {equipoSeleccionado.estado_Equipo === "ACTIVO" ? (
            <>
              <select
                className="select_deportistas"
                value={nuevoDeportista}
                onChange={(e) => setNuevoDeportista(e.target.value)}
              >
                <option value="">Selecciona un deportista</option>
                {deportistas.map((dep) => (
                  <option key={dep.ID_Deportista} value={dep.ID_Deportista}>
                    {dep.nombre_Completo} - {dep.posicion} - #{dep.dorsal}
                  </option>
                ))}
              </select>

              <button type="button" className="botonACT" onClick={() => asignarDeportista()}>
                Agregar al equipo
              </button>
            </>
          ) : (
            <p className="mensaje_inactivo">
              ⚠️ Este equipo está inactivo, no se pueden asignar deportistas.
            </p>
          )}

          <ul className="lista_deportistas_equipo">
            {deportistasEquipo.map((dep) => (
              <li key={dep.ID_Deportista} className="item_deportista">
                <span>
                  {dep.nombre_Completo} | {dep.posicion} | #{dep.dorsal}
                </span>
                {dep.Rel_Deportista_Equipo?.estado === "ACTIVO" && (
                  <button
                    type="button"
                    className="boton_estado_deportista activo"
                    onClick={(e) => {
                      e.stopPropagation();
                      inactivarDeportista(dep.Rel_Deportista_Equipo);
                    }}
                  >
                    Inactivar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
