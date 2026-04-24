import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/usuarioService";
import "../login.css";

export default function Login() {

  // useNavigate retorna la funcion "navigate" para cambiar de ruta programaticamente.
  const navigate = useNavigate();

  // useState crea variables reactivas: cuando su valor cambia, React vuelve a renderizar el componente.
  // El primer valor es el estado actual, el segundo es la funcion para actualizarlo.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Llama al servicio que hace fetch POST a /api/usuarios/login con las credenciales.
      // Si las credenciales son incorrectas, el servicio lanza un Error y saltamos al catch.
      const data = await login(email, password);

      // Guardamos el token JWT en localStorage para usarlo en futuras peticiones al backend.
      // El token se envia automaticamente en cada fetch a traves de authHeaders().
      localStorage.setItem("token", data.token);

      // Guardamos los datos del usuario (nombre, email, rol) para mostrarlos en la UI.
      // JSON.stringify convierte el objeto a string porque localStorage solo guarda texto.
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // "replace: true" evita que el usuario pueda volver al login con el boton "atras".
      // Despues de login, /login ya no debe ser accesible presionando atras.
      navigate("/dashboard", { replace: true });

      alert("Login exitoso");

    } catch (error: any) {
      // error.message contiene el mensaje que lanzo el servicio (ej: "Usuario o contrasena incorrectos")
      alert(error.message);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <center><h2>Iniciar sesion</h2></center>

        {/* Inputs controlados: su valor viene del estado de React (value={email}),
            y cada tecla que el usuario presiona actualiza el estado (onChange).
            Esto permite que React siempre tenga acceso al valor actual del input. */}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Ingresar
        </button>

        <button
          className="btn-volver"
          onClick={() => navigate("/")}
        >
          Volver
        </button>

      </div>

    </div>
  );
}
