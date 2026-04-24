const express = require("express");

// Router es un mini-servidor de Express que agrupa rutas relacionadas
const router = express.Router();

// Importa las funciones del controlador que se ejecutaran cuando llegue cada peticion
const {
  obtenerPersonas,
  crearPersona,
  editarPersona,
  cambiarEstadoPersona,
  obtenerPersonaPorId,
  buscarCuidadorPorDocumento
} = require("../controllers/personaController");

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
