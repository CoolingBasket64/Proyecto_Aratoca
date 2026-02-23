import type { Persona } from "../types/person";

export const obtenerPersonas = async (): Promise<Persona[]> => {
  const response = await fetch("http://localhost:7800/api/personas");
  const data = await response.json();
  return data;
};