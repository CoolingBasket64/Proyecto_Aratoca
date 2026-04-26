import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Mapa from "../components/mapa";
import { obtenerPersonasPublicas } from "../services/personService";
import type { Persona } from "../types/person";

export default function Home() {

  // Lista completa de personas cargadas desde el backend
  const [personas, setPersonas] = useState<Partial<Persona>[]>([]);
  // Tipo de discapacidad seleccionado en el filtro (vacio = todas)
  const [filtroDiscapacidad, setFiltroDiscapacidad] = useState<string>("");
  // Codigo del sector seleccionado en el mapa
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | null>(null);
  // Nombre del sector para mostrarlo en el panel
  const [nombreSector, setNombreSector] = useState<string | null>(null);
  // Nombre de la vereda del sector seleccionado
  const [nombreVereda, setNombreVereda] = useState<string | null>(null);
  // Barrio seleccionado en el filtro (solo aplica en zona Urbana)
  const [filtroBarrio, setFiltroBarrio] = useState<string>("");

  // Garantiza que personas siempre sea un array, aunque el backend devuelva algo inesperado
  const lista = Array.isArray(personas) ? personas : [];

  // Se ejecuta una vez al cargar la pagina para traer todas las personas del backend
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

  // Personas filtradas solo por discapacidad (se usa para los contadores del mapa)
  // Solo incluye personas activas
  const personasFiltradas = lista.filter((p) => {
    if (p.activo !== 1) return false;

    return (
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase()
    );
  });

  // true si el sector seleccionado pertenece a zona Urbana
  const esZonaUrbana = sectorSeleccionado
    ? lista.find(p => p.cod_sector === sectorSeleccionado)?.zona === "URBANO"
    : false;

  // Lista unica de barrios disponibles en el sector urbano seleccionado
  const barriosDisponibles = esZonaUrbana && sectorSeleccionado
    ? [...new Set(lista
        .filter(p => p.cod_sector === sectorSeleccionado && p.sector)
        .map(p => p.sector as string)
      )].sort()
    : [];

  // Personas que se muestran en el panel lateral:
  // deben estar activas, cumplir el filtro de discapacidad Y pertenecer al sector seleccionado
  // En zona urbana, ademas aplica el filtro de barrio si esta seleccionado
  const personasPanel = lista.filter((p) => {
    if (p.activo !== 1) return false;
    if (!sectorSeleccionado) return false;

    const cumpleDiscapacidad =
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase();

    const cumpleBarrio =
      !esZonaUrbana || filtroBarrio === "" || p.sector === filtroBarrio;

    return cumpleDiscapacidad && cumpleBarrio && p.cod_sector === sectorSeleccionado;
  });

  // Total de personas activas (con el filtro de discapacidad aplicado) para el contador del encabezado
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
          <button className="login-btn">🔒 Iniciar sesion</button>
        </Link>
      </header>

      <div className="app-container">

        {/* Mapa interactivo de Leaflet con los sectores de Aratoca */}
        <div className="mapa-container">
          <Mapa
            personas={personasFiltradas}
            onSelectPersona={() => {}}
            // onSelectSector: cuando el usuario hace clic en un sector del mapa,
            // guarda el codigo del sector para filtrar las personas del panel
            onSelectSector={(cod) => { setSectorSeleccionado(cod); setFiltroBarrio(""); }}
            onSelectNombreSector={setNombreSector}
            onSelectVereda={setNombreVereda}
          />
        </div>

        {/* Panel lateral con la lista de personas del sector seleccionado */}
        <div className="panel-container">

          {/* Muestra el total de personas del sector si hay uno seleccionado,
              o el total general si no hay ninguno seleccionado */}
          <h2>Personas: {sectorSeleccionado ? personasPanel.length : totalPersonas}</h2>

          {nombreVereda && lista.find(p => p.cod_sector === sectorSeleccionado)?.zona !== "URBANO" && (
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

          {/* Filtro de barrio: solo aparece cuando el sector seleccionado es Urbano */}
          {esZonaUrbana && barriosDisponibles.length > 0 && (
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

          {/* Lista de personas: muestra mensaje si no hay sector seleccionado,
              muestra las personas si hay sector, o avisa si no hay personas en ese sector */}
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
                {/* Muestra Si o No segun el valor numerico de tiene_cuidador (1 o 0) */}
                <p><strong>Cuidador: </strong>{p.tiene_cuidador ? "Si" : "No"}</p>
                {/* Compara con "SI" porque asi viene guardado en la base de datos */}
                <p><strong>RLCPD: </strong>{p.rlcpd === "SÍ" ? "Si" : "No"}</p>
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
