import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/dashboard.css";

export default function InactivarDiscapacitado() {

  const navigate = useNavigate();
  const [documento, setDocumento] = useState("");

  const inactivar = () => {
    console.log("Inactivar persona", documento);
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar izquierda */}
      <Sidebar />

      {/* Contenido */}
      <div className="dashboard-content">

        <div className="dashboard-container">

          {/* Botón para volver al dashboard */}
          <button
            type="button"
            className="btn-volver-dashboard"
            onClick={() => navigate("/dashboard")}
          >
            Volver
          </button>

          <h2>Inactivar Persona con Discapacidad</h2>

          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              inactivar();
            }}
          >
            <input
              name="documento"
              placeholder="Documento de la persona"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
            />

            <button className="btn-guardar" type="submit">
              Inactivar
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}