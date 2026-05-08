import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/usuarioService";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";

    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [exito, setExito] = useState(false);

    const handleReset = async () => {
        if (!nuevaPassword || !confirmPassword) {
            alert("Completa todos los campos.");
            return;
        }
        if (nuevaPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        try {
            await resetPassword(token, nuevaPassword);
            setExito(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (error: any) {
            alert(error.message);
        }
    };

    if (exito) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <p className="recovery-success">
                        ✓ Contraseña actualizada correctamente. Redirigiendo al login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Nueva contraseña</h2>

                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleReset}>Guardar contraseña</button>
            </div>
        </div>
    );
}