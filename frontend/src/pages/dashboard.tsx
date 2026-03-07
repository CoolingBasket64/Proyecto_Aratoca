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

            <button className="dashboard-btn">Crear Discapacitado</button>

            <button className="dashboard-btn">Editar Discapacitado</button>

            <button className="dashboard-btn">Inactivar Discapacitado</button>

            <button className="dashboard-btn">Crear Administrador</button>

          </div>

        </div>

      </div>

    </div>

  );

}