import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaEdit, FaUserSlash, FaUserShield, FaChartBar } from "react-icons/fa";

export default function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {
        navigate("/login");
    };

    return (

        <div className="sidebar">

            <h2>Aratoca Admin</h2>

            <Link to="/dashboard"><FaChartBar /> Dashboard</Link>

            <Link to="/crear-discapacitado"><FaUserPlus /> Crear Discapacitado</Link>

            <Link to="/editar-discapacitado"><FaEdit /> Editar Discapacitado</Link>

            <Link to="/inactivar-discapacitado"><FaUserSlash /> Inactivar Discapacitado</Link>

            <Link to="/crear-admin"><FaUserShield /> Crear Admin</Link>

            <button className="logout" onClick={logout}>
                Cerrar Sesión
            </button>

        </div>

    );
}