import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Mapa from "../components/mapa";
import { obtenerPersonas } from "../services/personService";
import type { Persona } from "../types/person";

export default function Home() {

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filtroDiscapacidad, setFiltroDiscapacidad] = useState<string>("");

  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | null>(null);
  const [nombreSector, setNombreSector] = useState<string | null>(null);

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

  // SOLO FILTRO DE DISCAPACIDAD (para los contadores)
  const personasFiltradas = lista.filter((p) => {
    if (p.activo !== 1) return false;

    return (
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase()
    );
  });

  // FILTRO FINAL (panel)
 
  const personasPanel = lista.filter((p) => {
    if (p.activo !== 1) return false;
    if (!sectorSeleccionado) return false;

    const cumpleDiscapacidad =
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase();

    return cumpleDiscapacidad && p.cod_sector === sectorSeleccionado;
  });

  const totalPersonas = lista.filter((p) => {
    if (p.activo !== 1) return false;
    return (
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase()
    );
  }).length;

  return (
    <div className="app">

      <header className="nav">
        <Link to="/login">
          <button className="login-btn">🔒 Iniciar sesión</button>
        </Link>
      </header>

      <div className="app-container">

        {/* MAPA */}
        <div className="mapa-container">
          <Mapa
            personas={personasFiltradas} // 🔥 importante
            onSelectPersona={() => {}}
            onSelectSector={setSectorSeleccionado}
            onSelectNombreSector={setNombreSector}
          />
        </div>

        {/* PANEL */}
        <div className="panel-container">

          <h2>Personas: {sectorSeleccionado ? personasPanel.length : totalPersonas}</h2>

          {nombreSector && (
            <p><strong>Sector:</strong> {nombreSector}</p>
          )}

          <hr />

          {/* FILTRO */}
          <div className="filtro-discapacidad">
            <h3>Filtrar por discapacidad</h3>

            <select className="filtro"
              value={filtroDiscapacidad}
              onChange={(e) => setFiltroDiscapacidad(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Física">Física</option>
              <option value="Visual">Visual</option>
              <option value="Auditiva">Auditiva</option>
              <option value="Intelectual">Intelectual</option>
              <option value="Psicosocial">Psicosocial</option>
              <option value="Múltiple">Múltiple</option>
            </select>
          </div>
          
          
          <hr />

          {/* LISTA */}
          {!sectorSeleccionado ? (
            <p>Selecciona un sector en el mapa</p>
          ) : personasPanel.length > 0 ? (
            personasPanel.map((p) => (
              <div key={p.id_persona} className="personas">
                <h3><strong>{p.codigo}</strong></h3>
                <p><strong>Edad: </strong>{p.edad}</p>
                <p><strong>Sexo: </strong>{p.sexo}</p>
                <p>
                  <strong>Discapacidad: </strong>{" "}
                  {p.discapacidad ? p.discapacidad.toUpperCase() : "No registrada"}
                </p>
                <p><strong>Cuidador: </strong>{p.tiene_cuidador ? "Sí" : "No"}</p>
                <p><strong>RLCPD: </strong>{p.rlcpd === "SÍ" ? "Sí" : "No"}</p>
                
                <hr />
              </div>
            ))
          ) : (
            <p>No hay personas en este sector</p>
          )}

        </div>
      </div>
    </div>
  );
}