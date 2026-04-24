// Los servicios centralizan todas las llamadas al backend.
// En lugar de escribir fetch() en cada componente, se definen aqui
// y los componentes simplemente llaman a estas funciones.

import type { Persona } from "../types/person";
import { API } from "../config/api";
import { authHeaders } from "../config/auth";

// fetch() es la funcion nativa del navegador para hacer peticiones HTTP al backend.
// Es asincrona: retorna una Promesa que se resuelve cuando el servidor responde.
// response.ok es true si el codigo HTTP esta entre 200-299 (exitoso)
// response.json() convierte la respuesta de texto JSON a un objeto JavaScript

// Obtiene todas las personas del backend
export const obtenerPersonasPublicas = async (): Promise<Partial<Persona>[]> => {
  const response = await fetch(`${API.personas}/publico`);
  if (!response.ok) throw new Error("Error al obtener personas");
  return await response.json();
};

export const obtenerPersonas = async (): Promise<Persona[]> => {
  const response = await fetch(API.personas, { headers: authHeaders() });
  if (!response.ok) throw new Error("Error al obtener personas");
  return await response.json();
};

// Crea una nueva persona. Partial<Persona> significa que no todos los campos son obligatorios
export const crearPersona = async (persona: Partial<Persona>) => {
  const response = await fetch(API.personas, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(persona),
  });
  if (!response.ok) throw new Error("Error creando persona");
  return await response.json();
};

// Edita una persona existente por su ID
export const editarPersona = async (id: number, persona: Partial<Persona>) => {
  const response = await fetch(`${API.personas}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(persona),
  });
  if (!response.ok) throw new Error("Error editando persona");
  return await response.json();
};

// Cambia el estado activo/inactivo de una persona
export const cambiarEstado = async (
  id: number,
  estado: number,
  razon: string
) => {
  const response = await fetch(`${API.personas}/${id}/inactivar`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ estado, razon })
  });

  if (!response.ok) throw new Error("Error cambiando estado");

  return await response.json();
};

// Obtiene los datos completos de una persona por su ID (incluye cuidador y ubicacion)
export const obtenerPersonaPorId = async (id: number): Promise<Persona> => {
  const response = await fetch(`${API.personas}/${id}`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Error obteniendo persona");
  return await response.json();
};

export const buscarCuidadorPorDocumento = async (documento: string) => {
  const response = await fetch(`${API.personas}/cuidador/${documento}`, { headers: authHeaders() });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Error buscando cuidador");
  return await response.json();
};
