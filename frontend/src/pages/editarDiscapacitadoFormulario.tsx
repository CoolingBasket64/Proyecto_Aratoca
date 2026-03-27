import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { editarPersona, obtenerPersonas } from "../services/personService";
import type { Persona } from "../types/person";
import "../styles/dashboard.css";

export default function EditarPersonaForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Persona>>({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarPersona();
  }, []);

  const cargarPersona = async () => {
    try {
      const personas = await obtenerPersonas();
      const persona = personas.find(p => p.id_persona === Number(id));

      if (persona) {
        setForm({
          ...persona,
          fecha_nacimiento: persona.fecha_nacimiento
            ? persona.fecha_nacimiento.split("T")[0]
            : ""
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardar = async () => {
    try {
      await editarPersona(Number(id), form);
      setMensaje("Persona actualizada correctamente ✅");

      setTimeout(() => navigate("/editar-discapacitado"), 2000);
    } catch (error) {
      setMensaje("Error al actualizar ❌");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-container">

          <h2>Editar Persona</h2>

          {mensaje && <div className="alerta">{mensaje}</div>}

          <div className="form-grid">

            <input
              name="documento"
              value={form.documento || ""}
              onChange={handleChange}
              placeholder="Documento"
            />

            <input
              name="primer_nombre"
              value={form.primer_nombre || ""}
              onChange={handleChange}
              placeholder="Primer Nombre"
            />

            <input
              name="segundo_nombre"
              value={form.segundo_nombre || ""}
              onChange={handleChange}
              placeholder="Segundo Nombre"
            />

            <input
              name="primer_apellido"
              value={form.primer_apellido || ""}
              onChange={handleChange}
              placeholder="Primer Apellido"
            />

            <input
              name="segundo_apellido"
              value={form.segundo_apellido || ""}
              onChange={handleChange}
              placeholder="Segundo Apellido"
            />

            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento || ""}
              onChange={handleChange}
            />

            <select name="sexo" value={form.sexo || ""} onChange={handleChange}>
              <option value="">Sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>

            <input
              name="discapacidad"
              value={form.discapacidad || ""}
              onChange={handleChange}
              placeholder="Discapacidad"
            />

            <input
              name="celular"
              value={form.celular || ""}
              onChange={handleChange}
              placeholder="Celular"
            />

            <button className="btn-guardar" onClick={guardar}>
              Guardar Cambios
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}