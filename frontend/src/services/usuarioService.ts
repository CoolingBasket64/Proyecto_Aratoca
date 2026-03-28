const API_URL = "http://localhost:7800/api/usuarios";
export const login = async (email: string, password: string) => {

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error en login");
  }

  return data;
};

export const crearAdmin = async (data: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Error creando administrador");
  }

  return await response.json();
};

export const obtenerAdmins = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) throw new Error("Error obteniendo admins");

  return await response.json();
};

export const cambiarEstadoAdmin = async (id: number, estado: number) => {
  const response = await fetch(`${API_URL}/${id}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ estado })
  });

  if (!response.ok) throw new Error("Error cambiando estado");

  return await response.json();
};

export const obtenerAdminPorId = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) throw new Error("Error obteniendo admin");

  return await response.json();
};

export const editarAdmin = async (id: number, data: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Error actualizando admin");

  return await response.json();
};