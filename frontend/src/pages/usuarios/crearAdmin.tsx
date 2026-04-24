import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import "../../styles/dashboard.css";
import { crearAdmin, editarAdmin, obtenerAdminPorId } from "../../services/usuarioService";

// Este componente maneja tanto CREACION como EDICION de administradores.
// La diferencia la determina si la URL tiene un :id o no.
export default function CrearAdmin() {

  const navigate = useNavigate();

  // useParams lee los parametros dinamicos de la URL.
  // Si la ruta es /crear-admin/5, entonces id = "5".
  // Si la ruta es /crear-admin (sin ID), entonces id = undefined.
  const { id } = useParams();

  // useLocation da acceso al objeto location que contiene informacion de la navegacion actual.
  // "state" es informacion extra que se puede pasar al navegar (no aparece en la URL).
  // Se usa para saber desde que pagina venimos y poder volver al lugar correcto.
  const location = useLocation();
  const from = location.state?.from; // "gestionar" si venimos de la lista de admins

  // !! convierte cualquier valor a booleano: !!undefined = false, !!"5" = true.
  // Si hay ID, estamos en modo edicion; si no, en modo creacion.
  const esEdicion = !!id;

  // Estado del formulario con todos los campos del administrador.
  const [form, setForm] = useState({
    nombre:   "",
    email:    "",
    password: ""
  });

  const [mensaje,     setMensaje]     = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  // useEffect con [id] como dependencia: se ejecuta cada vez que "id" cambia.
  // La primera vez que monta el componente: si hay ID, carga los datos del admin para prellenar el form.
  useEffect(() => {
    if (esEdicion) cargarAdmin();
  }, [id]);

  const cargarAdmin = async () => {
    try {
      const data = await obtenerAdminPorId(Number(id));
      setForm({
        nombre:   data.nombre || "",
        email:    data.email  || "",
        password: "" // La contrasena NUNCA se precarga: no se debe mostrar aunque este hasheada
      });
    } catch (error) {
      console.error(error);
      setMensaje("Error cargando administrador");
      setTipoMensaje("error");
    }
  };

  // handleChange es un unico manejador para todos los inputs del formulario.
  // e.target.name es el atributo "name" del input que disparo el evento.
  // [e.target.name] es una "clave dinamica": usa el valor de la variable como nombre de propiedad.
  // El spread ...form copia todas las propiedades del estado anterior y solo sobreescribe la que cambio.
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    // e.preventDefault() cancela el comportamiento por defecto del formulario,
    // que seria recargar la pagina al hacer submit.
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

      // setTimeout ejecuta una funcion despues del tiempo indicado (en milisegundos).
      // Espera 1.5 segundos para que el usuario lea el mensaje, luego redirige.
      setTimeout(() => navigate("/gestionar-admin"), 1500);

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

          {/* Boton volver: si venimos de la lista de admins vuelve ahi,
              si venimos del dashboard vuelve al dashboard */}
          <button className="btn-volver-dashboard" onClick={() => {
            if (from === "gestionar") navigate("/gestionar-admin");
            else navigate("/dashboard");
          }}>
            Volver
          </button>

          {/* El titulo cambia segun el modo */}
          <h2>{esEdicion ? "Editar Administrador" : "Crear Administrador"}</h2>

          {/* El operador && en JSX: "si hay mensaje, renderiza el div" */}
          {mensaje && <div className={`alerta ${tipoMensaje}`}>{mensaje}</div>}

          <form className="form-grid" onSubmit={handleSubmit}>

            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* En creacion el campo es obligatorio (required).
                En edicion es opcional: si se deja vacio, la contrasena actual no cambia. */}
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
