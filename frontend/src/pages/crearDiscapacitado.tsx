import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/dashboard.css";

export default function CrearDiscapacitado() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    documento: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    fecha_nacimiento: "",
    sexo: "",
    discapacidad: "",
    celular: "",
    zona: "",
    vereda: "",
    sector: "",
    direccion: ""
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

      {/* Sidebar izquierda */}
      <Sidebar />

      {/* Contenido */}
      <div className="dashboard-content">

        <div className="dashboard-container">

          <button
            type="button"
            className="btn-volver-dashboard"
            onClick={() => navigate("/dashboard")}
          >
            Volver
          </button>

          <h2>Crear Persona con Discapacidad</h2>

          <form className="form-grid" onSubmit={handleSubmit}>

            <input name="documento" placeholder="Documento" onChange={handleChange} />

            <input name="primer_nombre" placeholder="Primer Nombre" onChange={handleChange} />

            <input name="segundo_nombre" placeholder="Segundo Nombre" onChange={handleChange} />

            <input name="primer_apellido" placeholder="Primer Apellido" onChange={handleChange} />

            <input name="segundo_apellido" placeholder="Segundo Apellido" onChange={handleChange} />

            <input type="date" name="fecha_nacimiento" onChange={handleChange} />

            <select name="sexo" onChange={handleChange}>
              <option value="">Sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>

            <input name="discapacidad" placeholder="Tipo de discapacidad" onChange={handleChange} />

            <input name="celular" placeholder="Celular" onChange={handleChange} />

            <h3 className="form-title">Ubicación</h3>

            <input name="zona" placeholder="Zona" onChange={handleChange} />

            <input name="vereda" placeholder="Vereda" onChange={handleChange} />

            <input name="sector" placeholder="Sector" onChange={handleChange} />

            <input name="direccion" placeholder="Dirección" className="full-width" onChange={handleChange} />

            <button className="btn-guardar" type="submit">
              Guardar
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}