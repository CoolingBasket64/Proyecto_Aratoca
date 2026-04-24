// Los servicios centralizan todas las llamadas HTTP al backend.
// En lugar de escribir fetch() directamente en cada componente, se definen aqui funciones
// reutilizables que los componentes llaman. Esto separa la logica de red de la UI.

import type { Persona } from "../types/person";
import { API } from "../config/api";
// authHeaders() construye los headers con el token JWT para las rutas privadas
import { authHeaders } from "../config/auth";

// fetch() es la API nativa del navegador para hacer peticiones HTTP.
// Siempre retorna una Promesa que se resuelve cuando el servidor responde.
// response.ok es true si el codigo HTTP esta entre 200-299 (exito).
// response.json() parsea el cuerpo de la respuesta de texto JSON a objeto JavaScript.

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER PERSONAS PUBLICAS (sin token)
// Usada en el Home para el mapa. Solo trae campos no sensibles.
// ─────────────────────────────────────────────────────────────────────────────
export const obtenerPersonasPublicas = async (): Promise<Partial<Persona>[]> => {
  // Partial<Persona> significa que no todos los campos de Persona estaran presentes,
  // ya que este endpoint devuelve un subconjunto de campos por seguridad.
  const response = await fetch(`${API.personas}/publico`);
  if (!response.ok) throw new Error("Error al obtener personas");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER TODAS LAS PERSONAS (requiere token)
// Usada en el dashboard, gestion y reportes. Trae todos los campos.
// ─────────────────────────────────────────────────────────────────────────────
export const obtenerPersonas = async (): Promise<Persona[]> => {
  const response = await fetch(API.personas, { headers: authHeaders() });
  if (!response.ok) throw new Error("Error al obtener personas");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// CREAR PERSONA
// Partial<Persona> porque al crear no tenemos aun id_persona ni codigo (los genera el backend).
// ─────────────────────────────────────────────────────────────────────────────
export const crearPersona = async (persona: Partial<Persona>) => {
  const response = await fetch(API.personas, {
    method: "POST",                // POST se usa para crear nuevos recursos
    headers: authHeaders(),        // Incluye Content-Type y el token JWT
    body: JSON.stringify(persona), // Convierte el objeto JavaScript a texto JSON para enviarlo
  });
  if (!response.ok) throw new Error("Error creando persona");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// EDITAR PERSONA
// PUT reemplaza todos los datos del recurso con los nuevos valores enviados.
// ─────────────────────────────────────────────────────────────────────────────
export const editarPersona = async (id: number, persona: Partial<Persona>) => {
  const response = await fetch(`${API.personas}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(persona),
  });
  if (!response.ok) throw new Error("Error editando persona");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMBIAR ESTADO (activar/inactivar)
// PATCH actualiza solo un campo especifico del recurso (no el recurso completo).
// ─────────────────────────────────────────────────────────────────────────────
export const cambiarEstado = async (id: number, estado: number, razon: string) => {
  const response = await fetch(`${API.personas}/${id}/inactivar`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ estado, razon })
  });
  if (!response.ok) throw new Error("Error cambiando estado");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER PERSONA POR ID
// Se usa en el formulario de edicion para cargar los datos actuales de la persona.
// ─────────────────────────────────────────────────────────────────────────────
export const obtenerPersonaPorId = async (id: number): Promise<Persona> => {
  const response = await fetch(`${API.personas}/${id}`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Error obteniendo persona");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// BUSCAR CUIDADOR POR DOCUMENTO
// Se llama al perder el foco del campo documento del cuidador para autocompletar.
// Retorna null si el cuidador no existe (404), en lugar de lanzar un error.
// ─────────────────────────────────────────────────────────────────────────────
export const buscarCuidadorPorDocumento = async (documento: string) => {
  const response = await fetch(`${API.personas}/cuidador/${documento}`, { headers: authHeaders() });
  // 404 es esperado cuando el cuidador no existe; no es un error, el formulario queda vacio
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Error buscando cuidador");
  return await response.json();
};
