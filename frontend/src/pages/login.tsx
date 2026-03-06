import { useNavigate } from "react-router-dom";
import "../login.css"

export default function Login() {

  const navigate = useNavigate();

  return (
    <div className="login-page">

      <div className="login-card">

        <center><h2>Iniciar sesión</h2></center>

        <input type="text" placeholder="Usuario" />

        <input type="password" placeholder="Contraseña" />

        <button>Ingresar</button>

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