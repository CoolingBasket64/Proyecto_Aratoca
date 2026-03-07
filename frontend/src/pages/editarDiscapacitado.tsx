import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "../styles/dashboard.css";

export default function InactivarDiscapacitado() {

    const navigate = useNavigate();

    const [documento, setDocumento] = useState("");

    const inactivar = () => {
        console.log("inactivar", documento);
    };

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                <div className="dashboard-container">

                    <button className="btn-volver-dashboard" onClick={() => navigate("/dashboard")}>
                        Volver
                    </button>

                    <h2>Inactivar Persona con Discapacidad</h2>

                    <div className="form-grid">

                        <input
                            placeholder="Documento"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                        />

                        <button className="btn-guardar" onClick={inactivar}>
                            Inactivar
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}