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
            
            <Link to="/editar-discapacitado" className="dashboard-btn">
              Editar Discapacitado
            </Link>

            <Link to="/inactivar-discapacitado" className="dashboard-btn">
              Inactivar Discapacitado
            </Link>

            <Link to="/crear-admino" className="dashboard-btn">
              Crear Admin
            </Link>
          </div>

        </div>

      </div>

    </div>

  );

}