const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");

const {
  obtenerPersonasPublicas,
  obtenerPersonas,
  crearPersona,
  editarPersona,
  cambiarEstadoPersona,
  obtenerPersonaPorId,
  buscarCuidadorPorDocumento
} = require("../controllers/personaController");

// Ruta publica: solo devuelve campos no sensibles, sin token
router.get("/publico", obtenerPersonasPublicas);

// Todas las rutas debajo requieren autenticacion
router.use(verificarToken);

// GET /api/personas -> retorna la lista de todas las personas
router.get("/", obtenerPersonas);

// POST /api/personas -> crea una nueva persona (los datos llegan en req.body)
router.post("/", crearPersona);

// PUT /api/personas/:id -> edita todos los datos de una persona por su ID
router.put("/:id", editarPersona);

// PATCH /api/personas/:id/inactivar -> cambia solo el estado activo/inactivo de una persona
// PATCH se usa cuando se actualiza un campo puntual, no el registro completo
router.patch("/:id/inactivar", cambiarEstadoPersona);

// GET /api/personas/cuidador/:documento -> busca un cuidador por su numero de documento
// Esta ruta va ANTES de /:id para que Express no confunda "cuidador" con un ID numerico
router.get("/cuidador/:documento", buscarCuidadorPorDocumento);

// GET /api/personas/:id -> retorna los datos completos de una persona por su ID
router.get("/:id", obtenerPersonaPorId);

module.exports = router;
