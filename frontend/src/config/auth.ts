// Este archivo centraliza la logica de autenticacion del frontend.
// Al tenerla aqui, todos los servicios usan la misma forma de leer el token
// y construir los headers, sin repetir codigo.

// Obtiene el token JWT guardado en localStorage.
// localStorage es un almacenamiento del navegador que persiste aunque se recargue la pagina.
// El token se guarda al hacer login y se elimina al cerrar sesion.
// Retorna null si no hay token (usuario no logueado).
export const getToken = (): string | null => localStorage.getItem("token");

// Construye los headers HTTP que se deben incluir en cada peticion protegida.
// "Content-Type: application/json" le dice al servidor que el cuerpo es JSON.
// "Authorization: Bearer <token>" envia el token para que el middleware lo verifique.
// HeadersInit es el tipo de TypeScript para los headers de fetch().
export const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});
