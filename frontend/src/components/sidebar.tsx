import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

// Barra lateral de navegacion que aparece en todas las paginas del panel de administrador
export default function Sidebar() {

  // useNavigate retorna una funcion que permite cambiar de pagina programaticamente
  // (sin que el usuario haga clic en un enlace)
  const navigate = useNavigate();

  const cerrarSesion = () => {
    // Elimina los datos del usuario del localStorage para cerrar la sesion
    // Despues de esto, ProtectedRoute bloqueara el acceso a las rutas privadas
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="sidebar">

      <h2 className="sidebar-title">Aratoca</h2>

      {/* Link es el componente de React Router para navegar entre paginas
          sin recargar el navegador, a diferencia de una etiqueta <a> normal */}
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
