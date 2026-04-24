import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import "../../styles/dashboard.css";

import { crearAdmin, editarAdmin, obtenerAdminPorId } from "../../services/usuarioService";

export default function CrearAdmin() {

  const navigate = useNavigate();

  // useParams lee los parametros de la URL. Si la URL es /crear-admin/5, id = "5"
  // Si la URL es /crear-admin (sin ID), id = undefined
  const { id } = useParams();

  // useLocation da acceso al estado que se puede pasar al navegar entre paginas
  // Se usa para saber si venimos de "gestionar" y poder volver al lugar correcto
  const location = useLocation();
  const from = location.state?.from;

  // Si hay un ID en la URL, es edicion. Si no hay ID, es creacion
  // !! convierte cualquier valor a booleano: !!undefined = false, !!"5" = true
  const esEdicion = !!id;

  // Estado del formulario: un objeto con todos los campos del admin
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  // useEffect con [id] como dependencia: se ejecuta cada vez que cambia el valor de "id"
  // Si es edicion (hay ID), carga los datos del admin para prellenar el formulario
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
        password: "" // La contrasena nunca se precarga por seguridad
      });

    } catch (error) {
      console.error(error);
      setMensaje("Error cargando administrador");
      setTipoMensaje("error");
    }
  };

  // Maneja cualquier cambio en los inputs del formulario.
  // [e.target.name] usa el nombre del input como clave del objeto (nombre dinamico de propiedad)
  // El operador spread (...form) copia todas las propiedades actuales y solo sobreescribe la que cambio
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Se ejecuta al enviar el formulario
  const handleSubmit = async (e: any) => {
    // Evita que el formulario recargue la pagina (comportamiento por defecto del navegador)
    e.preventDefault();

    try {
      if (esEdicion) {
        await editarAdmin(Number(id), form);
        setMensaje("Administrador actualizado correctamente");
      } else {
        await crearAdmin(form);
        setMensaje("Administrador creado correctamente");
      }

      setTipoMensaje("success");

      // Espera 1.5 segundos para que el usuario vea el mensaje y luego navega
      setTimeout(() => {
        navigate("/gestionar-admin");
      }, 1500);

    } catch (error) {
      console.error(error);
      setMensaje("Ocurrio un error");
      setTipoMensaje("error");
    }
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <div className="dashboard-container dashboard-container-form">

          {/* Boton volver: regresa a "gestionar" o al "dashboard" segun de donde vino */}
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

          {/* El titulo cambia segun si es creacion o edicion */}
          <h2>
            {esEdicion ? "Editar Administrador" : "Crear Administrador"}
          </h2>

          {mensaje && (
            <div className={`alerta ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          <form className="form-grid" onSubmit={handleSubmit}>

            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />

            <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required />

            {/* En edicion la contrasena es opcional, en creacion es obligatoria */}
            <input
              type="password"
              name="password"
              placeholder={esEdicion ? "Nueva contrasena (opcional)" : "Contrasena"}
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
