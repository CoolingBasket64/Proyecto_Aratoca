import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/dashboard.css";

export default function CrearDiscapacitado() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    cod_tipo_doc: "",
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

  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState<"success" | "error">("success");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:7800/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cod_tipo_doc: Number(form.cod_tipo_doc) // asegurar número
        }),
      });

      if (!response.ok) throw new Error("Error al crear la persona");
      const data = await response.json();
      setMensaje("Persona creada correctamente!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al crear la persona");
    }
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
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "1rem" }}>
              <label htmlFor="cod_tipo_doc">Tipo de Documento</label>
              <select
                id="cod_tipo_doc"
                name="cod_tipo_doc"
                onChange={handleChange}
                value={form.cod_tipo_doc || ""}
              >
                <option value="">Seleccione tipo de documento</option>
                <option value="1">Cédula de Ciudadanía</option>
                <option value="2">Cédula de Extranjería</option>
                <option value="3">Tarjeta de Identidad</option>
                <option value="4">Registro Civil</option>
                <option value="5">Pasaporte</option>
                <option value="6">Permiso por Protección Temporal</option>
              </select>
            </div>


            <input name="documento" placeholder="Documento" onChange={handleChange} />

            <input name="primer_nombre" placeholder="Primer Nombre" onChange={handleChange} />

            <input name="segundo_nombre" placeholder="Segundo Nombre" onChange={handleChange} />

            <input name="primer_apellido" placeholder="Primer Apellido" onChange={handleChange} />

            <input name="segundo_apellido" placeholder="Segundo Apellido" onChange={handleChange} />
            <h3 className="form-title">Datos Personales</h3>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: "1rem" }}>
              <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                onChange={handleChange}
              />
            </div>

            <select name="sexo" onChange={handleChange}>
              <option value="">Sexo</option>
              <option value="I">Indefinido</option>
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

            {mensaje && <p className={`mensaje ${mensajeTipo}`}>{mensaje}</p>}
            <button className="btn-guardar" type="submit">
              Guardar
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}