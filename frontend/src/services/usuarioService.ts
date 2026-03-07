export const login = async (email: string, password: string) => {

  const response = await fetch("http://localhost:7800/api/usuarios/login", {
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