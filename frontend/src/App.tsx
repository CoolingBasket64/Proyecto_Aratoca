import { useEffect, useState } from "react";
import { obtenerPersonas } from "../src/services/personService";
import type { Persona } from "../src/types/person";

function Dashboard() {
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    const cargarPersonas = async () => {
      const data = await obtenerPersonas();
      setPersonas(data);
    };

    cargarPersonas();
  }, []);

  return (
    <div>
      <h2>Personas Registradas</h2>
      <ul>
        {personas.map((persona) => (
          <li key={persona.id}>
            {persona.nombre} - {persona.tipoDiscapacidad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;