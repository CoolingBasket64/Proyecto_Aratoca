import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/usuarioService";
import "../login.css";

export default function Login() {

  // useNavigate permite redirigir al usuario a otra pagina desde el codigo
  const navigate = useNavigate();

  // useState crea una variable reactiva: cuando cambia su valor, React re-renderiza el componente.
  // El primer valor es el estado actual, el segundo es la funcion para actualizarlo.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {
      // Llama al servicio que hace fetch al backend con las credenciales
      const data = await login(email, password);

      // Guarda los datos del usuario en localStorage para mantener la sesion activa
      // JSON.stringify convierte el objeto a texto porque localStorage solo guarda strings
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Redirige al dashboard. "replace: true" evita que el usuario pueda
      // volver al login con el boton "atras" del navegador
      navigate("/dashboard", { replace: true });

      console.log("Login exitoso:", data);

      alert("Login exitoso");

      navigate("/dashboard");

    } catch (error: any) {
      // Si el backend respondio con error (credenciales incorrectas), muestra el mensaje
      alert(error.message);
    }

  };

  return (
    <div className="login-page">

      <div className="login-card">

        <center><h2>Iniciar sesion</h2></center>

        {/* Cada input esta controlado por React: su valor viene del estado
            y cada cambio actualiza el estado mediante onChange */}
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
