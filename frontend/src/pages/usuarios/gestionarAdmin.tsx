import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import { obtenerAdmins, cambiarEstadoAdmin } from "../../services/usuarioService";
import "../../styles/dashboard.css";

// Define la forma del objeto Admin con TypeScript (tipo local, solo para este archivo)
type Admin = {
  id_usuario: number;
  nombre: string;
  email: string;
  estado: number; // 1 = activo, 0 = inactivo
};

export default function GestionarAdmin() {

  const navigate = useNavigate();

  // Lista completa de administradores cargada desde el backend
  const [admins, setAdmins] = useState<Admin[]>([]);
  // Texto del buscador para filtrar por nombre
  const [busqueda, setBusqueda] = useState("");
  // Admin seleccionado para el modal de confirmacion
  const [adminSeleccionado, setAdminSeleccionado] = useState<Admin | null>(null);
  // Controla si el modal de confirmacion es visible
  const [mostrarModal, setMostrarModal] = useState(false);
  // Mensaje de exito o error que se muestra brevemente
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  // useEffect con array vacio [] como segundo argumento: se ejecuta una sola vez
  // cuando el componente aparece en pantalla (equivalente a "al cargar la pagina")
  useEffect(() => {
    cargarAdmins();
  }, []);

  // Llama al servicio para traer la lista de admins del backend y la guarda en el estado
  const cargarAdmins = async () => {
    try {
      const data = await obtenerAdmins();
      setAdmins(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filtra la lista segun lo que el usuario escribe en el buscador
  // toLowerCase() permite buscar sin importar mayusculas/minusculas
  const adminsFiltrados = admins.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Guarda el admin seleccionado y muestra el modal de confirmacion
  const abrirModal = (admin: Admin) => {
    setAdminSeleccionado(admin);
    setMostrarModal(true);
  };

  const confirmarCambioEstado = async () => {
    if (!adminSeleccionado) return;

    // Si esta activo (1) el nuevo estado sera inactivo (0) y viceversa
    const nuevoEstado = adminSeleccionado.estado === 1 ? 0 : 1;

    try {
      await cambiarEstadoAdmin(adminSeleccionado.id_usuario, nuevoEstado);

      setTipoMensaje("success");
      setMensaje(
        nuevoEstado === 0
          ? "Administrador inactivado correctamente"
          : "Administrador activado correctamente"
      );

      setMostrarModal(false);
      // Recarga la lista para reflejar el cambio
      cargarAdmins();

      // setTimeout ejecuta una funcion despues de un tiempo (en milisegundos)
      // Aqui limpia el mensaje despues de 3 segundos
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      setTipoMensaje("error");
      setMensaje("Error al procesar");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-container dashboard-container-sm">

          <div className="header-flex">
            <h2 className="title">Gestion de Administradores</h2>
          </div>

          {/* Solo se renderiza si hay un mensaje activo.
              El operador && en JSX significa "si lo de la izquierda es verdadero, muestra lo de la derecha" */}
          {mensaje && (
            <div className={`alerta ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          <input
            className="input-busqueda"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

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
                {/* .map() recorre el array y retorna un elemento JSX por cada admin
                    key es obligatorio en listas para que React identifique cada fila */}
                {adminsFiltrados.map((a) => (
                  <tr key={a.id_usuario}>
                    <td>{a.nombre}</td>
                    <td>{a.email}</td>

                    <td>
                      {/* La clase CSS cambia segun el estado para mostrar verde o rojo */}
                      <span className={`badge ${a.estado ? "activo" : "inactivo"}`}>
                        {a.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="acciones">
                      {/* Al editar se pasa "from: gestionar" para que al guardar
                          vuelva a esta pagina y no al dashboard */}
                      <button className="btn editar" onClick={() => navigate(`/crear-admin/${a.id_usuario}`, { state: { from: "gestionar" } })} >
                        Editar
                      </button>

                      <button className={`btn ${a.estado ? "inactivar" : "activar"}`} onClick={() => abrirModal(a)} >
                        {a.estado ? "Inactivar" : "Activar"}
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal de confirmacion: solo aparece cuando mostrarModal es true
              y hay un admin seleccionado */}
          {mostrarModal && adminSeleccionado && (
            <div className="modal">
              <div className="modal-content">
                <h3>Confirmar accion</h3>
                <p>
                  Seguro que deseas{" "}
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
