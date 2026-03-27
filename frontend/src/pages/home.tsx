import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Mapa from "../components/mapa";
import { obtenerPersonas } from "../services/personService";
import type { Persona } from "../types/person";

export default function Home() {

    const [personas, setPersonas] = useState<Persona[]>([]);
    const [personaSeleccionada, setPersonaSeleccionada] = useState<Persona | null>(null);
    const [filtroDiscapacidad, setFiltroDiscapacidad] = useState<string>("");
    const lista = Array.isArray(personas) ? personas : [];

    useEffect(() => {
        const cargarPersonas = async () => {
            try {
                const data = await obtenerPersonas();
                setPersonas(data);
            } catch (error) {
                console.error("Error cargando personas:", error);
            }
        };

        cargarPersonas();
    }, []);

    const personasFiltradas =
        filtroDiscapacidad === ""
            ? lista.filter(p => p.activo === 1)
            : lista.filter(
                (p) =>
                    p.activo === 1 &&
                    p.discapacidad?.toLowerCase() ===
                    filtroDiscapacidad.toLowerCase()
            );
    console.log("Personas filtradas con coordenadas:", personasFiltradas);
    return (
        <div className="app">

            <header className="nav">
                <Link to="/login">
                    <button className="login-btn">🔒 Iniciar sesión</button>
                </Link>
            </header>

            <div className="app-container">

                <div className="mapa-container">
                    <Mapa
                        personas={personasFiltradas}
                        onSelectPersona={setPersonaSeleccionada}
                    />
                </div>

                <div className="panel-container">

                    <h2>Personas Registradas: {personasFiltradas.length}</h2>
                    <hr />

                    {personaSeleccionada ? (
                        <div>
                            <h3>{personaSeleccionada.nombre_completo}</h3>
                            <p>Edad: {personaSeleccionada.edad}</p>
                            <p>Género: {personaSeleccionada.sexo === "M" ? "Masculino" : "Femenino"}</p>
                            <p>
                            Discapacidad:{" "}
                            {personaSeleccionada.discapacidad
                                ? personaSeleccionada.discapacidad.toUpperCase()
                                : "No registrada"}
                            </p>
                            <p>Sector: {personaSeleccionada.sector}</p>
                        </div>
                    ) : (
                        <p>Selecciona un punto en el mapa</p>
                    )}
                    <div className="filtro-discapacidad">
                        <h3>Filtrar por discapacidad</h3>

                        <select
                            className="select-discapacidad"
                            value={filtroDiscapacidad}
                            onChange={(e) => setFiltroDiscapacidad(e.target.value)}
                        >
                            <option value="">Todas</option>
                            <option value="Física">Física</option>
                            <option value="Visual">Visual</option>
                            <option value="Sordoceguera">Sordoceguera</option>
                            <option value="Intelectual">Intelectual</option>
                            <option value="Psicosocial-Mental">Psicosocial-Mental</option>
                            <option value="Múltiple">Múltiple</option>
                        </select>
                    </div>

                </div>

            </div>
        </div>
    );
}