import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import { obtenerAdmins, cambiarEstadoAdmin } from "../../services/usuarioService";
import "../../styles/dashboard.css";

type Admin = {
  id_usuario: number;
  nombre: string;
  email: string;
  estado: number;
};

export default function GestionarAdmin() {

  const navigate = useNavigate();

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [adminSeleccionado, setAdminSeleccionado] = useState<Admin | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  useEffect(() => {
    cargarAdmins();
  }, []);

  const cargarAdmins = async () => {
    try {
      const data = await obtenerAdmins();
      setAdmins(data);
    } catch (error) {
      console.error(error);
    }
  };
  const adminsFiltrados = admins.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModal = (admin: Admin) => {
    setAdminSeleccionado(admin);
    setMostrarModal(true);
  };

  const confirmarCambioEstado = async () => {
    if (!adminSeleccionado) return;

    const nuevoEstado = adminSeleccionado.estado === 1 ? 0 : 1;

    try {
      await cambiarEstadoAdmin(adminSeleccionado.id_usuario, nuevoEstado);

      setTipoMensaje("success");
      setMensaje(
        nuevoEstado === 0
          ? "Administrador inactivado correctamente ✅"
          : "Administrador activado correctamente ✅"
      );

      setMostrarModal(false);
      cargarAdmins();

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

          <div className="header-flex">
            <h2 className="title">Gestión de Administradores</h2>
          </div>

          {/* ALERTA */}
          {mensaje && (
            <div className={`alerta ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          {/* BUSCADOR */}
          <input
            className="input-busqueda"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {/* TABLA */}
          <div className="tabla-container">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {adminsFiltrados.map((a) => (
                  <tr key={a.id_usuario}>
                    <td>{a.nombre}</td>
                    <td>{a.email}</td>

                    <td>
                      <span className={`badge ${a.estado ? "activo" : "inactivo"}`}>
                        {a.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="acciones">

                      {/* ✏️ EDITAR */}
                      <button className="btn editar" onClick={() => navigate(`/crear-admin/${a.id_usuario}`, { state: { from: "gestionar" } })} >
                        Editar
                      </button>

                      {/* 🔄 ESTADO */}
                      <button className={`btn ${a.estado ? "inactivar" : "activar"}`} onClick={() => abrirModal(a)} >
                        {a.estado ? "Inactivar" : "Activar"}
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MODAL */}
          {mostrarModal && adminSeleccionado && (
            <div className="modal">
              <div className="modal-content">
                <h3>Confirmar acción</h3>
                <p>
                  ¿Seguro que deseas{" "}
                  {adminSeleccionado.estado ? "inactivar" : "activar"} este administrador?
                </p>
                <div className="modal-buttons">
                  <button className="btn confirmar" onClick={confirmarCambioEstado}>
                    Confirmar
                  </button>
                  <button className="btn cancelar" onClick={() => setMostrarModal(false)}>
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