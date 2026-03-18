import type { Persona } from "../types/person";

const API_URL = "http://localhost:7800/api/personas";

export const obtenerPersonas = async (): Promise<Persona[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener personas");
  return await response.json();
};

export const crearPersona = async (persona: Partial<Persona>) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(persona),
  });
  if (!response.ok) throw new Error("Error creando persona");
  return await response.json();
};

export const editarPersona = async (id: number, persona: Partial<Persona>) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(persona),
  });
  if (!response.ok) throw new Error("Error editando persona");
  return await response.json();
};

export const inactivarPersona = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}/inactivar`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Error inactivando persona");
  return await response.json();
};