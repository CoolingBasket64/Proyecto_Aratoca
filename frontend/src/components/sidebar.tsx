import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

// Sidebar es la barra lateral de navegacion que aparece en todas las paginas del panel admin.
// Se incluye en cada pagina privada directamente (no en App.tsx) para mayor control.
export default function Sidebar() {

  // useNavigate retorna una funcion para cambiar de pagina desde el codigo (navegacion programatica).
  // Es distinto a <Link> que navega al hacer clic; useNavigate permite navegar despues de una accion.
  const navigate = useNavigate();

  const cerrarSesion = () => {
    // Eliminamos ambos datos de sesion del localStorage.
    // "token": el JWT que autentica las peticiones al backend.
    // "usuario": los datos del usuario (nombre, email, rol) que se muestran en la UI.
    // Al borrarlos, ProtectedRoute bloqueara el acceso a cualquier ruta privada.
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    // Redirige al usuario a la pagina de inicio
    navigate("/");
  };

  return (
    <div className="sidebar">

      <h2 className="sidebar-title">Aratoca</h2>

      {/* Link es el componente de React Router para navegar entre paginas.
          A diferencia de <a href="...">, Link NO recarga el navegador.
          Solo actualiza la URL y renderiza el nuevo componente, preservando el estado de la app. */}
      <nav className="sidebar-menu">

        <Link to="/dashboard" className="sidebar-link">
          🏠 Dashboard
        </Link>

        <Link to="/crear-discapacitado" className="sidebar-link">
          ➕ Crear Discapacitado
        </Link>

        <Link to="/gestionar-discapacitado" className="sidebar-link">
          ⚙️ Gestionar Discapacitado
        </Link>

        <Link to="/crear-admin" className="sidebar-link">
          👤 Crear Usuario
        </Link>

        <Link to="/gestionar-admin" className="sidebar-link">
          ⚙️ Gestionar Usuarios
        </Link>

        <Link to="/reportes" className="sidebar-link">
          📊 Generar Reportes
        </Link>

      </nav>

      <button className="logout-btn" onClick={cerrarSesion}>
        <span className="icon">🚪</span>
        Cerrar sesión
      </button>

    </div>
  );
}
