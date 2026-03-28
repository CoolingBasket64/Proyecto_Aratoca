import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "../styles/dashboard.css";

export default function Dashboard() {

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <div className="dashboard-container">

          <h2>Panel de Administración - Aratoca</h2>

          <div className="dashboard-buttons">

            <Link to="/crear-discapacitado" className="dashboard-btn">
              Crear Discapacitado
            </Link>

            <Link to="/gestionar-discapacitado" className="dashboard-btn">
              Gestionar Discapacitado
            </Link>

            <Link to="/crear-admin" className="dashboard-btn">
              Crear Usuario
            </Link>

            <Link to="/gestionar-admin" className="dashboard-btn">
              Gestionar Usuarios
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}