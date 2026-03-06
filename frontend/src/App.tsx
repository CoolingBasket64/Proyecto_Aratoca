import { useEffect, useState } from "react";
import Mapa from "./components/mapa";
import { obtenerPersonas } from "./services/personService";
import type { Persona } from "./types/person";
import "./App.css";

function App() {
  
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personaSeleccionada, setPersonaSeleccionada] =
    useState<Persona | null>(null);

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        const data = await obtenerPersonas();
        console.log("DATA DEL BACKEND:", data);
        setPersonas(data);
      } catch (error) {
        console.error("Error cargando personas:", error);
      }
    };

    cargarPersonas();
  }, []);

  return (
  <div className="app-container">
    <div className="mapa-container">
      <Mapa
        personas={personas}
        onSelectPersona={setPersonaSeleccionada}
      />
    </div>

    <div className="panel-container">
      <h2>Personas Registradas: {personas.length}</h2>

      {personaSeleccionada ? (
        <div>
          <h3>{personaSeleccionada.nombre}</h3>
          <p>Edad: {personaSeleccionada.edad}</p>
          <p>Género: {personaSeleccionada.genero}</p>
          <p>Discapacidad: {personaSeleccionada.tipoDiscapacidad}</p>
          <p>Sector: {personaSeleccionada.sector}</p>
        </div>
      ) : (
        <p>Selecciona un punto en el mapa</p>
      )}
    </div>
  </div>
  
);

}

export default App;