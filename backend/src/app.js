// express es el framework web de Node.js que usamos para crear el servidor HTTP.
// Maneja las rutas, los middlewares y las respuestas al cliente.
const express = require("express");

// cors (Cross-Origin Resource Sharing) es una politica de seguridad del navegador.
// Por defecto, el navegador bloquea peticiones de un origen (dominio:puerto) a otro diferente.
// app.use(cors()) habilita el servidor para aceptar peticiones de cualquier origen,
// lo que es necesario porque el frontend (ej: puerto 5173) llama al backend (ej: puerto 7800).
const cors = require("cors");

// Importa los archivos de rutas. Cada archivo agrupa todos los endpoints de un recurso.
const personaRoutes = require("./routes/personaRoutes");
const authRoutes    = require("./routes/usuarioRoutes");

// Crea la aplicacion Express. "app" es el objeto central del servidor.
const app = express();

// app.use() registra middlewares globales que se aplican a TODAS las peticiones.
app.use(cors());

// express.json() es un middleware que lee el cuerpo (body) de las peticiones con formato JSON
// y lo convierte a un objeto JavaScript accesible en req.body.
// Sin esto, req.body seria undefined en POST/PUT/PATCH.
app.use(express.json());

// Registra los grupos de rutas con un prefijo de URL.
// Cualquier peticion que empiece con /api/personas la maneja personaRoutes.
// Cualquier peticion que empiece con /api/usuarios la maneja authRoutes.
app.use("/api/personas", personaRoutes);
app.use("/api/usuarios", authRoutes);

// Ruta de prueba en la raiz del servidor.
// Sirve para verificar rapidamente que el servidor esta corriendo (ej: al hacer deploy).
app.get("/", (req, res) => {
  res.send("Server funcionando");
});

// Exporta la app para que server.js pueda iniciarla.
// Separar la configuracion (app.js) del arranque (server.js) facilita las pruebas.
module.exports = app;
