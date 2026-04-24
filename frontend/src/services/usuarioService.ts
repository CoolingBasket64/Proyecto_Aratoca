// Servicio que maneja todas las peticiones HTTP relacionadas con usuarios administradores

const API_URL = "http://localhost:7800/api/usuarios";

// Autentica al usuario con email y contrasena
export const login = async (email: string, password: string) => {

  const response = await fetch(`${API_URL}/login`, {
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

// Retorna la lista de todos los administradores
export const obtenerAdmins = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) throw new Error("Error obteniendo admins");

  return await response.json();
};

// Activa o inactiva un administrador segun el valor de estado (1=activo, 0=inactivo)
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

// Obtiene los datos de un administrador especifico por su ID
export const obtenerAdminPorId = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) throw new Error("Error obteniendo admin");

  return await response.json();
};

// Edita el nombre, email y opcionalmente la contrasena de un administrador
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
