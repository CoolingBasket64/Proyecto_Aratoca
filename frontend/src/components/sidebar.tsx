import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
export default function Sidebar() {

  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="sidebar">

      <h2 className="sidebar-title">Aratoca</h2>

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

      </nav>

      <button className="logout-btn" onClick={cerrarSesion}>
        <span className="icon">🚪</span>
        Cerrar sesión
      </button>

    </div>
  );
}