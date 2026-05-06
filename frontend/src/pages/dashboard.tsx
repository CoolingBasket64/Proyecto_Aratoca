import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "../styles/dashboard.css";

// Dashboard es la pagina principal del panel de administracion.
// Muestra los accesos directos a las cinco secciones del sistema en forma de grilla de botones.
// Todas las rutas hijas del admin estan accesibles tambien desde el Sidebar lateral.
export default function Dashboard() {

  return (

    // dashboard-layout es un contenedor flex horizontal que divide la pantalla en dos partes:
    // 1. El Sidebar a la izquierda con navegacion fija.
    // 2. El contenido principal (dashboard-content) que ocupa el espacio restante.
    <div className="dashboard-layout">

      <Sidebar />

      {/* dashboard-content tiene overflow-y: auto para que el contenido sea desplazable
          si la pantalla es mas pequena que el contenido. */}
      <div className="dashboard-content">

        {/* dashboard-container es la tarjeta blanca con borde redondeado
            que envuelve el contenido de cada pagina del panel admin. */}
        <div className="dashboard-container">

          <h2>Panel de Administración - Aratoca</h2>

          {/* dashboard-buttons es una grilla de dos columnas con los accesos directos.
              Cada boton es un <Link> de React Router, lo que evita recargar la pagina
              al navegar y mantiene el estado de la aplicacion. */}
          <div className="dashboard-buttons">

            <Link to="/crear-discapacitado" className="dashboard-btn">
              Crear PCD
            </Link>

            <Link to="/gestionar-discapacitado" className="dashboard-btn">
              Gestionar PCD
            </Link>

            <Link to="/crear-admin" className="dashboard-btn">
              Crear Usuario
            </Link>

            <Link to="/gestionar-admin" className="dashboard-btn">
              Gestionar Usuarios
            </Link>

            {/* Este boton es el quinto en una grilla de dos columnas (numero impar).
                La regla CSS ".dashboard-btn:last-child:nth-child(odd)" lo centra
                dandole un ancho del 50% para que no ocupe toda la fila. */}
            <Link to="/reportes" className="dashboard-btn">
              Generar Reportes
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}
