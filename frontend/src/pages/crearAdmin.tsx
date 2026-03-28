import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "../styles/dashboard.css";

import { crearAdmin, editarAdmin, obtenerAdminPorId } from "../services/usuarioService";

export default function CrearAdmin() {

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const from = location.state?.from;
  const esEdicion = !!id;

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  // 🔥 Cargar admin si es edición
  useEffect(() => {
    if (esEdicion) {
      cargarAdmin();
    }
  }, [id]);

  const cargarAdmin = async () => {
    try {
      const data = await obtenerAdminPorId(Number(id));

      setForm({
        nombre: data.nombre || "",
        email: data.email || "",
        password: "" // 🔥 nunca cargar password
      });

    } catch (error) {
      console.error(error);
      setMensaje("Error cargando administrador ❌");
      setTipoMensaje("error");
    }
  };

  // 🔄 Manejo de inputs
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🚀 Submit (crear o editar)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (esEdicion) {
        await editarAdmin(Number(id), form);
        setMensaje("Administrador actualizado correctamente ✅");
      } else {
        await crearAdmin(form);
        setMensaje("Administrador creado correctamente ✅");
      }

      setTipoMensaje("success");

      setTimeout(() => {
        navigate("/gestionar-admin");
      }, 1500);

    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error ❌");
      setTipoMensaje("error");
    }
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <div className="dashboard-container">

          <button
            className="btn-volver-dashboard"
            onClick={() => {
              if (from === "gestionar") {
                navigate("/gestionar-admin");
              } else {
                navigate("/dashboard");
              }
            }}
          >
            Volver
          </button>

          <h2>
            {esEdicion ? "Editar Administrador" : "Crear Administrador"}
          </h2>

          {/* 🔥 MENSAJE */}
          {mensaje && (
            <div className={`alerta ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          <form className="form-grid" onSubmit={handleSubmit}>

            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />

            <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required />

            <input type="password" name="password" placeholder={ esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"
            }
              value={form.password}
              onChange={handleChange}
              required={!esEdicion}
            />

            <button className="btn-guardar">
              {esEdicion ? "Actualizar" : "Crear Administrador"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}