import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Mapa from "../components/mapa";
import { obtenerPersonasPublicas } from "../services/personService";
import type { Persona } from "../types/person";

export default function Home() {

  const [personas, setPersonas] = useState<Partial<Persona>[]>([]);
  const [filtroDiscapacidad, setFiltroDiscapacidad] = useState<string>("");
  const [filtroVereda, setFiltroVereda] = useState<string>("");
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | null>(null);
  const [nombreSector, setNombreSector] = useState<string | null>(null);
  const [nombreVereda, setNombreVereda] = useState<string | null>(null);
  const [filtroBarrio, setFiltroBarrio] = useState<string>("");
  const [mapaKey, setMapaKey] = useState(0);

  const lista = Array.isArray(personas) ? personas : [];

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        const data = await obtenerPersonasPublicas();
        setPersonas(data);
      } catch (error) {
        console.error("Error cargando personas:", error);
      }
    };
    cargarPersonas();
  }, []);

  // Lista única de veredas: usa zona "URBANO" como vereda cuando vereda es null
  const veredasDisponibles = [...new Set(
    lista
      .filter(p => p.activo === 1)
      .map(p => p.zona === "URBANO" ? "URBANO" : p.vereda)
      .filter(Boolean) as string[]
  )].sort();

  // Verifica si el filtro de vereda coincide con una persona
  const cumpleVeredaFn = (p: Partial<Persona>) => {
    if (filtroVereda === "") return true;
    if (filtroVereda === "URBANO") return p.zona === "URBANO";
    return p.vereda === filtroVereda;
  };

  const esZonaUrbana =
    filtroVereda === "URBANO" ||
    (sectorSeleccionado
      ? lista.find(p => p.cod_sector === sectorSeleccionado)?.zona === "URBANO"
      : false);

  const barriosDisponibles = esZonaUrbana
    ? [...new Set(lista
        .filter(p => p.zona === "URBANO" && p.barrio && (!sectorSeleccionado || p.cod_sector === sectorSeleccionado))
        .map(p => p.barrio as string)
      )].sort()
    : [];

  const personasFiltradas = lista.filter((p) => {
    if (p.activo !== 1) return false;

    const cumpleDiscapacidad =
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase();

    const cumpleBarrio = !esZonaUrbana || filtroBarrio === "" || p.barrio === filtroBarrio;

    return cumpleDiscapacidad && cumpleVeredaFn(p) && cumpleBarrio;
  });

  const personasPanel = lista.filter((p) => {
    if (p.activo !== 1) return false;
    if (!sectorSeleccionado) return false;

    const cumpleDiscapacidad =
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase();

    const cumpleBarrio =
      !esZonaUrbana || filtroBarrio === "" || p.barrio === filtroBarrio;

    return cumpleDiscapacidad && cumpleBarrio && cumpleVeredaFn(p) && (p.cod_sector === sectorSeleccionado || p.sector?.toUpperCase() === nombreSector?.toUpperCase());
  });

  const totalPersonas = lista.filter((p) => {
    if (p.activo !== 1) return false;
    const cumpleDiscapacidad =
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase();
    return cumpleDiscapacidad && cumpleVeredaFn(p);
  }).length;

 

  return (
    <div className="app">

      <header className="nav">
        <Link to="/login">
          <button className="login-btn">🔒 Iniciar sesion</button>
        </Link>
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          onClick={() => { window.location.href = "/"; }}
          title="Actualizar página"
        >
          <span style={{ fontSize: "13px", color: "#555", userSelect: "none" }}>🔄 Actualizar página</span>
          <img
            src="/logo.png"
            alt="Logo PPDIS Aratoca"
            style={{ height: "52px" }}
          />
        </div>
      </header>

      <div className="app-container">

        <div className="mapa-container">
          <Mapa
            key={mapaKey}
            personas={personasFiltradas}
            onSelectPersona={() => { }}
            onSelectSector={(cod) => { setSectorSeleccionado(cod); setFiltroBarrio(""); }}
            onSelectNombreSector={setNombreSector}
            onSelectVereda={setNombreVereda}
          />
        </div>

        <div className="panel-container">

          <h2>Personas: {sectorSeleccionado ? personasPanel.length : totalPersonas}</h2>

          {nombreVereda && !esZonaUrbana && (
            <p><strong>Vereda:</strong> {nombreVereda}</p>
          )}
          {nombreSector && (
            <p><strong>Sector:</strong> {nombreSector}</p>
          )}

          <hr />

          {/* Filtro de discapacidad */}
          <div className="filtro-discapacidad">
            <h3>Filtrar por discapacidad</h3>
            <select className="filtro"
              value={filtroDiscapacidad}
              onChange={(e) => setFiltroDiscapacidad(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="FÍSICA">Fisica</option>
              <option value="Visual">Visual</option>
              <option value="Auditiva">Auditiva</option>
              <option value="Intelectual">Intelectual</option>
              <option value="Psicosocial">Psicosocial</option>
              <option value="MÚLTIPLE">Multiple</option>
            </select>
          </div>

          {/* Filtro de vereda */}
          <div className="filtro-discapacidad">
            <h3>Filtrar por zona</h3>
            <select className="filtro"
              value={filtroVereda}
              onChange={(e) => {
                setFiltroVereda(e.target.value);
                setSectorSeleccionado(null);
                setFiltroBarrio("");
                setMapaKey(k => k + 1);
              }}
            >
              <option value="">Todas</option>
              {veredasDisponibles.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Filtro de barrio: solo en zona urbana */}
          {esZonaUrbana && (
            <>
              <div className="filtro-discapacidad">
                <h3>Filtrar por barrio</h3>
                <select
                  className="filtro"
                  value={filtroBarrio}
                  onChange={(e) => setFiltroBarrio(e.target.value)}
                >
                  <option value="">Todos los barrios</option>
                  {barriosDisponibles.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <hr />
            </>
          )}

          <hr />

          {(sectorSeleccionado ? personasPanel : personasFiltradas).length === 0 ? (
            <p>No hay personas en este sector</p>
          ) : (
            (sectorSeleccionado ? personasPanel : personasFiltradas).map((p) => (
              <div key={p.id_persona} className="personas">
                <h3><strong>{p.codigo}</strong></h3>
                <p><strong>Edad: </strong>{p.edad}</p>
                <p><strong>Sexo: </strong>{p.sexo}</p>
                <p>
                  <strong>Discapacidad: </strong>{" "}
                  {p.discapacidad ? p.discapacidad.toUpperCase() : "No registrada"}
                </p>
                <p><strong>Cuidador: </strong>{p.tiene_cuidador ? "Si" : "No"}</p>
                <p><strong>RLCPD: </strong>{p.rlcpd === "SÍ" ? "Si" : "No"}</p>
                <hr />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}