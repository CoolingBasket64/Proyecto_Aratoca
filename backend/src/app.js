const express = require("express");
const cors = require("cors");

// Importa los archivos de rutas para personas y usuarios
const personaRoutes = require("./routes/personaRoutes");
const authRoutes = require("./routes/usuarioRoutes");

// Crea la aplicacion Express
const app = express();

// Permite que el frontend (otro origen/puerto) pueda hacer peticiones al backend
// Sin esto el navegador bloquearia las peticiones por politica de seguridad CORS
app.use(cors());

// Permite que Express entienda el cuerpo de las peticiones en formato JSON
// Sin esto req.body llegaria como undefined
app.use(express.json());

// Registra las rutas: todas las peticiones que lleguen a /api/personas
// seran manejadas por personaRoutes, y las de /api/usuarios por authRoutes
app.use("/api/personas", personaRoutes);
app.use("/api/usuarios", authRoutes);

// Ruta raiz de prueba para verificar que el servidor esta corriendo
app.get("/", (req, res) => {
  res.send("Server funcionando");
});

// Exporta la app para que server.js pueda usarla
module.exports = app;
