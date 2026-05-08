// Servicio que centraliza todas las llamadas HTTP relacionadas con usuarios administradores.
// Separa la logica de red de los componentes de UI.

import { API } from "../config/api";
// authHeaders() agrega el token JWT a cada peticion protegida
import { authHeaders } from "../config/auth";

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN (ruta publica, no necesita token)
// Envia email y password al backend y recibe el token JWT + datos del usuario.
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API.usuarios}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // No enviamos token aqui: el usuario aun no lo tiene
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Si el servidor respondio con error (ej: 401 credenciales incorrectas),
  // lanzamos un Error con el mensaje del servidor para mostrarselo al usuario.
  if (!response.ok) {
    throw new Error(data.mensaje || "Error en login");
  }

  return data; // { token, usuario: { id_usuario, nombre, email, rol } }
};

// ─────────────────────────────────────────────────────────────────────────────
// CREAR ADMINISTRADOR (requiere token)
// ─────────────────────────────────────────────────────────────────────────────
export const crearAdmin = async (data: any) => {
  const response = await fetch(API.usuarios, {
    method: "POST",
    headers: authHeaders(), // Incluye token porque solo admins logueados pueden crear otros admins
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Error creando administrador");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER TODOS LOS ADMINISTRADORES (requiere token)
// ─────────────────────────────────────────────────────────────────────────────
export const obtenerAdmins = async () => {
  const response = await fetch(API.usuarios, { headers: authHeaders() });
  if (!response.ok) throw new Error("Error obteniendo admins");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMBIAR ESTADO DE UN ADMINISTRADOR (requiere token)
// estado: 1 = activo, 0 = inactivo
// ─────────────────────────────────────────────────────────────────────────────
export const cambiarEstadoAdmin = async (id: number, estado: number) => {
  const response = await fetch(`${API.usuarios}/${id}/estado`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ estado })
  });
  if (!response.ok) throw new Error("Error cambiando estado");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER ADMINISTRADOR POR ID (requiere token)
// Se usa en el formulario de edicion para cargar los datos actuales del admin.
// ─────────────────────────────────────────────────────────────────────────────
export const obtenerAdminPorId = async (id: number) => {
  const response = await fetch(`${API.usuarios}/${id}`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Error obteniendo admin");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// EDITAR ADMINISTRADOR (requiere token)
// ─────────────────────────────────────────────────────────────────────────────
export const editarAdmin = async (id: number, data: any) => {
  const response = await fetch(`${API.usuarios}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Error actualizando admin");
  return await response.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// RECUPERAR CONTRASEÑA (ruta publica, no necesita token)
// ─────────────────────────────────────────────────────────────────────────────
export const recuperarContrasena = async (email: string) => {
  const response = await fetch(`${API.usuarios}/recuperar-contrasena`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al enviar el correo");
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// RESET PASSWORD (ruta publica, no necesita token)
// ─────────────────────────────────────────────────────────────────────────────
export const resetPassword = async (token: string, nuevaPassword: string) => {
  const response = await fetch(`${API.usuarios}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, nuevaPassword })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al resetear contraseña");
  return data;
};