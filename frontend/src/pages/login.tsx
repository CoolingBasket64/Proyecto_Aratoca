import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/usuarioService";
import "../login.css";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const data = await login(email, password);

      console.log("Login exitoso:", data);

      alert("Login exitoso");

      navigate("/dashboard");

    } catch (error: any) {

      alert(error.message);

    }

  };

  return (
    <div className="login-page">

      <div className="login-card">

        <center><h2>Iniciar sesión</h2></center>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
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
          ← Volver
        </button>

      </div>

    </div>
  );
}