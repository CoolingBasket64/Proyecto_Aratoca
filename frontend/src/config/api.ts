const BASE_URL = import.meta.env.VITE_API_URL;

export const API = {
  base: BASE_URL,
  usuarios: `${BASE_URL}api/usuarios`,
  personas: `${BASE_URL}api/personas`,
};