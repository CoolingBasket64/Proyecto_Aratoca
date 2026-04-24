// import.meta.env es la forma de Vite de leer variables de entorno del archivo .env del frontend.
// Las variables deben comenzar con VITE_ para que Vite las exponga al codigo del navegador.
// Ejemplo en .env: VITE_API_URL=http://localhost:7800/
// En produccion (Vercel), esta variable se configura en el panel de la plataforma.
const BASE_URL = import.meta.env.VITE_API_URL;

// Centralizamos todas las URLs del backend en un solo objeto.
// Asi si la URL cambia, solo se edita aqui y no en cada archivo que hace fetch.
export const API = {
  base:     BASE_URL,
  usuarios: `${BASE_URL}api/usuarios`, // Endpoints de autenticacion y gestion de admins
  personas: `${BASE_URL}api/personas`, // Endpoints de personas con discapacidad
};
