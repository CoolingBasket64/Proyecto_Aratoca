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

export const cambiarEstado = async (
  id: number,
  estado: number,
  razon: string
) => {
  const response = await fetch(`${API_URL}/${id}/inactivar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado, razon })
  });

  if (!response.ok) throw new Error("Error cambiando estado");

  return await response.json();
};
export const obtenerPersonaPorId = async (id: number): Promise<Persona> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error obteniendo persona");
  return await response.json();
};