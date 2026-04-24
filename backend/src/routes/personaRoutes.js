const express = require("express");

// Router crea un "mini-servidor" de Express que agrupa rutas relacionadas.
// Luego se monta en app.js con app.use("/api/personas", personaRoutes),
// por lo que todas las rutas definidas aqui tendran el prefijo /api/personas.
const router = express.Router();

// Importamos el middleware que verifica si el usuario tiene un JWT valido.
// Se aplicara a todas las rutas privadas de este archivo.
const verificarToken = require("../middleware/authMiddleware");

// Importamos las funciones del controlador. Cada funcion maneja la logica de un endpoint.
const {
  obtenerPersonasPublicas, // Devuelve datos limitados sin requerir autenticacion (para el mapa publico)
  obtenerPersonas,         // Devuelve todos los datos completos (requiere token)
  crearPersona,            // Crea una nueva persona con discapacidad
  editarPersona,           // Actualiza los datos de una persona existente
  cambiarEstadoPersona,    // Activa o inactiva una persona
  obtenerPersonaPorId,     // Devuelve todos los datos de una persona especifica
  buscarCuidadorPorDocumento // Busca un cuidador por documento para autocompletar el formulario
} = require("../controllers/personaController");

// ─── RUTA PUBLICA ──────────────────────────────────────────────────────────────
// GET /api/personas/publico
// No requiere token. Devuelve solo campos no sensibles (sin nombre, documento ni celular).
// La usa el mapa de la pagina de inicio para mostrar contadores sin que el usuario este logueado.
// IMPORTANTE: esta ruta debe estar ANTES de router.use(verificarToken),
// de lo contrario el middleware la interceptaria y exigiria token.
router.get("/publico", obtenerPersonasPublicas);

// ─── RUTAS PRIVADAS ────────────────────────────────────────────────────────────
// router.use(verificarToken) aplica el middleware a TODAS las rutas que se definan despues.
// Si el token no existe o no es valido, el middleware responde con 401/403 y
// el controlador nunca se ejecuta.
router.use(verificarToken);

// GET /api/personas -> lista completa con todos los campos (nombre, documento, celular, etc.)
router.get("/", obtenerPersonas);

// POST /api/personas -> crea una nueva persona (los datos vienen en req.body)
router.post("/", crearPersona);

// PUT /api/personas/:id -> actualiza todos los datos de una persona.
// :id es un parametro dinamico accesible en el controlador como req.params.id
router.put("/:id", editarPersona);

// PATCH /api/personas/:id/inactivar -> cambia solo el campo "activo" de una persona.
// Se usa PATCH (no PUT) porque solo se modifica un campo, no el registro completo.
router.patch("/:id/inactivar", cambiarEstadoPersona);

// GET /api/personas/cuidador/:documento -> busca un cuidador por su numero de documento.
// IMPORTANTE: esta ruta debe ir ANTES de /:id para que Express no confunda
// la palabra "cuidador" con un ID numerico.
router.get("/cuidador/:documento", buscarCuidadorPorDocumento);

// GET /api/personas/:id -> datos completos de una persona, incluyendo cuidador y ubicacion.
router.get("/:id", obtenerPersonaPorId);

module.exports = router;
