// Servicio que maneja todas las peticiones HTTP relacionadas con usuarios administradores

import { API } from "../config/api";
import { authHeaders } from "../config/auth";

// Autentica al usuario con email y contrasena
export const login = async (email: string, password: string) => {

  const response = await fetch(`${API.usuarios}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // JSON.stringify convierte el objeto {email, password} a texto para enviarlo en el body
    body: JSON.stringify({
      email,
      password
    }),
  });

  const data = await response.json();

  // Si el servidor responde con un error (ej: 401 credenciales incorrectas),
  // lanza un Error con el mensaje del servidor para mostrarselo al usuario
  if (!response.ok) {
    throw new Error(data.mensaje || "Error en login");
  }

  return data;
};

// Crea un nuevo administrador. "any" permite cualquier tipo de dato (evitar en lo posible)
export const crearAdmin = async (data: any) => {
  const response = await fetch(API.usuarios, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Error creando administrador");

  return await response.json();
};

export const obtenerAdmins = async () => {
  const response = await fetch(API.usuarios, { headers: authHeaders() });

  if (!response.ok) throw new Error("Error obteniendo admins");

  return await response.json();
};

export const cambiarEstadoAdmin = async (id: number, estado: number) => {
  const response = await fetch(`${API.usuarios}/${id}/estado`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ estado })
  });

  if (!response.ok) throw new Error("Error cambiando estado");

  return await response.json();
};

export const obtenerAdminPorId = async (id: number) => {
  const response = await fetch(`${API.usuarios}/${id}`, { headers: authHeaders() });

  if (!response.ok) throw new Error("Error obteniendo admin");

  return await response.json();
};

export const editarAdmin = async (id: number, data: any) => {
  const response = await fetch(`${API.usuarios}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Error actualizando admin");

  return await response.json();
};
