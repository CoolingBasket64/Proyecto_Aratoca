import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import { obtenerPersonas, cambiarEstado } from "../../services/personService";
import type { Persona } from "../../types/person";
import "../../styles/dashboard.css";

export default function EditarDiscapacitado() {

  const navigate = useNavigate();

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Persona | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [razon, setRazon] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    try {
      const data = await obtenerPersonas();
      console.log(data);
      setPersonas(data);
    } catch (error) {
      console.error(error);
    }
  }
  const personasFiltradas = personas.filter((p) =>
    p.documento?.includes(busqueda)
  );

  const abrirModal = (persona: Persona) => {
    setPersonaSeleccionada(persona);
    setMostrarModal(true);
  };

  const confirmarCambioEstado = async () => {
    if (!personaSeleccionada) return;

    const esInactivar = personaSeleccionada.activo === 1;

    if (esInactivar && !razon.trim()) {
      alert("Debes ingresar una razón para inactivar");
      return;
    }

    const nuevoEstado = esInactivar ? 0 : 1;

    try {
      await cambiarEstado(
        personaSeleccionada.id_persona,
        nuevoEstado,
        razon
      );

      setTipoMensaje("success");
      setMensaje(
        esInactivar
          ? "Persona inactivada correctamente ✅"
          : "Persona activada correctamente ✅"
      );

      setMostrarModal(false);
      setRazon("");
      cargarPersonas();

      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      setTipoMensaje("error");
      setMensaje("Error al procesar ❌");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-container">

          <h2 className="title">Gestión de Personas con Discapacidad</h2>

          {/* 🔥 ALERTA BONITA */}
          {mensaje && (
            <div className={`alerta ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          {/* 🔍 BUSCADOR */}
          <input
            className="input-busqueda"
            placeholder="Buscar por documento"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {/* 📋 TABLA */}
          <div className="tabla-container">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Documento</th>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Discapacidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {personasFiltradas.map((p) => (

                  <tr key={p.id_persona}>
                    <td>{p.codigo}</td>
                    <td>{p.documento}</td>
                    <td>{p.nombre_completo}</td>
                    <td>{p.edad}</td>
                    <td>{p.discapacidad}</td>

                    <td>
                      <span className={`badge ${p.activo ? "activo" : "inactivo"}`}>
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="acciones">
                      <button
                        className="btn editar"
                        onClick={() => navigate(`/editar/${p.id_persona}`, { state: { from: "gestionar" } })}
                      >
                        Editar
                      </button>

                      <button
                        className={`btn ${p.activo ? "inactivar" : "activar"}`}
                        onClick={() => abrirModal(p)}
                      >
                        {p.activo ? "Inactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🧾 MODAL */}
          {mostrarModal && personaSeleccionada && (
            <div className="modal">
              <div className="modal-content">
                <h3>Confirmar acción</h3>

                <p>
                  ¿Seguro que deseas{" "}
                  {personaSeleccionada.activo
                    ? "inactivar"
                    : "activar"} esta persona?
                </p>

                {/* ✅ SOLO mostrar textarea si se va a INACTIVAR */}
                {personaSeleccionada.activo === 1 && (
                  <textarea
                    placeholder="Ingrese la razón de inactivación"
                    value={razon}
                    onChange={(e) => setRazon(e.target.value)}
                  />
                )}

                <div className="modal-buttons">
                  <button
                    className="btn confirmar"
                    onClick={confirmarCambioEstado}
                  >
                    Confirmar
                  </button>

                  <button
                    className="btn cancelar"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}