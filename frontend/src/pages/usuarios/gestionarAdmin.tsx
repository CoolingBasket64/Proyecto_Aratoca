import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import { obtenerAdmins, cambiarEstadoAdmin } from "../../services/usuarioService";
import "../../styles/dashboard.css";

// Definimos el tipo Admin localmente porque solo se usa en este archivo.
// En TypeScript, "type" y "interface" son casi equivalentes para objetos.
type Admin = {
  id_usuario: number;
  nombre:     string;
  email:      string;
  estado:     number; // 1 = activo, 0 = inactivo
};

export default function GestionarAdmin() {

  const navigate = useNavigate();

  const [admins,           setAdmins]           = useState<Admin[]>([]);
  const [busqueda,         setBusqueda]         = useState("");
  const [adminSeleccionado, setAdminSeleccionado] = useState<Admin | null>(null);
  const [mostrarModal,     setMostrarModal]     = useState(false);
  const [mensaje,          setMensaje]          = useState("");
  const [tipoMensaje,      setTipoMensaje]      = useState<"success" | "error">("success");

  // useEffect con array vacio []: se ejecuta UNA SOLA VEZ cuando el componente se monta.
  // Equivale a "cuando carga la pagina, ejecuta cargarAdmins".
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

  // filter() recorre el array y retorna solo los elementos donde la funcion devuelve true.
  // toLowerCase() permite buscar sin importar si el usuario escribe en mayusculas o minusculas.
  // includes() devuelve true si el string contiene el texto buscado.
  const adminsFiltrados = admins.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModal = (admin: Admin) => {
    setAdminSeleccionado(admin);
    setMostrarModal(true);
  };

  const confirmarCambioEstado = async () => {
    if (!adminSeleccionado) return;

    // Operador ternario: si estado es 1 (activo), el nuevo sera 0 (inactivo), y viceversa.
    const nuevoEstado = adminSeleccionado.estado === 1 ? 0 : 1;

    try {
      await cambiarEstadoAdmin(adminSeleccionado.id_usuario, nuevoEstado);

      setTipoMensaje("success");
      setMensaje(nuevoEstado === 0
        ? "Administrador inactivado correctamente"
        : "Administrador activado correctamente"
      );

      setMostrarModal(false);
      cargarAdmins(); // Recarga la lista para mostrar el nuevo estado sin recargar la pagina

      // setTimeout: muestra el mensaje 3 segundos y luego lo borra
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

          {/* Mensaje de exito o error temporal */}
          {mensaje && <div className={`alerta ${tipoMensaje}`}>{mensaje}</div>}

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
                {/* .map() transforma cada elemento del array en un elemento JSX.
                    "key" es obligatorio en listas: React lo usa internamente para
                    identificar cada fila y actualizar solo las que cambian. */}
                {adminsFiltrados.map((a) => (
                  <tr key={a.id_usuario}>
                    <td>{a.nombre}</td>
                    <td>{a.email}</td>
                    <td>
                      {/* La clase CSS cambia segun el estado para colorear el badge */}
                      <span className={`badge ${a.estado ? "activo" : "inactivo"}`}>
                        {a.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="acciones">
                      {/* Al navegar a edicion, "state" pasa "from: gestionar" para
                          que CrearAdmin sepa que debe volver a esta pagina al guardar */}
                      <button
                        className="btn editar"
                        onClick={() => navigate(`/crear-admin/${a.id_usuario}`, { state: { from: "gestionar" } })}
                      >
                        Editar
                      </button>

                      {/* El texto y la clase del boton cambian segun el estado actual */}
                      <button
                        className={`btn ${a.estado ? "inactivar" : "activar"}`}
                        onClick={() => abrirModal(a)}
                      >
                        {a.estado ? "Inactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal de confirmacion: se renderiza solo si mostrarModal es true Y hay un admin seleccionado.
              El operador && en JSX hace render condicional: si lo de la izquierda es falso, no renderiza nada. */}
          {mostrarModal && adminSeleccionado && (
            <div className="modal">
              <div className="modal-content">
                <h3>Confirmar accion</h3>
                <p>
                  Seguro que deseas{" "}
                  {adminSeleccionado.estado ? "inactivar" : "activar"} este administrador?
                </p>
                <div className="modal-buttons">
                  <button className="btn confirmar" onClick={confirmarCambioEstado}>Confirmar</button>
                  <button className="btn cancelar"  onClick={() => setMostrarModal(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
