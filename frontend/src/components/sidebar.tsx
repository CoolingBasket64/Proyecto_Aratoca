import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

// Sidebar es la barra lateral de navegacion que aparece en todas las paginas del panel admin.
// En escritorio ocupa un ancho fijo a la izquierda dentro del contenedor flex de cada pagina.
// En movil se convierte en un panel off-canvas: se oculta fuera de la pantalla a la izquierda
// y se desliza hacia adentro cuando el usuario pulsa el boton de menu.
export default function Sidebar() {

  // useNavigate devuelve la funcion "navigate" para cambiar de ruta desde codigo.
  // Se usa en cerrarSesion porque la redireccion ocurre despues de una accion (no al hacer clic en un enlace).
  const navigate = useNavigate();

  // isOpen controla si el sidebar esta visible en movil.
  // En escritorio este estado no tiene efecto: el sidebar siempre se muestra gracias a CSS.
  // false = sidebar fuera de pantalla (posicion left: -260px).
  // true  = sidebar visible (clase "sidebar-open" cambia left a 0).
  const [isOpen, setIsOpen] = useState(false);

  // cerrar es una funcion auxiliar que pone isOpen en false.
  // Se reutiliza en tres lugares: el boton X, el backdrop y cada Link de navegacion.
  // Al navegar en movil el sidebar debe cerrarse para no tapar el contenido de la nueva pagina.
  const cerrar = () => setIsOpen(false);

  // cerrarSesion elimina los datos de sesion guardados en localStorage y redirige al inicio.
  // "token"   : el JWT que autentica las peticiones al backend; sin el, ProtectedRoute bloquea el acceso.
  // "usuario" : los datos del usuario (nombre, email) usados para mostrar informacion en la UI.
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  // El Fragment (<>) agrupa tres elementos hermanos sin agregar un nodo extra al DOM:
  // 1. El boton hamburguesa (fuera del sidebar, visible en movil).
  // 2. El backdrop semitransparente (aparece cuando el sidebar esta abierto en movil).
  // 3. El panel del sidebar en si.
  return (
    <>
      {/* Boton hamburguesa: solo visible en movil gracias a la regla CSS
          ".sidebar-hamburger { display: none }" que se sobreescribe con
          "display: flex" dentro del @media (max-width: 768px).
          Al hacer clic pone isOpen en true para abrir el sidebar. */}
      <button
        className="sidebar-hamburger"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Backdrop: capa semitransparente que cubre el contenido principal cuando el sidebar
          esta abierto en movil. Solo se renderiza cuando isOpen es true (render condicional con &&).
          Al hacer clic sobre ella llama cerrar(), permitiendo cerrar el sidebar
          sin necesidad de usar el boton X. */}
      {isOpen && <div className="sidebar-backdrop" onClick={cerrar} />}

      {/* El sidebar recibe la clase "sidebar-open" cuando isOpen es true.
          En movil, esa clase cambia la propiedad "left" de -260px a 0,
          deslizando el panel hacia adentro gracias a "transition: left 0.25s ease".
          En escritorio la clase no tiene efecto porque el sidebar tiene position estatica. */}
      <div className={`sidebar${isOpen ? " sidebar-open" : ""}`}>

        {/* Boton de cierre dentro del sidebar: visible solo en movil via CSS.
            Permite al usuario cerrar el sidebar sin tener que tocar el backdrop. */}
        <button
          className="sidebar-close"
          onClick={cerrar}
          aria-label="Cerrar menu"
        >
          ✕
        </button>

        <h2 className="sidebar-title">Aratoca</h2>

        {/* Cada Link llama cerrar() en su onClick para que, al navegar en movil,
            el sidebar se oculte automaticamente antes de que se muestre la nueva pagina.
            En escritorio onClick no produce ningun cambio visible porque el sidebar
            siempre esta fijo en pantalla. */}
        <nav className="sidebar-menu">

          <Link to="/dashboard" className="sidebar-link" onClick={cerrar}>
            🏠 Dashboard
          </Link>

          <Link to="/crear-discapacitado" className="sidebar-link" onClick={cerrar}>
            ➕ Crear PCD
          </Link>

          <Link to="/gestionar-discapacitado" className="sidebar-link" onClick={cerrar}>
            ⚙️ Gestionar PCD
          </Link>

          <Link to="/crear-admin" className="sidebar-link" onClick={cerrar}>
            👤 Crear Usuario
          </Link>

          <Link to="/gestionar-admin" className="sidebar-link" onClick={cerrar}>
            ⚙️ Gestionar Usuarios
          </Link>

          <Link to="/reportes" className="sidebar-link" onClick={cerrar}>
            📊 Generar Reportes
          </Link>

        </nav>

        <button className="logout-btn" onClick={cerrarSesion}>
          <span className="icon">🚪</span>
          Cerrar sesión
        </button>

      </div>
    </>
  );
}
