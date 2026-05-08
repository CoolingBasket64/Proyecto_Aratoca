import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login, recuperarContrasena } from "../services/usuarioService";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Controla si mostramos el formulario de recuperacion o el de login
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/dashboard", { replace: true });
      alert("Login exitoso");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRecovery = async () => {
  if (!recoveryEmail.trim()) {
    alert("Por favor ingresa tu email.");
    return;
  }
  try {
    await recuperarContrasena(recoveryEmail); // ← llamada real al backend
    setRecoverySent(true);
  } catch (error: any) {
    alert(error.message);
  }
};

  // ── Vista: Recuperar contraseña ──────────────────────────────────────────
  if (showRecovery) {
    return (
      <div className="login-page">
        <div className="login-card">

          <button
            className="btn-volver"
            onClick={() => { setShowRecovery(false); setRecoverySent(false); setRecoveryEmail(""); }}
          >
            ← Volver al inicio
          </button>

          <center><h2>Recuperar contraseña</h2></center>

          {recoverySent ? (
            // Mensaje de confirmacion tras enviar el email
            <p className="recovery-success">
              ✓ Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.
            </p>
          ) : (
            <>
              <p className="recovery-hint">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <input
                type="email"
                placeholder="Email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
              />

              <button onClick={handleRecovery}>
                Enviar enlace
              </button>
            </>
          )}

        </div>
      </div>
    );
  }

  // ── Vista: Login ─────────────────────────────────────────────────────────
  return (
    <div className="login-page">
      <div className="login-card">

        <center><h2>Iniciar sesion</h2></center>

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

        {/* Enlace de recuperacion debajo del input de contraseña */}
        <span
          className="recovery-link"
          onClick={() => setShowRecovery(true)}
        >
          ¿Olvidaste tu contraseña?
        </span>

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