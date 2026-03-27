import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "../styles/dashboard.css";

export default function CrearAdmin() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(form);
  };

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <div className="dashboard-container">

          <button className="btn-volver-dashboard" onClick={() => navigate("/dashboard")}>
            Volver
          </button>

          <h2>Crear Administrador</h2>

          <form className="form-grid" onSubmit={handleSubmit}>

            <input
              name="nombre"
              placeholder="Nombre"
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Correo"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
            />

            <button className="btn-guardar">
              Crear Administrador
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}